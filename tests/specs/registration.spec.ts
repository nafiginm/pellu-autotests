import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registration.page';
import { DashboardPage } from '../pages/dashboard.page';
import { createRandomAccount, getVerificationCode } from '../utils/mail.util';

test.describe('Регистрация', () => {
  test(
    'Полный цикл создания аккаунта через Mailsac',
    { tag: ['@smoke', '@reg'] },
    async ({ page, context }, testInfo) => {
      // Общий таймаут теста 3 минуты (180000ms)
      test.setTimeout(180000);

      const registrationPage = new RegistrationPage(page);
      const dashboardPage = new DashboardPage(page);

      await context.clearCookies();

      const account = await createRandomAccount();
      console.log(`[Test] Email: ${account.email}`);

      await registrationPage.open();

      // Заполнение формы
      await registrationPage.fillInitialForm(
        'Jack Williams',
        account.email,
        account.password,
      );

      // Даем бэкенду фору в 5 секунд перед первым запросом к API почты
      console.log(`[Test] Ждем инициации отправки...`);
      await page.waitForTimeout(5000);

      // Ожидание кода
      const code = await getVerificationCode(account.email);
      console.log(`[Test] Код подтверждения получен: ${code}`);

      // Завершение
      await registrationPage.fillCode(code);
      await registrationPage.acceptTermsAndFinish();

      await dashboardPage.isLoaded();
    },
  );
});
