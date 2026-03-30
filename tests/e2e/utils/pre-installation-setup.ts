import axios from "axios";
import * as jsonfile from "jsonfile";
import { authenticator } from "otplib";

type ExtensionUid = string;

const file = "data.json";

const savedObj: Record<string, unknown> = {};

/** Env may be host-only or full URL (README uses https://…); avoid https://https://… which resolves host "https". */
const apiHost = (value: string | undefined): string =>
  (value ?? "").trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");

/** TOTP for CMA /v3/user-session when the account has MFA (same shape as @contentstack/management login). */
const resolveTfaTokenForLogin = (): string | undefined => {
  const manual = process.env.CONTENTSTACK_TFA_TOKEN?.trim();
  if (manual) return manual;
  const secret = process.env.CONTENTSTACK_MFA_SECRET?.trim().replace(/\s/g, "");
  if (secret) return authenticator.generate(secret);
  return undefined;
};

const writeFile = async (obj: Record<string, unknown>) => {
  jsonfile
    .writeFile(file, obj)
    .then((res) => res)
    .catch((error) => console.error(error));
};

export const getAuthToken = async (): Promise<string> => {
  const tfa_token = resolveTfaTokenForLogin();
  const user: Record<string, string> = {
    email: process.env.CONTENTSTACK_LOGIN || "",
    password: process.env.CONTENTSTACK_PASSWORD || "",
  };
  if (tfa_token) user.tfa_token = tfa_token;

  const options = {
    url: `https://${apiHost(process.env.BASE_API_URL)}/v3/user-session`,
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    data: { user },
  };
  try {
    const result = await axios(options);
    savedObj["authToken"] = result.data.user.authtoken;
    await writeFile(savedObj);
    return result.data.user.authtoken;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const data = error.response.data as {
        error_code?: number;
        error_message?: string;
      };
      const mfaRequired =
        data?.error_code === 294 ||
        /two-?factor|tfa|totp/i.test(String(data?.error_message ?? ""));
      if (mfaRequired && !tfa_token) {
        throw new Error(
          "Contentstack login requires 2FA. Set CONTENTSTACK_TFA_TOKEN (current 6-digit authenticator code) or CONTENTSTACK_MFA_SECRET (base32 TOTP secret) in .env. See README (E2E).",
        );
      }
    }
    throw error;
  }
};

export const createContentType = async (
  authToken: string,
  extension_uid: ExtensionUid,
  stackApiKey: string | undefined,
) => {
  const generateUid = `Test Content Type_${Math.floor(Math.random() * 10000)}`;
  const options = {
    url: `https://${apiHost(process.env.BASE_API_URL)}/v3/content_types`,
    method: "POST" as const,
    headers: {
      api_key: stackApiKey,
      authtoken: authToken,
      "Content-type": "application/json",
    },
    data: {
      content_type: {
        title: generateUid,
        uid: generateUid.replace(/\s/g, "_").toLowerCase(),
        schema: [
          {
            display_name: "Title",
            uid: "title",
            data_type: "text",
            field_metadata: { _default: true },
            unique: false,
            mandatory: true,
            multiple: false,
          },
          {
            display_name: "URL",
            uid: "url",
            data_type: "text",
            field_metadata: { _default: true },
            unique: false,
            multiple: false,
          },
          {
            display_name: "Brandfolder",
            uid: "brandfolder_field",
            data_type: "json",
            extension_uid,
            config: {},
            mandatory: false,
            field_metadata: { extension: true },
            multiple: false,
            unique: false,
          },
        ],
      },
    },
  };
  try {
    return (await axios(options)).data;
  } catch (error) {
    throw error;
  }
};

export const createEntry = async (
  authToken: string,
  contentTypeId: string,
  stackApiKey: string | undefined,
) => {
  const generateTitle = `Test Entry ${Math.floor(Math.random() * 1000)}`;
  const options = {
    url: `https://${apiHost(process.env.BASE_API_URL)}/v3/content_types/${contentTypeId}/entries`,
    params: { locale: "en-us" },
    method: "POST" as const,
    headers: {
      api_key: stackApiKey,
      authtoken: authToken,
      "Content-type": "application/json",
    },
    data: {
      entry: {
        title: generateTitle,
        url: "test-entry",
      },
    },
  };
  try {
    return (await axios(options)).data.entry;
  } catch (error) {
    throw error;
  }
};

