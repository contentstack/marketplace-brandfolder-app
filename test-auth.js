require("ts-node").register();
require("dotenv").config();
const { getAuthToken } = require("./tests/e2e/utils/pre-installation-setup");

getAuthToken().then(a => console.log("SUCCESS:", a.substring(0, 10))).catch(e => {
  console.log("STATUS:", e.response?.status);
  console.log("DATA:", JSON.stringify(e.response?.data));
});
