import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';

// test.use({ storageState: STORAGE_STATE }); // Удаляем, если в конфиге проект 'authorized' уже это делает

test.describe('Работа с Дашбордом', () => {
  test(
    'Отображение проектов без повторного логина',
    { tag: '@smoke' },
    async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      // Используем baseURL из конфига для стабильности
      // Если нужно попасть в конкретный проект, лучше использовать /dashboard/
      await page.goto('/dashboard/50495');

      // Метод isLoaded теперь включает в себя:
      // 1. Ожидание URL (15с)
      // 2. Ожидание исчезновения скелетонов (30с)
      // 3. Проверку видимости заголовка и кнопок
      await dashboardPage.isLoaded();

      // Повторный ассерт не обязателен, но для наглядности в отчете можно оставить
      await expect(dashboardPage.projectsHeader).toBeVisible();
    },
  );
});
