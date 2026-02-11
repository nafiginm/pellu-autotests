import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly searchInput: Locator;
  readonly newProjectBtn: Locator;
  readonly projectsHeader: Locator;
  readonly skeletonLoader: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder]');
    this.newProjectBtn = page.locator('#new-project-btn');
    this.projectsHeader = page.locator('.projects-table__header');
    this.skeletonLoader = page.locator('.q-skeleton');
  }

  async isLoaded() {
    await this.expectPath('dashboard', 15000);

    // Ждем, пока скелетоны исчезнут (detached означает удаление из DOM)
    // Это критично для VPN, когда данные могут "залипнуть"
    await this.skeletonLoader
      .first()
      .waitFor({ state: 'detached', timeout: 30000 })
      .catch(() => {});

    // Проверяем видимость заголовка (независимо от языка за счет класса)
    await expect(this.projectsHeader).toBeVisible({ timeout: 15000 });
    await expect(this.newProjectBtn).toBeVisible();
  }
}
