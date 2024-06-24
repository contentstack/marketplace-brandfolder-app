/* eslint-disable @typescript-eslint/no-unused-vars */
/* NOTE: Remove Functions which are not used */
import React, { useEffect, useRef } from "react";
import {
  Accordion,
  Field,
  FieldLabel,
  Icon,
  Info,
  InstructionText,
  ToggleSwitch,
  Tooltip,
} from "@contentstack/venus-components";
import CustomComponent from "../CustomComponent";
import WarningMessage from "../../components/WarningMessage";
import {
  TypeErrorFn,
  TypeCustomConfigUpdateParams,
  TypeRootConfigSreen,
} from "../../common/types";
import localeTexts from "../locale/en-us";
import useAppLocation from "../../common/hooks/useAppLocation";
import services from "../../services";

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
        "The API key can be found under Profile > Integrations when you are logged into Brandfolder",
      placeholderText: "Enter your Brandfolder API Key",
      instructionText: "Your Brandfolder API Key",
      inputFieldType: "password", // type: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'date' | 'time' | string;
      saveInConfig: true,
      saveInServerConfig: false,
    },
  });

// eslint-disable-next-line
const checkConfigValidity = async (config: any, serverConfig: any) => {
  // return value of the function is object which takes disableSave[type=boolean] and message[type=string]. Assigning "true" to disableSave will disable the button and "false" will enable to button.
  if (config?.apiKey) {
    try {
      const isValid = await services.checkApiKeyValidity(config.apiKey);
      if (!isValid) {
        return {
          disableSave: true,
          message: localeTexts.ConfigFields.ErrorMessages.inValidKeyMsg,
        };
      }
    } catch (error) {
      return {
        disableSave: true,
        message: localeTexts.ConfigFields.ErrorMessages.errorKeyMsg,
      };
    }
  }
  return { disableSave: false };
};

const customConfigComponent = (
  config: any,
  serverConfig: any,
  handleCustomConfigUpdate: (
    updateConfigObj: TypeCustomConfigUpdateParams
  ) => void
) => {
  const { location } = useAppLocation();
  const appConfig = useRef<any>();
  const [isExtension, setIsExtension] = React.useState(false);

  useEffect(() => {
    if (location) {
      const sdkConfigData = location?.installation;
      appConfig.current = sdkConfigData;

      if (sdkConfigData) {
        sdkConfigData
          .getInstallationData()
          .then((data: any) => {
            setIsExtension(data?.configuration?.is_extension);
          })
          .catch((err: Error) => {
            console.error(err);
          });
      }
    }
  }, [location]);

  // function for extension suppport
  const updateIsExtension = (e: any) => {
    const newIsExtension = !isExtension;
    setIsExtension(newIsExtension);
    e.target = { name: "is_extension", value: newIsExtension };
    // handleCustomConfigUpdate(e)
    handleCustomConfigUpdate({
      fieldName: "is_extension",
      fieldValue: newIsExtension,
      saveConfig: true,
      saveServerConfig: false,
    });
  };

  return (
    <div className="Field Field--full">
      <div className="page-wrapper">
        <div className="config-wrapper" data-testid="config-wrapper">
          <div className="legacy-config">
            <Tooltip
              content={localeTexts.ConfigFields.isExtension.legacyInfo}
              position="top-end"
              type="primary"
              variantType="dark"
              maxWidth="700px"
              icon="io"
            >
              <Accordion
                dashedLineVisibility
                hasBackgroundColor
                title={localeTexts.ConfigFields.isExtension.legacy_title}
              >
                <div className="warning_note">
                  <WarningMessage
                    content={localeTexts.ConfigFields.isExtension.warning_note}
                  />
                </div>
                <Field>
                  <div className="extension-wrapper">
                    <FieldLabel required htmlFor="is_extension">
                      {" "}
                      {localeTexts.ConfigFields.isExtension.label}
                    </FieldLabel>

                    <div className="is_extension_toggle">
                      <ToggleSwitch
                        checked={isExtension}
                        name="is_extension"
                        id="is_extension"
                        data-testid="is_extension-input"
                        onChange={updateIsExtension}
                      />
                    </div>
                  </div>
                  <InstructionText>
                    {localeTexts.ConfigFields.isExtension.instruction}
                  </InstructionText>
                </Field>
              </Accordion>
            </Tooltip>
            <br />
            <br />
            <Info
              content={localeTexts.ConfigFields.isExtension.info_note}
              icon={<Icon icon="InfoCircleWhite" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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
    "dimensions.width",
    "dimensions.height",
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
  checkConfigValidity,
  customConfigComponent,
  customWholeJson,
};

export default rootConfigScreen;
