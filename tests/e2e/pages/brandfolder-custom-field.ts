import { expect, Page } from "@playwright/test";

export class BrandfolderCustomField {
  readonly page: Page;
  customFieldFrame: import("@playwright/test").Frame | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  async initializeIframe() {
    await this.page.waitForLoadState("load");
    const iframeSelectors = [
      ".app-extension-component",
      '[data-testid="app-extension-frame"]',
      '[data-test-id="full-page-location-iframe"]',
      'iframe[title*="Brandfolder"]',
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
      throw new Error("Custom field app iframe not found");
    }
    this.customFieldFrame = await handle.contentFrame();
  }

  async waitForFieldLoaded() {
    const wrapper = this.getFieldWrapper();
    await wrapper.waitFor({ state: "visible", timeout: 10000 });
    await expect(wrapper).toBeVisible();
  }

  getFieldWrapper() {
    if (!this.customFieldFrame) throw new Error("Custom field iframe not initialized");
    return this.customFieldFrame.locator('[data-testid="field-wrapper"]');
  }

  getNoAssetDiv() {
    if (!this.customFieldFrame) throw new Error("Custom field iframe not initialized");
    return this.customFieldFrame.locator('[data-testid="noAsset-div"]');
  }

  getAddButton() {
    if (!this.customFieldFrame) throw new Error("Custom field iframe not initialized");
    return this.customFieldFrame.locator('[data-testid="add-btn"]');
  }

  getWarningComponent() {
    if (!this.customFieldFrame) throw new Error("Custom field iframe not initialized");
    return this.customFieldFrame.locator('[data-testid="warning-component"]');
  }

  async openSelector() {
    const btn = this.getAddButton();
    await btn.click();
  }
}
