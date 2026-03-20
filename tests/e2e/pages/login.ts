import { expect, Locator, Page } from "@playwright/test";

export class AppLogin {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly venusPasswordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = this.page.locator('#email, input[name="email"]');
    this.passwordInput = this.page.locator('#pw, input[name="password"]');
    this.venusPasswordInput = this.page.locator('#password, input[name="password"]');
    this.loginButton = this.page.locator('button:has-text("Log In"), button:has-text("LOGIN")');
  }

  async checkAppUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async getLoginPage() {
    const appUrl = process.env.APP_HOST_URL;
    const envUrl = process.env.ENV_URL;
    if (appUrl) {
      await this.page.goto(`${appUrl}`);
      return;
    }
    if (envUrl) {
      await this.page.goto(`${envUrl}#!/login`);
      return;
    }
    throw new Error("APP_HOST_URL or ENV_URL must be set for login navigation");
  }

  async contentstackLogin(id: string | undefined, pass: string | undefined) {
    if (!id || !pass) {
      throw new Error("Missing CONTENTSTACK_LOGIN or CONTENTSTACK_PASSWORD");
    }
    const orgId = process.env.CONTENTSTACK_ORGANIZATION_UID || process.env.ORG_ID;
    if ((await this.page.$(".user-session-page")) !== null) {
      try {
        await this.emailInput.type(id);
        await this.passwordInput.type(pass);
        await this.loginButton.click();
        try {
          await this.page.locator(".user-name").click();
          await this.page.click("text=New Interface");
        } catch (e) {
          console.warn("Switch to new interface not available or failed:", e);
        }
        if (orgId) {
          await this.page.click(".OrgDropdown");
          await this.page.click(`#${orgId}`);
        }
        await this.page.waitForURL(/.*\/(?:stack|dashboard|marketplace|organizations).*/, { timeout: 15000 }).catch(() => console.warn("Timeout waiting for post-login UI"));
        await this.page.context().storageState({ path: "storageState.json" });
        await this.page.close();
      } catch (e) {
        console.error(e);
      }
    } else {
      await this.emailInput.type(id);
      await this.venusPasswordInput.type(pass);
      const venusLoginButton = await this.page.waitForSelector('button:has-text("Log In")');
      await venusLoginButton.click();
      if (orgId) {
        try {
          const orgDropdown = this.page.locator(".OrgDropdown");
          if ((await orgDropdown.count()) > 0 && (await orgDropdown.first().isVisible())) {
            await orgDropdown.first().click();
            const targetOrg = this.page.locator(`#${orgId}`);
            if ((await targetOrg.count()) > 0) {
              await targetOrg.first().click();
            }
          }
        } catch {
          // Skip if not available
        }
      }
      await this.page.waitForURL(/.*\/(?:stack|dashboard|marketplace|organizations).*/, { timeout: 15000 }).catch(() => console.warn("Timeout waiting for post-login UI"));
      await this.page.context().storageState({ path: "storageState.json" });
      await this.page.close();
    }
  }
}
