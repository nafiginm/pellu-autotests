import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { AUTH_DATA } from '../data/auth.data';
import path from 'path';

export const STORAGE_STATE = path.join(__dirname, '../../.auth/user.json');

setup('авторизация и сохранение сессии', async ({ page }) => {
  setup.setTimeout(120000);

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.open();
  await loginPage.loginSuccess(
    AUTH_DATA.validUser.email,
    AUTH_DATA.validUser.pass,
  );

  // Ожидание загрузки дашборда подтверждает наличие токена
  await dashboardPage.isLoaded();

  // Небольшая пауза для завершения записи в Storage API браузера
  await page.waitForTimeout(2000);

  await page.context().storageState({ path: STORAGE_STATE });
});
