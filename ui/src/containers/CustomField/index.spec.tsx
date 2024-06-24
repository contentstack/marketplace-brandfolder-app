import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react/pure";
import CustomField from "./index";

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
    thumbnailUrl: "",
    previewUrl: "", // add this parameter if you want "Preview" in tooltip action items
    platformUrl: "",
  },
];

jest.mock("../../root_config/index.tsx", () => ({
  damEnv: jest.fn(() => ({
    DAM_APP_NAME: "DAM",
    DIRECT_SELECTOR_PAGE: "novalue",
    ASSET_UNIQUE_ID: "id",
  })),
}));

beforeEach(() => {
  const setStateMock = React.useState;
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  const testName = expect.getState().currentTestName;
  if (testName?.includes("**")) {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() =>
        useStateMock({
          config: {},
          location: {},
          appSdkInitialized: true,
        })
      )
      .mockImplementationOnce(() => useStateMock(false))
      .mockImplementationOnce(() => useStateMock(assetData));
  } else if (testName?.includes("*")) {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() =>
        useStateMock({
          config: {},
          location: {},
          appSdkInitialized: true,
        })
      )
      .mockImplementationOnce(() => useStateMock(false));

    if (testName.includes("window")) {
      jest.mock("../../root_config/index.tsx", () => ({
        damEnv: jest.fn(() => ({
          DAM_APP_NAME: "DAM",
          DIRECT_SELECTOR_PAGE: "window",
          ASSET_UNIQUE_ID: "id",
        })),
        handleSelectorWindow: jest.fn(() => window.open()),
      }));
    }

    if (testName.includes("url")) {
      jest.mock("../../root_config/index.tsx", () => ({
        damEnv: jest.fn(() => ({
          DAM_APP_NAME: "DAM",
          DIRECT_SELECTOR_PAGE: "url",
          ASSET_UNIQUE_ID: "id",
        })),
      }));
    }
  } else {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() =>
        useStateMock({
          config: {},
          location: {},
          appSdkInitialized: true,
        })
      )
      .mockImplementationOnce(() => useStateMock(true));
  }

  jest.spyOn(React, "useEffect").mockImplementation();
  jest.spyOn(window, "open").mockImplementation();
  jest.spyOn(window, "postMessage").mockImplementation();

  render(<CustomField />);
});

describe("UI Elements of CustomField Warning", () => {
  fieldsWithWarning.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });
});

describe(`*UI Elements of CustomField without Assets`, () => {
  fieldsWithoutData.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test(`Add Button Functionality: window`, async () => {
    const addBtn = screen.getByTestId(`add-btn`);
    expect(addBtn).toHaveTextContent(`Choose Asset(s)`);
    fireEvent.click(addBtn);
    expect(window.open).toHaveBeenCalled();
  });

  test(`Add Button Functionality: url`, async () => {
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
      process.env.REACT_APP_UI_URL_NA || ""
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

afterEach(cleanup);
