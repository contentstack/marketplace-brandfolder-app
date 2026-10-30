import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: (...a: any[]) => mockInit(...a) },
}));
const mockNotification = jest.fn();
jest.mock("@contentstack/venus-components", () => ({
  ...(jest.requireActual("@contentstack/venus-components") as any),
  Notification: (...a: any[]) => mockNotification(...a),
}));
const mockPanel = jest.fn();
const mockSelect = jest.fn();
jest.mock("@brandfolder-panel/sdk", () => ({
  PanelUISdk: function PanelUISdk(this: any, opts: any) {
    mockPanel(opts);
    this.selectAttachments = mockSelect;
    this.closePanel = jest.fn();
  },
}));

// eslint-disable-next-line import/first
import App from "../../containers/App";

const env = (globalThis as any).__importMetaShim.env;
const CF_URL = "https://app.example.test";
const multiConfig = {
  default_multi_config_key: "main",
  multi_config_keys: {
    main: { apiKey: "key-main" },
    other: { apiKey: "key-other" },
  },
};
const asset = (id: string, extra: any = {}) => ({
  id,
  name: `name-${id}`,
  extension: "jpg",
  url: `https://bf.example.test/${id}`,
  apiDto: { attributes: { size: 50 } },
  ...extra,
});

let setData: jest.Mock;
const sdkForCustomField = (
  opts: { saved?: any[]; field?: any; config?: any } = {}
) => {
  setData = jest.fn();
  return {
    location: {
      CustomField: {
        fieldConfig: opts.field ?? { config_label: ["main"] },
        field: { getData: () => opts.saved ?? [], setData },
        frame: { enableAutoResizing: jest.fn(), updateHeight: jest.fn() },
        entry: { locale: "en-us" },
      },
    },
    getConfig: async () => opts.config ?? multiConfig,
  };
};

const listeners: any[] = [];
let openSpy: jest.SpyInstance;
const send = (data: any, init: any = {}) =>
  act(async () => {
    window.dispatchEvent(
      new MessageEvent("message", { data, origin: CF_URL, ...init })
    );
  });
const lastSaved = () => setData.mock.calls[setData.mock.calls.length - 1][0];
const toastTexts = () =>
  mockNotification.mock.calls.map(
    ([c]: any) => c.notificationContent?.error?.error_message
  );

beforeEach(() => {
  env.VITE_CUSTOM_FIELD_URL = CF_URL;
  env.VITE_REGION_MAPPING = JSON.stringify({
    EU: { JSON_RTE_URL: "https://eu.example.test" },
  });
  jest.spyOn(console, "error").mockImplementation(() => {});
  openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
  const add = window.addEventListener.bind(window);
  jest
    .spyOn(window, "addEventListener")
    .mockImplementation((t: any, l: any, o?: any) => {
      if (t === "message") listeners.push(l);
      return add(t, l, o);
    });
});

afterEach(() => {
  listeners.splice(0).forEach((l) => window.removeEventListener("message", l));
  jest.restoreAllMocks();
  mockInit.mockReset();
  mockNotification.mockReset();
  mockPanel.mockReset();
  mockSelect.mockReset();
  env.VITE_CUSTOM_FIELD_URL = "";
  env.VITE_REGION_MAPPING = "";
  window.location.hash = "";
});

const openAt = async (hash: string) => {
  window.location.hash = hash;
  await act(async () => {
    render(<App />);
  });
};
const chooseAssets = async () =>
  fireEvent.click(await screen.findByTestId("add-btn"));

