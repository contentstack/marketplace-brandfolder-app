import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  DAM_APP_NAME: "Brandfolder",
  CONFIG_FIELDS: ["apiKey"],
  ASSET_UNIQUE_ID: "id",
  SELECTOR_PAGE_LOGO: Logo,
  IS_DAM_SCRIPT: false,
  DAM_SCRIPT_URL: "",
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", "authWindow", default => "novalue"
  REQUIRED_CONFIG_FIELDS: ["apiKey"],
  BRANDFOLDER_API_BASE_URL: "https://brandfolder.com/api",
  INCORRECT_CONFIG_ERR: `The credentials you entered for the "Brandfolder App" are invalid or missing. Please update the configuration details and try again.`,
  PANEL_LOADING_ERR:
    "An error occurred while fetching the data from your Brandfolder account. Please try again.",
  SELECTOR_CONFIG_CHECK_FIELDS: [],
  ADVANCED_ASSET_PARAMS: {
    ASSET_NAME: "name", // add property name for NAME. If present in nested structure, add nested structure reference.
    SIZE_NAME: "sizeInBytes", // add property name for SIZE. If present in nested structure, add nested structure reference.
    SIZE_UNIT: "BYTES", // possible values "BYTES"(default), "KB", "MB", "GB", "TB". Mention the unit for asset size provided by third-party dam.
    HEIGHT_NAME: "dimensions.height", // add property name for HEIGHT. If present in nested structure, add nested structure reference.
    WIDTH_NAME: "dimensions.width", // add property name for WIDTH. If present in nested structure, add nested structure reference.
  },
};

export default DamEnvVariables;
