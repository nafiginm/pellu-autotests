import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[type="email"], input[name="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    // Выбираем только видимую кнопку входа, игнорируя скрытые элементы Quasar
    this.submitBtn = page
      .locator('button.sign-in__btn')
      .filter({ visible: true })
      .first();
  }

  async open() {
    await this.page.goto('/auth', { waitUntil: 'load' });
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillCredentials(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
  }

  async loginSuccess(email: string, pass: string) {
    await this.fillCredentials(email, pass);
    await this.actAndWaitForResponse(
      () => this.submitBtn.click(),
      'Api/Token/GetToken',
      200,
    );
    await this.page.waitForLoadState('networkidle'); // Гарантируем загрузку ресурсов дашборда
  }
}
