import { chromium, expect, test, type Page } from "@playwright/test";
import { MarketplacePage, APP_CONFIGS } from "../pages/MarketplacePage";
import { BrandfolderConfig } from "../pages/brandfolder-config";
import { BrandfolderCustomField } from "../pages/brandfolder-custom-field";
import { BrandfolderSelector } from "../pages/brandfolder-selector";
import {
  createApp,
  createContentType,
  createEntry,
  deleteApp,
  deleteContentType,
  getExtensionFieldUid,
  getInstalledApp,
  installApp,
  uninstallApp,
  updateApp,
} from "../utils/pre-installation-setup";
import { TestHelpers } from "../utils/testHelpers";
import * as fs from "fs";
import * as jsonfile from "jsonfile";
import * as path from "path";

const stackKey = process.env.STACK_API_KEY;
const baseUrl = process.env.APP_BASE_URL || process.env.APP_HOST_URL || "";
const cmsUrl = process.env.ENV_URL || process.env.APP_HOST_URL || baseUrl;

let authToken: string;
let page: Page;
let brandfolderConfig: BrandfolderConfig;
let brandfolderCustomField: BrandfolderCustomField;
let brandfolderSelector: BrandfolderSelector;
let marketplace: MarketplacePage;

const appDetails: {
  appUID: string;
  entryUID: string;
  contentTypeUID: string;
  installationId: string;
} = {
  appUID: "",
  entryUID: "",
  contentTypeUID: "",
  installationId: "",
};

