import { chromium } from "@playwright/test";
import dotenv from "dotenv";
import { AppLogin } from "./tests/e2e/pages/login";
import { contentstackWebAppBaseUrl } from "./tests/e2e/utils/cmsOrigin";
import { getAuthToken } from "./tests/e2e/utils/pre-installation-setup";
import { REPO_ROOT, STORAGE_STATE_FILE } from "./tests/e2e/utils/paths";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const globalSetup = async () => {
  const validateEnvironment = () => {
    const requiredEnv = [
      "CONTENTSTACK_LOGIN",
      "CONTENTSTACK_PASSWORD",
      "BASE_API_URL",
      "DEVELOPER_HUB_API",
      "CONTENTSTACK_ORGANIZATION_UID",
      "APP_HOST_URL",
    ];
    const missing = requiredEnv.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
  };
  validateEnvironment();

  if (
    !process.env.ENV_URL &&
    /localhost|127\.0\.0\.1/i.test(process.env.APP_HOST_URL || "")
  ) {
    console.warn(
      "ENV_URL is unset while APP_HOST_URL looks local; set ENV_URL to your Contentstack web app (e.g. https://app.contentstack.com) so login and authtoken cookies target the CMS.",
    );
  }

  const stackEmail = process.env.CONTENTSTACK_LOGIN;
  const stackPassword = process.env.CONTENTSTACK_PASSWORD;

  const browser = await chromium.launch();
  const stagLogin = await browser.newPage({
    httpCredentials: {
      username: process.env.BASIC_AUTH_USERNAME || "",
      password: process.env.BASIC_AUTH_PASSWORD || "",
    },
  });
  const loginSetup = new AppLogin(stagLogin);
  await loginSetup.getLoginPage();
  await loginSetup.contentstackLogin(stackEmail, stackPassword);

  const authToken = await getAuthToken();
  try {
    // E2E Fix: Inject the REST authtoken directly into Playwright's session cookies.
    // UI login often fails due to 2FA, leaving `storageState.json` empty.
    // Cookie domain must match the CMS (ENV_URL), not APP_HOST_URL (often localhost: Vite).
    const storagePath = STORAGE_STATE_FILE;
    const cmsOrigin = new URL(contentstackWebAppBaseUrl());
    const secure = cmsOrigin.protocol === "https:";

    let storageState: { cookies?: any[]; origins?: unknown[] } = { cookies: [], origins: [] };
    if (fs.existsSync(storagePath)) {
      storageState = JSON.parse(fs.readFileSync(storagePath, "utf-8"));
    }
    if (!storageState.cookies) storageState.cookies = [];

    const hasAuthCookie = storageState.cookies.some((c: any) => c.name === "authtoken");
    if (!hasAuthCookie) {
      storageState.cookies.push({
        name: "authtoken",
        value: authToken,
        domain: cmsOrigin.hostname,
        path: "/",
        expires: -1,
        httpOnly: false,
        secure,
        sameSite: "Lax",
      });
      fs.writeFileSync(storagePath, JSON.stringify(storageState, null, 2), "utf-8");
    }

    const stateDir = path.join(REPO_ROOT, "tests/e2e");
    const statePath = path.join(stateDir, ".state.json");
    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir, { recursive: true });
    }
    const state = { authToken };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
  } catch (e) {
    console.warn("Unable to persist tests/e2e/.state.json:", e);
  }
};

export default globalSetup;
