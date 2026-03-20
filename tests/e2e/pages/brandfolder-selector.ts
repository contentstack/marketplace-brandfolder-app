import { expect, Page } from "@playwright/test";

/**
 * Selector page (`#/selector-page`) is normally opened as a popup from the custom field.
 * The parent window sends a postMessage `init` with `config`; until then, the UI only
 * shows the shell (wrapper / header / empty container). Warnings appear after `init`
 * when config is invalid or the Brandfolder panel fails (see CustomSelector / root_config).
 */
export class BrandfolderSelector {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForSelectorLoaded() {
    const wrapper = this.page.locator('[data-testid="selector-wrapper"]');
    await wrapper.waitFor({ state: "visible", timeout: 15000 });
    await expect(wrapper).toBeVisible();
  }

  getSelectorWrapper() {
    return this.page.locator('[data-testid="selector-wrapper"]');
  }

  getSelectorHeader() {
    return this.page.locator('[data-testid="selector-header"]');
  }

  getSelectorTitle() {
    return this.page.locator('[data-testid="selector-title"]');
  }

  getSelectorContainer() {
    return this.page.locator('[data-testid="selector-container"]');
  }

  getPanelAnchor() {
    return this.page.locator("#panel-anchor");
  }

  getWarningComponent() {
    return this.page.locator('[data-testid="warning-component"]');
  }

  /** After the custom-field → selector handshake, either the panel mounts or an error banner shows. */
  async expectPickerOrWarningAfterInit() {
    const warning = this.getWarningComponent();
    const anchor = this.getPanelAnchor();
    await expect
      .poll(
        async () => {
          if (await warning.isVisible()) return true;
          // #panel-anchor is rendered once `init` runs and CustomSelector mounts (may have zero size).
          return (await anchor.count()) > 0;
        },
        { timeout: 25_000, intervals: [200, 500, 1000] }
      )
      .toBeTruthy();
  }

  async expectWarningVisible() {
    const warning = this.getWarningComponent();
    await expect(warning).toBeVisible();
  }

  /**
   * Direct navigation to `#/selector-page` without `window.opener` / `init` message:
   * shell renders but the picker and warning are not shown.
   */
  async expectShellOnlyWithoutInitHandshake() {
    await this.waitForSelectorLoaded();
    await expect(this.getSelectorHeader()).toBeVisible();
    await expect(this.getSelectorTitle()).toBeVisible();
    await expect(this.getWarningComponent()).toHaveCount(0);
  }
}
