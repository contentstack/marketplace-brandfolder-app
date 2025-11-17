import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react/pure";
import CustomField from "../../containers/CustomField/index";
import CustomFieldContext from "../../common/contexts/CustomFieldContext";
import { MarketplaceAppContext } from "../../common/contexts/MarketplaceAppContext";
import AssetContainer from "../../containers/CustomField/AssetContainer";
import DeleteModal from "../../components/DeleteModal";

const fieldsWithWarning = [
  "field-wrapper",
  "warning-component",
  "warning-icon",
];

const fieldsWithoutData = ["field-wrapper", "add-btn", "noAsset-div"];

const fieldsWithData = [
  "field-wrapper",
  "add-btn",
  "assetBox",
  "assetBox-header",
  "renderItems-wrapper",
  "render-list-item",
];

const postMessageData = [
  {
    id: "mc4r2w7gb9qsqw87qv9rp8pv",
    name: "attacker.jpg",
    createdAt: {},
    updatedAt: {},
    position: 0,
    type: "attachments",
    assetId: "n87f6b8wvttbr9mn6p5q24nk",
    url: "https://cdn.brandfolder.io/EYSCDOSE/at/mc4r2w7gb9qsqw87qv9rp8pv/attacker.jpg",
    filename: "attacker.jpg",
    extension: "jpg",
    mimetype: "image/jpeg",
    thumbnailUrl:
      "https://thumbs.bfldr.com/at/mc4r2w7gb9qsqw87qv9rp8pv?expiry=1713332751&fit=bounds&height=162&sig=NDQ4MDdiZmI2MjA4Mzc5ZTA0YmFjZDdkZDk5OWIxZjVhNmI3YTgxYg%3D%3D&width=262",
    dimensions: {
      width: 512,
      height: 512,
      type: 0,
    },
    sizeInBytes: 46494,
    isProcessing: false,
    mediaType: "JPG",
    supported: true,
    apiDto: {
      id: "mc4r2w7gb9qsqw87qv9rp8pv",
      type: "attachments",
      attributes: {
        mimetype: "image/jpeg",
        extension: "jpg",
        filename: "attacker.jpg",
        size: 46494,
        width: 512,
        height: 512,
        url: "https://assets2.brandfolder.io/bf-boulder-prod/mc4r2w7gb9qsqw87qv9rp8pv/v/1079794536/original/attacker.jpg",
        position: 0,
        created_at: "2023-01-28T05:52:29.018Z",
        updated_at: "2023-01-28T05:52:33.628Z",
        is_processing: false,
        thumbnail_url:
          "https://thumbs.bfldr.com/at/mc4r2w7gb9qsqw87qv9rp8pv?expiry=1713332751&fit=bounds&height=162&sig=NDQ4MDdiZmI2MjA4Mzc5ZTA0YmFjZDdkZDk5OWIxZjVhNmI3YTgxYg%3D%3D&width=262",
        cdn_url:
          "https://cdn.brandfolder.io/EYSCDOSE/at/mc4r2w7gb9qsqw87qv9rp8pv/attacker.jpg",
      },
      relationships: {
        asset: {
          data: {
            id: "n87f6b8wvttbr9mn6p5q24nk",
            type: "generic_files",
          },
        },
      },
    },
  },
];

const assetData = [
  {
    id: "1",
    type: "image",
    name: "sample image",
    width: "300",
    height: "300",
    size: "", // add size in bytes as string eg.'416246'
    thumbnailUrl: undefined,
    previewUrl: "", // add this parameter if you want "Preview" in tooltip action items
    platformUrl: "",
  },
];

let CustomFieldRenderedDOM: any = null;
const removeAsset = jest.fn();
const closeModal = jest.fn();

beforeAll(() => {
  jest.mock("../../root_config/index.tsx", () => ({
    damEnv: jest.fn(() => ({
      DAM_APP_NAME: "DAM",
      IS_DAM_SCRIPT: true,
      DIRECT_SELECTOR_PAGE: "novalue",
      ASSET_UNIQUE_ID: "id",
    })),
  }));
  jest.spyOn(React, "useEffect").mockImplementation();
  jest.spyOn(window, "open").mockImplementation(jest.fn());
  jest.spyOn(window, "postMessage").mockImplementation();
});

