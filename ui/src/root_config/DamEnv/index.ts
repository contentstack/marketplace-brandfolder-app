import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  DAM_APP_NAME: "Brandfolder",
  ASSET_UNIQUE_ID: "id",
  SELECTOR_PAGE_LOGO: Logo,
  REQUIRED_CONFIG_FIELDS: ["apiKey"],
  SELECTOR_CONFIG_CHECK_FIELDS: [],
  IS_DAM_SCRIPT: false,
  DAM_SCRIPT_URL: "https://brandfolder.com/api",
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", "authWindow", default => "novalue"
};

export default DamEnvVariables;
