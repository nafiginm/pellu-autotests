import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { AUTH_DATA } from '../data/auth.data';

test.describe('Модуль авторизации', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.open();
  });

  test(
    'Успешная авторизация и переход на Dashboard',
    { tag: '@smoke' },
    async () => {
      await loginPage.loginSuccess(
        AUTH_DATA.validUser.email,
        AUTH_DATA.validUser.pass,
      );

      // Этот метод уже содержит expect для URL и projectsHeader.
      // Если VPN тормозит, он подождет до 15-30 секунд.
      await dashboardPage.isLoaded();
    },
  );

  test('Ошибка при вводе неверного пароля', async () => {
    await loginPage.fillCredentials(
      AUTH_DATA.validUser.email,
      AUTH_DATA.validUser.pass + 'wrong', // Заведомо неверный пароль
    );

    // Ждем ошибку 401 или 400 от API. Метод сам выбросит ошибку, если статус будет 200.
    await loginPage.actAndWaitForResponse(
      () => loginPage.submitBtn.click(),
      'Api/Token/GetToken',
      400, // Уточните статус вашего API (обычно 400 или 401)
    );

    // Здесь можно добавить проверку UI-нотификации, если она не зависит от языка (например, по классу или иконке)
  });

  for (const email of AUTH_DATA.invalidEmails) {
    test(`Валидация поля email: ${email}`, async () => {
      await loginPage.emailInput.fill(email);
      await loginPage.submitBtn.click();

      const isInvalid = await loginPage.emailInput.evaluate(
        (el: HTMLInputElement) => !el.checkValidity(),
      );
      expect(isInvalid).toBe(true);
    });
  }
});
