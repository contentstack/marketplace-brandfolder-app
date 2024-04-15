/* eslint-disable @typescript-eslint/no-unused-vars */

/* NOTE: Remove Functions which are not used */

import React from "react";
import CustomComponent from "../CustomComponent";
import {
  TypeErrorFn,
  TypeCustomConfigUpdateParams,
  TypeRootConfigSreen,
} from "../../common/types";
import DamEnv from "../DamEnv";

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
    labelText: "DAM Text Input",
    helpText: "DAM Text Input Helptext",
    placeholderText: "DAM Text Input Placeholder",
    instructionText: "DAM Text Input Instruction Text",
    inputFieldType: "password", // type: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'date' | 'time' | string;
    saveInConfig: true,
    saveInServerConfig: false,
  },
});

const customConfigComponent = (
  config: any,
  serverConfig: any,
  handleCustomConfigUpdate: (
    updateConfigObj: TypeCustomConfigUpdateParams
  ) => void
) => {};

const customWholeJson = () => {
  const customJsonOptions: string[] = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
    "position",
    "type",
    "assetId",
    "url",
    "filename",
    "extension",
    "mimetype",
    "thumbnailUrl",
    "sizeInBytes",
    "isProcessing",
    "mediaType",
    "supported",
    "dimensions",
    "apiDto",
  ];

  const defaultFeilds: string[] = [
    "id",
    "name",
    "url",
    "filename",
    "sizeInBytes",
    "dimensions.width",
    "dimensions.height",
    "extension",
  ];

  return {
    customJsonOptions,
    defaultFeilds,
  };
};

const rootConfigScreen: TypeRootConfigSreen = {
  configureConfigScreen,
  customConfigComponent,
  customWholeJson,
};

export default rootConfigScreen;