beforeEach(() => {
  const setStateMock = React.useState;
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  const testName = expect.getState().currentTestName;
  let mockContextValue: any = {
    renderAssets: [],
    setRenderAssets: jest.fn(),
    selectedAssets: [],
    setSelectedAssets: jest.fn(),
    removeAsset: jest.fn(),
    uniqueID: "id",
    setRearrangedAssets: jest.fn(),
    state: {
      appSdkInitialized: true,
    },
    currentLocale: "",
  };
  let appcontextValue = { appSdk: null, appConfig: {}, appFailed: false };

  if (testName.includes("**")) {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => useStateMock(false));

    mockContextValue = {
      renderAssets: assetData,
      setRenderAssets: jest.fn(),
      selectedAssets: [],
      setSelectedAssets: jest.fn(),
      removeAsset: jest.fn(),
      uniqueID: "id",
      setRearrangedAssets: jest.fn(),
      state: {
        appSdkInitialized: true,
      },
      currentLocale: "",
    };
  } else if (testName.includes("AssetList")) {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => useStateMock({ value: "list" }));

    mockContextValue = {
      renderAssets: assetData,
      setRenderAssets: jest.fn(),
      selectedAssets: [],
      setSelectedAssets: jest.fn(),
      removeAsset: jest.fn(),
      uniqueID: "id",
      setRearrangedAssets: jest.fn(),
      state: {
        appSdkInitialized: true,
      },
      currentLocale: "",
    };
  } else if (testName.includes("*")) {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => useStateMock(false));
  } else {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => useStateMock(true));
  }

  if (testName?.includes("AppFailed")) {
    appcontextValue = { appSdk: null, appConfig: {}, appFailed: true };
  }

  if (testName.includes("AssetList")) {
    CustomFieldRenderedDOM = render(
      <CustomFieldContext.Provider value={mockContextValue}>
        <AssetContainer />
      </CustomFieldContext.Provider>
    );
  } else if (testName.includes("DeleteModal")) {
    CustomFieldRenderedDOM = render(
      <DeleteModal
        remove={removeAsset}
        id="id"
        name="name"
        {...{ closeModal }}
      />
    );
  } else {
    CustomFieldRenderedDOM = render(
      <MarketplaceAppContext.Provider value={appcontextValue}>
        <CustomFieldContext.Provider value={mockContextValue}>
          <CustomField />
        </CustomFieldContext.Provider>
      </MarketplaceAppContext.Provider>
    );
  }
});

describe("UI Elements of CustomField Warning", () => {
  fieldsWithWarning.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test(`Rendered warning element`, () => {
    CustomFieldRenderedDOM?.container?.querySelector(
      '[class="Info__content attention"]'
    );
  });
});

describe(`*UI Elements of CustomField without Assets`, () => {
  fieldsWithoutData.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test(`Add Button Functionality`, async () => {
    const addBtn = screen.getByTestId(`add-btn`);
    expect(addBtn).toHaveTextContent(`Choose Asset(s)`);
    fireEvent.click(addBtn);
    expect(window.open).toHaveBeenCalled();
  });

  test(`Rendering text element`, async () => {
    expect(screen.getByText("No assets have been added")).toBeInTheDocument();
  });

  test(`Receive Post Message on custom field`, async () => {
    window.postMessage(
      {
        message: "message",
        data: [...postMessageData],
      },
      "https://rte-extension.contentstack.com"
    );
    expect(window.postMessage).toHaveBeenCalled();
  });
});

describe("**UI Elements of CustomField with Assets", () => {
  fieldsWithData.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });
});

describe("Rendered AppFailed Component on AppSdk Failed ", () => {
  [
    "app-failed-container",
    "app-content",
    "app-text",
    "secondary-app-container",
  ].forEach((className: string) => {
    test(`Rendered ${className} element`, async () => {
      expect(
        CustomFieldRenderedDOM?.container?.querySelector(`.${className}`)
      ).toBeTruthy();
    });
  });
});

describe("Rendered AssetList Component", () => {
  ["Table", "Table__body", "noImage", "Table__body__column"].forEach(
    (className: string) => {
      test(`Rendered ${className} element`, async () => {
        expect(
          CustomFieldRenderedDOM?.container?.querySelector(
            `[class="${className}"]`
          )
        ).toBeTruthy();
      });
    }
  );
});

describe("Rendered DeleteModal Component", () => {
  screen.debug();
  [
    "ReactModal__Content__header",
    "ReactModal__Content__body",
    "ReactModal__Content__footer",
    "Button--light",
    "Button--delete",
  ].forEach((className: string) => {
    test(`Rendered ${className} element`, async () => {
      expect(
        CustomFieldRenderedDOM?.container?.querySelector(`.${className}`)
      ).toBeTruthy();
    });
  });

  test(`Delete Button Functionality`, async () => {
    const deleteBtn =
      CustomFieldRenderedDOM?.container?.querySelector(`.Button--delete`);
    fireEvent.click(deleteBtn);
    expect(removeAsset).toHaveBeenCalled();
    expect(closeModal).toHaveBeenCalled();
  });

  test(`Close Button Functionality`, async () => {
    const deleteBtn =
      CustomFieldRenderedDOM?.container?.querySelector(`.Button--light`);
    fireEvent.click(deleteBtn);
    expect(closeModal).toHaveBeenCalled();
  });
});

afterEach(cleanup);
