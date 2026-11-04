import React from "react";
import { render } from "@testing-library/react";
import rootConfig from "../../root_config";
import CustomFieldUtils from "../../common/utils/CustomFieldUtils";
import utils from "../../common/utils";
import CustomSelector from "../../root_config/Components/CustomSelector";

const mockPanel = jest.fn();
const mockSelect = jest.fn();
const mockClose = jest.fn();
jest.mock("@brandfolder-panel/sdk", () => ({
  PanelUISdk: function PanelUISdk(this: any, opts: any) {
    mockPanel(opts);
    this.selectAttachments = mockSelect;
    this.closePanel = mockClose;
  },
}));

const validate = (config: any) =>
  rootConfig.checkConfigValidity?.(config, {}) as Promise<{
    disableSave: boolean;
    message?: string;
  }>;
const whoamiCalls = () => (fetch as any).mock.calls;

describe("API key check (checkConfigValidity)", () => {
  beforeEach(() => (fetch as any).resetMocks());

  test("accepts a config with no keys yet", async () => {
    expect(await validate({})).toEqual({ disableSave: false });
    expect(fetch).not.toHaveBeenCalled();
  });

  test("checks the old top-level key against whoami with a Bearer header", async () => {
    (fetch as any).mockResponseOnce("{}", { status: 200 });
    expect(await validate({ apiKey: "key-1" })).toEqual({ disableSave: false });
    const [url, init] = whoamiCalls()[0];
    expect(url).toBe("https://brandfolder.com/api/v4/users/whoami");
    expect(init.headers.Authorization).toBe("Bearer key-1");
  });

  test("blocks save when the old key is rejected", async () => {
    (fetch as any).mockResponseOnce("{}", { status: 401 });
    expect(await validate({ apiKey: "bad" })).toEqual({
      disableSave: true,
      message: "Invalid API Key",
    });
  });

  test("blocks save with the error message when the check throws", async () => {
    (fetch as any).mockRejectOnce(new Error("network"));
    expect(await validate({ apiKey: "k" })).toEqual({
      disableSave: true,
      message: "Error validating the API key",
    });
  });

  test("checks every key in multi_config_keys and passes when all are valid", async () => {
    (fetch as any).mockResponse("{}", { status: 200 });
    const result = await validate({
      multi_config_keys: { a: { apiKey: "k1" }, b: { apiKey: "k2" } },
    });
    expect(result).toEqual({ disableSave: false });
    expect(whoamiCalls()).toHaveLength(2);
  });

  test("names the config whose key is invalid", async () => {
    (fetch as any).mockResponse(async (req: any) => ({
      status: req.headers.get("Authorization") === "Bearer bad" ? 401 : 200,
      body: "{}",
    }));
    const result = await validate({
      multi_config_keys: { good: { apiKey: "ok" }, broken: { apiKey: "bad" } },
    });
    expect(result.disableSave).toBe(true);
    expect(result.message).toBe('Invalid API Key for config "broken"');
  });

  test("names the config whose check threw", async () => {
    (fetch as any).mockReject(new Error("down"));
    const result = await validate({
      multi_config_keys: { only: { apiKey: "k" } },
    });
    expect(result.message).toBe(
      'Error validating the API key for config "only"'
    );
  });

  test("skips configs that have no key yet", async () => {
    const result = await validate({ multi_config_keys: { empty: {} } });
    expect(result).toEqual({ disableSave: false });
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("Config fields and custom JSON keys", () => {
  test("the API key is a password field kept in config, per configuration", () => {
    const { apiKey }: any = rootConfig.configureConfigScreen?.({} as any);
    expect(apiKey).toMatchObject({
      inputFieldType: "password",
      saveInConfig: true,
      saveInServerConfig: false,
      isMultiConfig: true,
    });
  });

  test("default keys are the documented nine and are all offered", () => {
    const { customJsonOptions, defaultFeilds }: any =
      rootConfig.customWholeJson?.();
    expect(defaultFeilds).toEqual([
      "id",
      "name",
      "url",
      "assetId",
      "filename",
      "extension",
      "sizeInBytes",
      "dimensions",
      "apiDto.attributes.cdn_url",
    ]);
    defaultFeilds.forEach((k: string) =>
      expect(customJsonOptions).toContain(k)
    );
  });
});

describe("Asset preview mapping (filterAssetData)", () => {
  test("maps a panel asset to a card, preferring the CDN url", () => {
    const [card]: any[] = rootConfig.filterAssetData?.([
      {
        id: "a1",
        name: "hero",
        extension: "JPG",
        sizeInBytes: 1234,
        dimensions: { width: 800, height: 600 },
        url: "https://bf.example.test/plain",
        apiDto: { attributes: { cdn_url: "https://cdn.example.test/hero" } },
      },
    ]) as any[];
    expect(card).toMatchObject({
      id: "a1",
      type: "image",
      name: "hero",
      width: 800,
      height: 600,
      size: 1234,
      thumbnailUrl: "https://cdn.example.test/hero",
      previewUrl: "https://cdn.example.test/hero",
    });
  });

  test("falls back to filename and url when there is no name or CDN url", () => {
    const [card]: any[] = rootConfig.filterAssetData?.([
      {
        id: "a2",
        filename: "doc.pdf",
        extension: "pdf",
        url: "https://bf.example.test/doc",
      },
    ]) as any[];
    expect(card).toMatchObject({
      name: "doc.pdf",
      type: "pdf",
      thumbnailUrl: "https://bf.example.test/doc",
    });
  });

  test.each([
    ["mp4", "video"],
    ["mp3", "audio"],
    ["png", "image"],
    ["xyz", "document"],
  ])("extension %s is a %s", (ext, type) => {
    expect(utils.getAssetType(ext)).toBe(type);
  });
});

describe("Extension (legacy) mode (modifyAssetsToSave)", () => {
  const picked = (id: string) => ({
    id,
    name: `n${id}`,
    assetId: `x${id}`,
    sizeInBytes: 5,
    apiDto: { attributes: { size: 5, url: `u${id}`, cdn_url: `c${id}` } },
  });

  test("leaves the list alone when extension mode is off", () => {
    const list = [picked("1"), picked("2")];
    expect(rootConfig.modifyAssetsToSave?.({}, {}, list)).toEqual(list);
  });

  test("with extension mode on, reshapes only the last asset and drops panel-only keys", () => {
    const list = [picked("1"), picked("2")];
    const out: any[] = rootConfig.modifyAssetsToSave?.(
      { is_extension: true },
      {},
      list
    ) as any[];
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual(list[0]);
    expect(out[1]).toMatchObject({
      id: "2",
      url: "u2",
      cdn_url: "c2",
      size: 5,
    });
    expect(out[1]).not.toHaveProperty("apiDto");
    expect(out[1]).not.toHaveProperty("sizeInBytes");
  });
});

describe("advancedFilters (content type size, width and height rules)", () => {
  const asset = (id: string, size: number) => ({
    id,
    name: id,
    apiDto: { attributes: { size } },
  });
  const run = (assets: any[], advanced: any) =>
    CustomFieldUtils.advancedFilters(assets, advanced) as any;

  test("accepts everything when there are no rules", () => {
    const r = run([asset("a", 10)], undefined);
    expect(r.acceptedAssets).toHaveLength(1);
    expect(r.rejectedAssets).toHaveLength(0);
  });

  test("rejects an asset over the max size", () => {
    const r = run([asset("small", 50), asset("big", 500)], {
      size: { max: 100 },
    });
    expect(r.acceptedAssets.map((a: any) => a.id)).toEqual(["small"]);
    expect(r.rejectedAssets.map((a: any) => a.id)).toEqual(["big"]);
  });

  test("rejects an asset under the min size", () => {
    const r = run([asset("tiny", 5), asset("ok", 50)], { size: { min: 10 } });
    expect(r.rejectedAssets.map((a: any) => a.id)).toEqual(["tiny"]);
  });

  test("accepts only inside min and max together", () => {
    const rule = { size: { min: 10, max: 100 } };
    const r = run([asset("lo", 5), asset("in", 50), asset("hi", 500)], rule);
    expect(r.acceptedAssets.map((a: any) => a.id)).toEqual(["in"]);
  });

  test("exact size accepts only that size", () => {
    const r = run([asset("a", 64), asset("b", 65)], { size: { exact: 64 } });
    expect(r.acceptedAssets.map((a: any) => a.id)).toEqual(["a"]);
  });

  test("width and height rules apply to dimensions", () => {
    const wide = {
      id: "w",
      dimensions: { width: 2000, height: 100 },
      apiDto: { attributes: { size: 1 } },
    };
    const ok = {
      id: "o",
      dimensions: { width: 500, height: 100 },
      apiDto: { attributes: { size: 1 } },
    };
    const r = run([wide, ok], { width: { max: 1000 } });
    expect(r.acceptedAssets.map((a: any) => a.id)).toEqual(["o"]);
  });
});

describe("CustomSelector (Brandfolder panel)", () => {
  const setup = (config: any) => {
    const setError = jest.fn();
    const successFn = jest.fn();
    render(
      <CustomSelector
        config={config}
        setError={setError}
        successFn={successFn}
        closeFn={jest.fn()}
        damEnv={rootConfig.damEnv}
      />
    );
    return { setError, successFn };
  };
  beforeEach(() => {
    mockPanel.mockClear();
    mockSelect.mockClear();
    mockClose.mockClear();
    localStorage.clear();
  });

  test("starts the panel with the selected config's key", () => {
    setup({ selected_config: { apiKey: "k-77" } });
    const opts = mockPanel.mock.calls[0][0];
    expect(opts.authParameters).toEqual({ token: "k-77" });
    expect(opts.appName).toBe("Brandfolder");
    expect(opts.environmentVariables.bfApiBaseUrl).toBe(
      "https://brandfolder.com/api"
    );
  });

  test("uses the old top-level key when there is no selected config", () => {
    setup({ apiKey: "old" });
    expect(mockPanel.mock.calls[0][0].authParameters.token).toBe("old");
  });

  test("clears the cached panel identity when there is no key", () => {
    localStorage.setItem("IDENTITY_STORE_KEY", "stale");
    setup({});
    expect(localStorage.getItem("IDENTITY_STORE_KEY")).toBeNull();
  });

  test("hands the chosen attachment to the success handler and closes the panel", () => {
    const { successFn } = setup({ apiKey: "k" });
    const { onSelect } = mockSelect.mock.calls[0][0];
    onSelect({ id: "att-1" });
    expect(successFn).toHaveBeenCalledWith([{ id: "att-1" }]);
    expect(mockClose).toHaveBeenCalled();
  });
});