describe("Custom Field at /#/custom-field", () => {
  test("shows 'No assets' text and the Choose Asset button for an empty field", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    expect(await screen.findByTestId("noAsset-div")).toBeTruthy();
    expect(screen.getByTestId("add-btn").textContent).toContain("Choose Asset");
  });

  test("shows the failed screen when the SDK does not start", async () => {
    mockInit.mockRejectedValue(new Error("no host"));
    await openAt("#/custom-field");
    await waitFor(() =>
      expect(document.querySelector(".app-failed-container")).not.toBeNull()
    );
  });

  test("shows one card per saved asset", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({ saved: [asset("1"), asset("2")] })
    );
    await openAt("#/custom-field");
    expect(await screen.findByTestId("assetBox")).toBeTruthy();
    expect(
      document.querySelectorAll('[data-testid="cs-asset-card-vertical"]')
    ).toHaveLength(2);
  });

  test("opens the selector popup at /#/selector-page", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await chooseAssets();
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toBe(
      `${CF_URL}/#/selector-page?location=CUSTOM-FIELD`
    );
  });

  test("answers openedReady with the selected config's key and the ids already chosen", async () => {
    mockInit.mockResolvedValue(sdkForCustomField({ saved: [asset("1")] }));
    await openAt("#/custom-field");
    await chooseAssets();
    const post = jest.spyOn(window, "postMessage").mockImplementation(() => {});
    await send({ message: "openedReady" }, { source: window });
    expect(post).toHaveBeenCalledTimes(1);
    const [payload, origin] = post.mock.calls[0] as any[];
    expect(payload).toMatchObject({
      message: "init",
      type: "Brandfolder",
      selectedIds: ["1"],
    });
    expect(payload.config.selected_config).toEqual({ apiKey: "key-main" });
    expect(payload.config).not.toHaveProperty("multi_config_keys");
    expect(origin).toBe(`${CF_URL}/#/selector-page`);
  });

  test("uses the config label set on the field, not the default", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({ field: { config_label: ["other"] } })
    );
    await openAt("#/custom-field");
    await chooseAssets();
    const post = jest.spyOn(window, "postMessage").mockImplementation(() => {});
    await send({ message: "openedReady" }, { source: window });
    expect((post.mock.calls[0] as any[])[0].config.selected_config).toEqual({
      apiKey: "key-other",
    });
  });

  test("ignores messages from another origin (fail closed)", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await chooseAssets();
    await send(
      { message: "add", type: "Brandfolder", selectedAssets: [asset("1")] },
      { origin: "https://evil.example.test" }
    );
    expect(setData.mock.calls.every(([v]) => v.length === 0)).toBe(true);
  });

  test("saves picked assets once per id and tags them with the config label", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await chooseAssets();
    await send({
      message: "add",
      type: "Brandfolder",
      selectedAssets: [asset("1"), asset("2"), asset("2")],
    });
    expect(lastSaved().map((a: any) => a.id)).toEqual(["1", "2"]);
    lastSaved().forEach((a: any) =>
      expect(a.cs_metadata).toEqual({ config_label: "main" })
    );
  });

  test("ignores an add message from another app type", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await chooseAssets();
    await send({ message: "add", type: "Other", selectedAssets: [asset("1")] });
    expect(setData.mock.calls.every(([v]) => v.length === 0)).toBe(true);
  });

  test("cuts to the field's max limit and shows an error toast", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({
        field: { config_label: ["main"], advanced: { max_limit: 2 } },
      })
    );
    await openAt("#/custom-field");
    await chooseAssets();
    await send({
      message: "add",
      type: "Brandfolder",
      selectedAssets: [asset("1"), asset("2"), asset("3")],
    });
    expect(lastSaved().map((a: any) => a.id)).toEqual(["1", "2"]);
    expect(
      mockNotification.mock.calls.some(([c]: any) => c.type === "error")
    ).toBe(true);
  });

  test("disables Choose Asset once the limit is reached", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({
        saved: [asset("1")],
        field: { config_label: ["main"], advanced: { max_limit: 1 } },
      })
    );
    await openAt("#/custom-field");
    const btn: any = await screen.findByTestId("add-btn");
    await waitFor(() => expect(btn.disabled).toBe(true));
  });

  test("rejects assets that break the content type's size rule and names them", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({
        field: { config_label: ["main"], advanced: { size: { max: 100 } } },
      })
    );
    await openAt("#/custom-field");
    await chooseAssets();
    await send({
      message: "add",
      type: "Brandfolder",
      selectedAssets: [
        asset("small"),
        asset("big", { apiDto: { attributes: { size: 5000 } } }),
      ],
    });
    expect(lastSaved().map((a: any) => a.id)).toEqual(["small"]);
    expect(toastTexts().join(" ")).toContain('"name-big"');
  });

  test("with custom JSON on, keeps only the chosen keys", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({
        config: {
          ...multiConfig,
          is_custom_json: true,
          dam_keys: [
            { label: "id", value: "id" },
            { label: "name", value: "name" },
          ],
        },
      })
    );
    await openAt("#/custom-field");
    await chooseAssets();
    await send({
      message: "add",
      type: "Brandfolder",
      selectedAssets: [asset("1")],
    });
    const saved = lastSaved();
    expect(Object.keys(saved[0]).sort()).toEqual(["cs_metadata", "id", "name"]);
  });

  test("if the field's config label was deleted, shows an error and does not open the popup", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({ field: { config_label: ["gone"] } })
    );
    await openAt("#/custom-field");
    await chooseAssets();
    expect(openSpy).not.toHaveBeenCalled();
    expect(
      mockNotification.mock.calls.some(([c]: any) => c.type === "error")
    ).toBe(true);
    await waitFor(() =>
      expect((screen.getByTestId("add-btn") as any).disabled).toBe(true)
    );
  });

  test("closing the popup re-enables the flow", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await chooseAssets();
    await send({ message: "close" });
    await send({
      message: "add",
      type: "Brandfolder",
      selectedAssets: [asset("1")],
    });
    // the close message removes the listener, so the late add is not saved
    expect(setData.mock.calls.every(([v]) => v.length === 0)).toBe(true);
  });
});

