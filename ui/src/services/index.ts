/* Import React modules */
/* Import other node modules */
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */

/* Below is just an example function which can be called
from any of the app container pages. */
import constants from "../common/constants";

const checkApiKeyValidity = async (apiKey: any) => {
  let authToken = "";
  if (apiKey) {
    authToken = `Bearer ${apiKey}`;
  }
  const response: any = await fetch(constants.brandfolderUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authToken,
    },
  });
  return response?.status === 200;
};

const services = {
  checkApiKeyValidity,
};

export default services;
