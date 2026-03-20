import { chromium } from "@playwright/test";
import { AppLogin } from "./tests/e2e/pages/login";
import { getAuthToken } from "./tests/e2e/utils/pre-installation-setup";
import * as fs from "fs";
import * as path from "path";

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
    const storagePath = path.resolve(process.cwd(), "storageState.json");
    if (fs.existsSync(storagePath)) {
      const storageState = JSON.parse(fs.readFileSync(storagePath, "utf-8"));
      
      const hostUrlStr = process.env.APP_HOST_URL || "https://app.contentstack.com";
      const hostUrl = new URL(hostUrlStr);
      
      const hasAuthCookie = storageState.cookies?.some((c: any) => c.name === "authtoken");
      if (!hasAuthCookie) {
        if (!storageState.cookies) storageState.cookies = [];
        storageState.cookies.push({
          name: "authtoken",
          value: authToken,
          domain: hostUrl.hostname,
          path: "/",
          expires: -1,
          httpOnly: false,
          secure: true,
          sameSite: "Lax"
        });
        fs.writeFileSync(storagePath, JSON.stringify(storageState, null, 2), "utf-8");
      }
    }

    const stateDir = path.resolve(process.cwd(), "tests/e2e");
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
