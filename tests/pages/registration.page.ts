import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RegistrationPage extends BasePage {
  readonly toRegistrationTabBtn: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueBtn: Locator;
  readonly codeCells: Locator;
  readonly verifyContinueBtn: Locator;
  readonly termsCheckbox: Locator;
  readonly newsCheckbox: Locator;
  readonly finalContinueBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.toRegistrationTabBtn = page
      .getByRole('button')
      .filter({ hasText: /Sign Up|Регистрация/i });
    this.nameInput = page.locator('input[type="text"]');
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.continueBtn = page
      .getByRole('button')
      .filter({ hasText: /Continue|Продолжить/i });
    this.codeCells = page.locator('input.otp-input');
    this.verifyContinueBtn = page
      .locator('.otp-input-container + button, button.q-btn--actionable')
      .last();
    this.termsCheckbox = page.locator('.q-checkbox').first();
    this.newsCheckbox = page.locator('.q-checkbox').last();
    this.finalContinueBtn = page.locator('button.q-btn--unelevated').last();
  }

  async open() {
    await this.page.goto('/auth', { waitUntil: 'load' });
    await this.toRegistrationTabBtn.waitFor({
      state: 'visible',
      timeout: 20000,
    });
    await this.toRegistrationTabBtn.click();
    await expect(this.nameInput).toBeVisible({ timeout: 20000 });
  }

  async fillInitialForm(name: string, email: string, pass: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);

    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) =>
          res.request().method() === 'POST' &&
          (res.url().toLowerCase().includes('register') ||
            res.url().toLowerCase().includes('auth')),
        { timeout: 30000 },
      ),
      this.continueBtn.click(),
    ]);

    console.log(`[Backend] Статус: ${response.status()}`);
    if (response.status() >= 400) {
      const body = await response.text();
      console.error(`[Backend] Ошибка: ${body}`);
      throw new Error(`Бэкенд отклонил регистрацию: ${response.status()}`);
    }
  }

  async fillCode(code: string) {
    await this.codeCells.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.codeCells.first().click();
    await this.page.keyboard.type(code, { delay: 150 });
    await this.verifyContinueBtn.click();
  }

  async acceptTermsAndFinish() {
    await this.termsCheckbox.waitFor({ state: 'visible', timeout: 20000 });
    await this.termsCheckbox.click({ force: true });
    await this.newsCheckbox.click({ force: true });
    await this.finalContinueBtn.click();
  }
}
