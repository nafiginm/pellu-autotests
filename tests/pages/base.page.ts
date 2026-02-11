import { Page, Response, expect } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async actAndWaitForResponse(
    action: () => Promise<void>,
    urlPart: string,
    expectedStatus = 200,
  ): Promise<Response> {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) => res.url().toLowerCase().includes(urlPart.toLowerCase()),
        { timeout: 30000 },
      ),
      action(),
    ]);

    const actualStatus = response.status();
    if (actualStatus !== expectedStatus) {
      let errorBody: string;
      try {
        const json = await response.json();
        errorBody = JSON.stringify(json, null, 2);
      } catch {
        errorBody = await response.text();
      }

      throw new Error(
        `API Error [${urlPart}]: Expected ${expectedStatus}, but got ${actualStatus}.\n` +
          `URL: ${response.url()}\n` +
          `Response Body: ${errorBody}`,
      );
    }
    return response;
  }

  async expectPath(urlPart: string, timeout = 15000) {
    await expect(this.page).toHaveURL(new RegExp(urlPart), { timeout });
  }
}
