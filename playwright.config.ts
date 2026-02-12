import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export const STORAGE_STATE = path.join(__dirname, '.auth/user.json');

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : 3,
  reporter: [
    ['html'], // Оставляем стандартный
    ['allure-playwright', { outputFolder: 'allure-results' }], // Добавляем Allure
  ],

  // Глобальный таймаут теста (оставляем 60с)
  timeout: 60000,

  // Настройки ожиданий для ассертов
  expect: {
    // Увеличиваем до 10с, так как через VPN 5с часто не хватает
    timeout: 10000,
  },

  use: {
    baseURL: 'https://my.pellu.xyz',
    // Таймаут для кликов и заполнения полей
    actionTimeout: 15000,
    // Таймаут для загрузки страниц
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'public',
      testMatch: /(auth|registration)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },

    {
      name: 'authorized',
      testIgnore: /(auth|registration)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
});
