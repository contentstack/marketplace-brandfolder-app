/* Vite injects import.meta.env; Jest replaces import.meta via babel.config.js + this shim. */
const viteEnv = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => k.startsWith("VITE_"))
);
globalThis.__importMetaShim = {
  env: {
    MODE: "test",
    DEV: true,
    PROD: false,
    SSR: false,
    VITE_MULTI_CONFIG_LIMIT: "10",
    VITE_CUSTOM_FIELD_URL: "",
    VITE_REGION_MAPPING: "",
    ...viteEnv,
  },
};

require("jest-fetch-mock").enableMocks();
