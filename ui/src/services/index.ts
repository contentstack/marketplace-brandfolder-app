/* Import React modules */
/* Import other node modules */
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */

import constants from "../common/constants";

const checkConfigValidity = async (apiKey: any) => {
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
  checkConfigValidity,
};

export default services;
