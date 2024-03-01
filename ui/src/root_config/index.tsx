import React from "react";
import { TypeAsset } from "../common/types";
import CustomComponent from "./CustomComponent";
import Logo from "../common/asset/logo.svg";
import utils from "./utils";

const damEnv = {
  IS_DAM_SCRIPT: false,
  DAM_APP_NAME: "Brandfolder",
  CONFIG_FIELDS: ["apiKey"],
  ASSET_UNIQUE_ID: "id",
  SELECTOR_PAGE_LOGO: Logo,
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
  BRANDFOLDER_API_BASE_URL: "https://brandfolder.com/api",
  INCORRECT_CONFIG_ERR: `The credentials you entered for the "Brandfolder App" are invalid or missing. Please update the configuration details and try again.`,
  PANEL_LOADING_ERR:
    "An error occurred while fetching the data from your Brandfolder account. Please try again.",
};

const configureConfigScreen = () =>
  /* IMPORTANT: 
  1. All sensitive information must be saved in serverConfig
  2. serverConfig is used when webhooks are implemented
  3. save the fields that are to be accessed in other location in config
  4. either saveInConfig or saveInServerConfig should be true for your field data to be saved in contentstack
  5. If values are stored in serverConfig then those values will not be available to other UI locations
  6. Supported type options are textInputFields, radioInputFields, selectInputFields */
  ({
    apiKey: {
      type: "textInputFields",
      labelText: "Brandfolder API Key",
      helpText:
        "The API key can be found under Profile > Integrations when you are logged into Brandfolder.",
      placeholderText: "Enter your Brandfolder API Key",
      instructionText: "Your Brandfolder API Key",
      saveInConfig: true,
      saveInServerConfig: false,
    },
  });

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Enter your code for filteration of assets to the specified format
    const { id, dimensions, sizeInBytes, url, name, extension } = asset;

    return {
      id,
      type: utils.getAssetType(extension),
      name: asset.filename || name,
      width: asset.width || dimensions?.width,
      height: asset.height || dimensions?.height,
      size: asset.size || sizeInBytes, // add size in bytes as string eg.'416246'
      thumbnailUrl: url,
      previewUrl: url, // add this parameter if you want "Preview" in tooltip action items
    };
  });
  return filterAssetArray;
};

const handleConfigtoSelectorPage = (
  config: any,
  contentTypeConfig: any,
  currentLocale: string
) =>
  utils.getSelectorConfig({
    keyArr: damEnv?.CONFIG_FIELDS,
    appConfig: config,
    customConfig: contentTypeConfig,
    currentLocale,
  });

const customComponent = (
  config: any,
  setError: Function,
  successFn: Function,
  closeFn: Function
) => (
  <CustomComponent
    config={config}
    setError={setError}
    successFn={successFn}
    closeFn={closeFn}
    damEnv={damEnv}
  />
);

const rootConfig: any = {
  damEnv,
  configureConfigScreen,
  filterAssetData,
  handleConfigtoSelectorPage,
  customComponent,
};

export default rootConfig;