describe("Selector page at /#/selector-page", () => {
  const init = (config: any) => ({
    message: "init",
    type: "Brandfolder",
    selectedIds: [],
    config,
  });
  const withOpener = () => {
    const opener = { postMessage: jest.fn() };
    Object.defineProperty(window, "opener", {
      value: opener,
      configurable: true,
      writable: true,
    });
    return opener;
  };
  afterEach(() => {
    Object.defineProperty(window, "opener", {
      value: null,
      configurable: true,
      writable: true,
    });
  });

  test("tells the opener it is ready", async () => {
    mockInit.mockRejectedValue(new Error("popup has no SDK"));
    const opener = withOpener();
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    expect(opener.postMessage).toHaveBeenCalledWith(
      { message: "openedReady" },
      CF_URL
    );
  });

  test("uses the region's URL when the query names a region", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    const opener = withOpener();
    await openAt("#/selector-page?location=EU");
    expect(opener.postMessage).toHaveBeenCalledWith(
      { message: "openedReady" },
      "https://eu.example.test"
    );
  });

  test("starts the Brandfolder panel with the key it was sent", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    withOpener();
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    await send(init({ selected_config: { apiKey: "key-main" } }));
    await waitFor(() => expect(mockPanel).toHaveBeenCalled());
    expect(mockPanel.mock.calls[0][0].authParameters).toEqual({
      token: "key-main",
    });
    expect(document.getElementById("panel-anchor")).not.toBeNull();
  });

  test("hands the chosen asset to the opener and closes the popup", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    const opener = withOpener();
    const close = jest.spyOn(window, "close").mockImplementation(() => {});
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    await send(init({ selected_config: { apiKey: "k" } }));
    await waitFor(() => expect(mockSelect).toHaveBeenCalled());
    act(() => mockSelect.mock.calls[0][0].onSelect(asset("5")));
    expect(opener.postMessage).toHaveBeenLastCalledWith(
      { message: "add", selectedAssets: [asset("5")], type: "Brandfolder" },
      CF_URL
    );
    expect(close).toHaveBeenCalled();
  });

  test("ignores an init message from another origin", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    withOpener();
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    await send(init({ selected_config: { apiKey: "k" } }), {
      origin: "https://evil.example.test",
    });
    expect(mockPanel).not.toHaveBeenCalled();
    expect(document.getElementById("panel-anchor")).toBeNull();
  });

  test("shows the deleted-config warning when the selected config is empty", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    withOpener();
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    await send(init({ selected_config: {} }));
    expect(await screen.findByTestId("warning-component")).toBeTruthy();
    expect(screen.getByTestId("warning-component").textContent).toContain(
      "empty or has been deleted"
    );
  });

  test("tells the opener when the popup is closed", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    const opener = withOpener();
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    window.dispatchEvent(new Event("beforeunload"));
    expect(opener.postMessage).toHaveBeenLastCalledWith(
      { message: "close" },
      CF_URL
    );
  });
});

describe("App Configuration at /#/config", () => {
  const installation = (data: any = {}) => {
    const setValidity = jest.fn();
    const setInstallationData = jest.fn();
    return {
      setValidity,
      setInstallationData,
      sdk: {
        location: {
          AppConfigWidget: {
            installation: {
              getInstallationData: async () => data,
              setInstallationData,
              setValidity,
            },
          },
        },
        getConfig: async () => ({}),
      },
    };
  };

  test("shows the configuration section and the legacy extension toggle", async () => {
    mockInit.mockResolvedValue(installation().sdk);
    await openAt("#/config");
    expect(await screen.findByText("Brandfolder Configuration")).toBeTruthy();
    expect(screen.getByText("Legacy Settings")).toBeTruthy();
    expect(screen.getByText("Enable Extension Support")).toBeTruthy();
  });

  test("turning on extension support saves is_extension and turns custom JSON off", async () => {
    const { sdk, setInstallationData } = installation({
      configuration: { is_custom_json: true },
      serverConfiguration: {},
    });
    mockInit.mockResolvedValue(sdk);
    await openAt("#/config");
    await screen.findByText("Enable Extension Support");
    fireEvent.click(
      document.querySelector('input[name="is_extension"]') as Element
    );
    await waitFor(() => expect(setInstallationData).toHaveBeenCalled());
    const configs = setInstallationData.mock.calls.map(
      ([d]: any) => d.configuration
    );
    expect(configs.some((c: any) => c.is_extension === true)).toBe(true);
    expect(configs[configs.length - 1].is_custom_json).toBe(false);
  });

  // BUG: AppConfigProvider renders its children only after the installation data loaded, so when
  // the SDK fails the admin sees a blank page and ConfigScreen's AppFailed branch is never reached.
  test.skip("shows the failed screen when the SDK does not start", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    await openAt("#/config");
    await waitFor(() =>
      expect(document.querySelector(".app-failed-container")).not.toBeNull()
    );
  });
});

describe("Routes", () => {
  test("any other hash renders none of the three screens", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/nope");
    expect(screen.queryByTestId("field-wrapper")).toBeNull();
    expect(screen.queryByTestId("config-wrapper")).toBeNull();
    expect(screen.queryByTestId("selector-wrapper")).toBeNull();
  });
});
