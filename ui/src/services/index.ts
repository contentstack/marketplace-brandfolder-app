/* Import React modules */
/* Import other node modules */
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */

/* Below is just an example function which can be called
from any of the app container pages. */
import constants from "../common/constants";
import localeTexts from "../root_config/locale/en-us";

const checkApiKeyValidity = async (config: any) => {
  const multiConfigKeys = config;

  // Map over the config keys and check their validity in parallel
  const checkApiKeyPromises = Object.entries(multiConfigKeys).map(
    async ([key, value]: any) => {
      try {
        let authToken = "";
        if (value?.apiKey) {
          authToken = `Bearer ${value.apiKey}`;
        }

        const response = await fetch(constants.brandfolderUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        });

        // If the response status is 200, return valid; otherwise, it's an error
        if (response?.status === 200) {
          return { key, isValid: true };
        }
        throw new Error(
          localeTexts?.ConfigFields?.ErrorMessages?.inValidKeyMsg
        );
      } catch (error) {
        return { key, isValid: false };
      }
    }
  );

  // Wait for all the promises to resolve
  const results = await Promise.all(checkApiKeyPromises);

  // Filter out the keys where isValid is false
  const invalidKeys = results
    ?.filter((result) => !result.isValid)
    ?.map((result) => result.key);

  // If there are any invalid keys, return them in the specified format
  if (invalidKeys?.length > 0) {
    return { isValid: false, key: invalidKeys.join(",") };
  }

  // If all keys are valid, return a valid status
  return { isValid: true };
};

const services = {
  checkApiKeyValidity,
};

export default services;
