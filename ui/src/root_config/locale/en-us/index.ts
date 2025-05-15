const localeTexts = {
  ConfigFields: {
    isExtension: {
      label: "Enable Extension Support",
      instruction:
        "When enabled, this toggle retrieves asset JSON data similar to the Brandfolder Extension.",
      legacyInfo:
        "Legacy settings allows you to use the Brandfolder app with Extension support to retrieve asset JSON data, similar to the Brandfolder Extension. If you are using the latest Brandfolder app, you can skip configuring these settings.",
      legacy_title: "Legacy Settings",
      warning_note:
        "Legacy settings allow you to use the Brandfolder app with Extension support to retrieve asset JSON data, similar to the Brandfolder Extension. If you are using the latest Brandfolder app, you can skip these settings.<br/><b>Note:</b> Toggling between app and extension settings may result in data variation",
      info_note:
        "Toggling between app and extension settings may result in data variation.",
    },
    ErrorMessages: {
      inValidKeyMsg: "Invalid API Key",
      errorKeyMsg: "Error validating the API key",
    },
  },
};

export default localeTexts;