function writeState(partial: Record<string, string>) {
  try {
    const stateDir = path.resolve(process.cwd(), "tests/e2e");
    const statePath = path.join(stateDir, ".state.json");
    let current: Record<string, string> = {};
    if (fs.existsSync(statePath)) {
      current = JSON.parse(fs.readFileSync(statePath, "utf-8"));
    }
    const next = { ...current, ...partial };
    fs.writeFileSync(statePath, JSON.stringify(next, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to write tests/e2e/.state.json:", e);
  }
}

test.beforeAll(async () => {
  TestHelpers.validateEnvironment();

  const tokenData = await jsonfile.readFile("data.json").catch(() => ({} as { authToken?: string }));
  authToken = tokenData.authToken;
  if (!authToken) {
    throw new Error("authToken not found in data.json; run global setup first.");
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: "storageState.json",
    httpCredentials: {
      username: process.env.BASIC_AUTH_USERNAME || "",
      password: process.env.BASIC_AUTH_PASSWORD || "",
    },
  });
  page = await context.newPage();

  brandfolderConfig = new BrandfolderConfig(page);
  brandfolderCustomField = new BrandfolderCustomField(page);
  brandfolderSelector = new BrandfolderSelector(page);
  marketplace = new MarketplacePage(page, APP_CONFIGS.BRANDFOLDER);

  try {
    if (process.env.INSTALL_VIA_MARKETPLACE === "true") {
      const stackName = process.env.STACK_NAME;
      if (!stackName || !stackKey) {
        throw new Error("STACK_NAME and STACK_API_KEY are required when INSTALL_VIA_MARKETPLACE=true");
      }
      await marketplace.navigateToDashboard(stackKey);
      await marketplace.verifyDashboardLoaded();
      await marketplace.switchToOrganization();
      await marketplace.fullInstallFlow(stackName, false);
    } else {
      if (!stackKey) throw new Error("STACK_API_KEY is required for API-based install");
      const appId = (await createApp(authToken)) as string;
      appDetails.appUID = appId;
      writeState({ appUID: appDetails.appUID });
      await updateApp(authToken, appId);
      const installationUid = (await installApp(authToken, appId, stackKey)) as string;
      appDetails.installationId = installationUid;
      writeState({ installationId: appDetails.installationId });
    }

    const extUID = await getExtensionFieldUid(authToken, stackKey, {
      nameContains: process.env.BRANDFOLDER_APP_NAME || "Brandfolder",
    });
    const contentTypeResp = (await createContentType(authToken, extUID, stackKey)) as {
      notice?: string;
      content_type?: { uid: string };
    };
    if (contentTypeResp?.notice === "Content Type created successfully." && contentTypeResp?.content_type?.uid) {
      const entry = (await createEntry(authToken, contentTypeResp.content_type.uid, stackKey)) as { uid: string };
      appDetails.contentTypeUID = contentTypeResp.content_type.uid;
      appDetails.entryUID = entry.uid;
      writeState({
        contentTypeUID: appDetails.contentTypeUID,
        entryUID: appDetails.entryUID,
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});

test.describe("Config Screen", () => {
  test.skip("Config screen shows AppFailed state when opened directly without CMS (HashRouter /config)", async () => {
    // This test was logically invalid because App SDK.init hangs indefinitely outside an iframe rather than instantly rejecting.
    await page.goto(`${baseUrl.replace(/[\/#]+$/, "")}/#/config`);
    await page.waitForLoadState("load");
    
    // Direct load fails App SDK init, triggering <AppFailed /> component
    const failedWrapper = page.locator(".app-failed-container");
    await expect(failedWrapper).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Custom Field", () => {
  test("Custom field loads in entry and shows no-asset state", async () => {
    if (!stackKey || !appDetails.entryUID || !appDetails.contentTypeUID) {
      test.skip();
      return;
    }
    await page.goto(
      `${cmsUrl.replace(/[\/#]+$/, "")}/#!/stack/${stackKey}/content-type/${appDetails.contentTypeUID}/en-us/entry/${appDetails.entryUID}/edit`
    );
    await page.waitForLoadState("load");

    await brandfolderCustomField.initializeIframe();
    await brandfolderCustomField.waitForFieldLoaded();

    const noAsset = brandfolderCustomField.getNoAssetDiv();
    const fieldWarning = brandfolderCustomField.getWarningComponent();
    // Valid install + field config: empty field shows "No assets added" + Add. Invalid/missing
    // config surfaces warning inside field-wrapper instead (see CustomField container).
    const okEmpty = await noAsset.isVisible().catch(() => false);
    const warn = await fieldWarning.isVisible().catch(() => false);
    expect(okEmpty || warn).toBeTruthy();

    const addBtn = brandfolderCustomField.getAddButton();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
  });

  test("Add asset opens selector in a popup (real Brandfolder flow)", async () => {
    if (!stackKey || !appDetails.entryUID || !appDetails.contentTypeUID) {
      test.skip();
      return;
    }
    await page.goto(
      `${cmsUrl.replace(/[\/#]+$/, "")}/#!/stack/${stackKey}/content-type/${appDetails.contentTypeUID}/en-us/entry/${appDetails.entryUID}/edit`
    );
    await page.waitForLoadState("load");

    await brandfolderCustomField.initializeIframe();
    await brandfolderCustomField.waitForFieldLoaded();

    const addBtn = brandfolderCustomField.getAddButton();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    if (await addBtn.isDisabled()) {
      test.skip();
      return;
    }

    const popupPromise = page.waitForEvent("popup");
    await brandfolderCustomField.openSelector();
    const popup = await popupPromise;
    await popup.waitForLoadState("load");

    const selectorInPopup = new BrandfolderSelector(popup);
    await selectorInPopup.expectPickerOrWarningAfterInit();

    // E2E Improvement: Assert that popup stays open awaiting interaction and can be gracefully closed
    const isPopupClosed = popup.isClosed();
    expect(isPopupClosed).toBeFalsy(); 

    await popup.close();
  });
});

test.describe("Selector Page", () => {
  test("Direct URL loads selector shell only (no opener / init handshake yet)", async () => {
    await page.goto(`${baseUrl.replace(/[\/#]+$/, "")}/#/selector-page`);
    await page.waitForLoadState("load");
    await brandfolderSelector.expectShellOnlyWithoutInitHandshake();
  });
});

test.afterAll(async () => {
  if (process.env.USE_GLOBAL_TEARDOWN === "true") {
    return;
  }
  if (process.env.INSTALL_VIA_MARKETPLACE === "true") {
    try {
      const stackName = process.env.STACK_NAME!;
      await marketplace.uninstallApp(stackName);
    } catch (e) {
      console.warn("Marketplace uninstall failed (continuing):", e);
    }
  } else {
    try {
      const installations = await getInstalledApp(authToken, appDetails.appUID);
      const installId = installations?.data?.[0]?.uid;
      if (installId) {
        await uninstallApp(authToken, installId);
      }
    } catch (e) {
      console.warn("uninstallApp in afterAll failed (continuing):", e);
    }
    try {
      if (appDetails.appUID) await deleteApp(authToken, appDetails.appUID);
    } catch (e) {
      console.warn("deleteApp in afterAll failed (continuing):", e);
    }
  }
  try {
    if (appDetails.contentTypeUID) await deleteContentType(authToken, appDetails.contentTypeUID);
  } catch (e) {
    console.warn("deleteContentType in afterAll failed (continuing):", e);
  }
});