export const getExtensionFieldUid = async (
  authToken: string,
  stackApiKey: string | undefined,
  opts?: { nameContains?: string },
): Promise<string> => {
  const options = {
    url: `https://${apiHost(process.env.BASE_API_URL)}/v3/extensions`,
    method: "GET" as const,
    params: {
      query: { type: "field" },
      include_marketplace_extensions: true,
    },
    headers: {
      api_key: stackApiKey,
      authtoken: authToken,
    },
  };
  try {
    const result = await axios(options);
    const list = (result.data?.extensions ?? []) as Array<{ title?: string; name?: string; uid?: string }>;
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error("No field extensions found in stack");
    }
    const nameNeedle = (opts?.nameContains || process.env.BRANDFOLDER_APP_NAME || "Brandfolder").toLowerCase();
    const match =
      list.find((e) => (e?.title || "").toLowerCase().includes(nameNeedle)) ||
      list.find((e) => (e?.name || "").toLowerCase().includes(nameNeedle)) ||
      list[0];
    const uid = match?.uid || match;
    if (!uid || typeof uid !== "string") {
      throw new Error("Unable to resolve extension uid");
    }
    return uid;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get extension uid: ${msg}`);
  }
};

export const getInstalledApp = async (authToken: string, appId: string) => {
  const options = {
    url: `https://${apiHost(process.env.DEVELOPER_HUB_API)}/apps/${appId}/installations`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      organization_uid: process.env.CONTENTSTACK_ORGANIZATION_UID,
      authtoken: authToken,
    },
  };
  try {
    return (await axios(options)).data;
  } catch (error) {
    return error;
  }
};

export const uninstallApp = async (authToken: string, installId: string) => {
  const options = {
    url: `https://${apiHost(process.env.DEVELOPER_HUB_API)}/installations/${installId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      organization_uid: process.env.CONTENTSTACK_ORGANIZATION_UID,
      authtoken: authToken,
    },
  };
  try {
    return (await axios(options)).data;
  } catch (error) {
    return error;
  }
};

export const deleteApp = async (token: string, appId: string) => {
  const options = {
    url: `https://${apiHost(process.env.DEVELOPER_HUB_API)}/apps/${appId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      organization_uid: process.env.CONTENTSTACK_ORGANIZATION_UID,
      authtoken: token,
    },
  };
  try {
    await axios(options);
  } catch (error) {
    return error;
  }
};

export const deleteContentType = async (token: string, contentTypeId: string) => {
  const options = {
    url: `https://${apiHost(process.env.BASE_API_URL)}/v3/content_types/${contentTypeId}`,
    method: "DELETE",
    headers: {
      api_key: process.env.STACK_API_KEY,
      authtoken: token,
      "Content-type": "application/json",
    },
  };
  try {
    await axios(options);
  } catch (error) {
    return error;
  }
};

export const createApp = async (authToken: string) => {
  const appName = process.env.BRANDFOLDER_APP_NAME || "Brandfolder";
  const options = {
    url: `https://${apiHost(process.env.DEVELOPER_HUB_API)}/apps`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      organization_uid: process.env.CONTENTSTACK_ORGANIZATION_UID,
      authtoken: authToken,
    },
    data: {
      name: `${appName} App ${Math.floor(Math.random() * 1000)}`,
      target_type: "stack",
    },
  };
  try {
    return (await axios(options)).data.data.uid;
  } catch (error) {
    return error;
  }
};

const baseUrl = () =>
  process.env.APP_BASE_URL || process.env.APP_HOST_URL || "";

export const updateApp = async (authToken: string, appId: string) => {
  const appName = process.env.BRANDFOLDER_APP_NAME || "Brandfolder";
  const options = {
    url: `https://${apiHost(process.env.DEVELOPER_HUB_API)}/apps/${appId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      organization_uid: process.env.CONTENTSTACK_ORGANIZATION_UID,
      authtoken: authToken,
    },
    data: {
      ui_location: {
        locations: [
          {
            type: "cs.cm.stack.config",
            meta: [
              {
                signed: true,
                path: "/config",
                enabled: true,
              },
            ],
          },
          {
            type: "cs.cm.stack.custom_field",
            meta: [
              {
                name: `${appName} Custom Field`,
                path: "/custom-field",
                signed: false,
                enabled: true,
                data_type: "json",
              },
            ],
          },
          {
            type: "cs.cm.stack.full_page",
            meta: [
              {
                name: `${appName} Selector`,
                path: "/selector-page",
                signed: true,
                enabled: true,
              },
            ],
          },
        ],
        signed: true,
        base_url: baseUrl(),
      },
    },
  };
  try {
    return (await axios(options)).data;
  } catch (error) {
    return error;
  }
};

export const installApp = async (
  authToken: string,
  appId: string,
  stackApiKey: string | undefined,
) => {
  const options = {
    url: `https://${apiHost(process.env.DEVELOPER_HUB_API)}/apps/${appId}/install`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      organization_uid: process.env.CONTENTSTACK_ORGANIZATION_UID,
      authtoken: authToken,
    },
    data: {
      target_type: "stack",
      target_uid: stackApiKey,
    },
  };
  try {
    const result = await axios(options);
    return result.data.data.installation_uid;
  } catch (error) {
    return error;
  }
};
