import rootConfig from "../../../root_config";

const localeTexts = {
  ConfigFields: {
    entrySaveRadioButton: {
      label: "Save In Entry",
      help: `You can select how you want to save data you get from ${rootConfig.damEnv.DAM_APP_NAME}.`,
      placeholder: "Enter the structure of data you want to save in the entry",
      instruction:
        "You can select the structure of data you want to save in the entry, if you select Custom JSON. If you select Whole JSON, less number of products can be selected.",
      wholeJson: "Whole JSON",
      customJson: "Custom JSON",
    },
    keysField: {
      label: `${rootConfig.damEnv.DAM_APP_NAME} Keys`,
      help: "Select the keys you want to save",
      placeholder: "Select keys",
      instruction: "Select the keys you want to save",
    },
    invalidCredentials: "Invalid Configuration",
    isExtension: {
      label: "Enable Extension Support",
      instruction:
        "If this toggle is enabled, you will be able to get the asset JSON data similar to the Brandfolder Extension",
      legacyInfo:
        "Legacy settings allow you to use the Brandfolder app with Extension support, enabling you to get asset JSON data similar to that of the Brandfolder Extension. However, if you prefer to use the latest Brandfolder app, you can skip configuring the Legacy settings.",
      legacy_title: "Legacy Settings",
      warning_note:
        "Note: When you toggle between App and Extension settings, please note that the data variation may occur.",
    },
  },
  CustomFields: {
    button: {
      btnText: "Choose Asset(s)",
    },
    assetCard: {
      hoverActions: {
        preview: "Preview",
        platformRedirect: `Open In ${rootConfig?.damEnv?.DAM_APP_NAME}`,
        remove: "Remove",
        drag: "Drag",
      },
    },
    AssetNotAddedText: "No assets have been added",
  },
  SelectorPage: {
    title: `${rootConfig?.damEnv?.DAM_APP_NAME}`,
  },
  Warnings: {
    incorrectConfig: `The credentials you entered for the "${rootConfig?.damEnv?.DAM_APP_NAME} App" are invalid or missing. Please update the configuration details and try again.`,
  },
  DeleteModal: {
    header: "Remove Asset from Contentstack Entry",
    body: "Are you sure you want to remove <b>&apos;$&apos;</b> from Contentstack Entry?",
    cancelButton: "Cancel",
    confirmButton: "Remove",
  },
};

export default localeTexts;
