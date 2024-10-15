import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  DAM_APP_NAME: "Brandfolder",
  ASSET_UNIQUE_ID: "id",
  SELECTOR_PAGE_LOGO: Logo,
  CONFIG_FIELDS: ["apiKey"],
  REQUIRED_CONFIG_FIELDS: ["apiKey"],
  IS_DAM_SCRIPT: false,
  DAM_SCRIPT_URL: "",
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", "authWindow", default => "novalue"
  BRANDFOLDER_API_BASE_URL: "https://brandfolder.com/api",
  INCORRECT_CONFIG_ERR: `The credentials you entered for the "Brandfolder App" are invalid or missing. Please update the configuration details and try again.`,
  PANEL_LOADING_ERR:
    "An error occurred while fetching the data from your Brandfolder account. Please try again.",
};

export default DamEnvVariables;
