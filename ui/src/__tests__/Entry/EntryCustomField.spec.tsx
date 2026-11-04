/* eslint-disable global-require */
import { waitFor } from "@testing-library/react";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: (...a: any[]) => mockInit(...a) },
}));

// One entry per file: createRoot has no handle to unmount, so a second render would stay live.
describe("entry at the manifest URL the custom field at /#/custom-field", () => {
  test("renders the custom field at /#/custom-field through the real src/index", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockInit.mockResolvedValue({
      location: {
        AppConfigWidget: {
          installation: {
            getInstallationData: async () => ({}),
            setInstallationData: jest.fn(),
            setValidity: jest.fn(),
          },
        },
        CustomField: {
          fieldConfig: {},
          field: { getData: () => [], setData: jest.fn() },
          frame: { enableAutoResizing: jest.fn(), updateHeight: jest.fn() },
          entry: { locale: "en-us" },
        },
      },
      getConfig: async () => ({}),
    });
    document.body.innerHTML = '<div id="root"></div>';
    window.location.hash = "#/custom-field";
    require("../../index");
    await waitFor(() =>
      expect(document.querySelector('[data-testid="add-btn"]')).not.toBeNull()
    );
  });
});
