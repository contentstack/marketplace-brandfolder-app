import { expect, Page } from "@playwright/test";

export class BrandfolderConfig {
  readonly page: Page;
  configFrame: import("@playwright/test").Frame | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  async initializeIframe() {
    await this.page.waitForLoadState("load");
    const iframeSelectors = [
      ".app-extension-component",
      '[data-testid="app-extension-frame"]',
      '[data-test-id="full-page-location-iframe"]',
      'iframe[title*="Config"]',
    ];
    let handle: Awaited<ReturnType<Page["$"]>> = null;
    for (const sel of iframeSelectors) {
      try {
        await this.page.waitForSelector(sel, { timeout: 10000 });
        handle = await this.page.$(sel);
        if (handle) break;
      } catch {
        continue;
      }
    }
    if (!handle) {
      throw new Error("Config app iframe not found");
    }
    this.configFrame = await handle.contentFrame();
  }

  getConfigWrapper() {
    if (!this.configFrame) throw new Error("Config iframe not initialized");
    return this.configFrame.locator('[data-testid="config-wrapper"]');
  }

  async waitForConfigLoaded() {
    const wrapper = this.getConfigWrapper();
    await wrapper.waitFor({ state: "visible", timeout: 10000 });
    await expect(wrapper).toBeVisible();
  }
}
