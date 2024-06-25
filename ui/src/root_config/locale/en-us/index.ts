const localeTexts = {
  ConfigFields: {
    isExtension: {
      label: "Enable Extension Support",
      instruction:
        "If this toggle is enabled, you will be able to get the asset JSON data similar to the Brandfolder Extension",
      legacyInfo:
        "Legacy settings allow you to use the Brandfolder app with Extension support, enabling you to get asset JSON data similar to that of the Brandfolder Extension. However, if you prefer to use the latest Brandfolder app, you can skip configuring the Legacy settings.",
      legacy_title: "Legacy Settings",
      warning_note:
        "Legacy settings allow you to use the Brandfolder app with Extension support, enabling you to get asset JSON data similar to that of the Brandfolder Extension. However, if you prefer to use the latest Brandfolder app, you can skip configuring the Legacy settings  <br/> <b>Note:</b> When you toggle between App and Extension settings, please note that the data variation may occur",
      info_note:
        "If the extension is enabled, All fields and Custom fields option will not be available.",
    },
    ErrorMessages: {
      inValidKeyMsg: "Invalid API Key",
      errorKeyMsg: "Error checking API Key validity",
    },
  },
};

export default localeTexts;
