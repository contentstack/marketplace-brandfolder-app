import rootConfig from "../../../root_config";

const localeTexts = {
  ConfigFields: {
    AccordianConfig: {
      mainName: "Configuration",
      multiConfigLabel: `Configure your ${rootConfig?.damEnv?.DAM_APP_NAME} credentials`,
      accActions: {
        default: "Set as Default",
        delete: "Delete Configuration",
      },
      defaultLabel: "Default",
      checkboxText: "Set as Default",
      btnText: "New Configuration",
      tooltip: "Maximum Limit Reached",
    },
    accModal: {
      header: "Add Configuration",
      textLabel: "Configuration Name",
      textPlaceholder: "Enter configuration name",
      duplicateError:
        "Configuration label name already exists. Please use a different name and try again.",
      nameLengthError:
        "Configuration name length must be between 1 to 50 characters.",
      legacyNameError: `"legacy_config" is a reserved configuration name. Please use a
      different name.`,
      nullundefinedError: `"null" or "undefined" cannot be used as a configuration name`,
      cancelBtn: "Cancel",
      addBtn: "Add",
    },
    DeleteModal: {
      header: "Confirm Deletion",
      body: "You are about to delete the <b>&apos;$&apos;</b> configuration. To proceed, type the name of the configuration and press Delete.",
      textPlaceholder: "Enter the configuration name for confirmation",
      cancelButton: "Cancel",
      confirmButton: "Delete",
    },
    entrySaveRadioButton: {
      label: "Choose the Brandfolder Keys to save in the entry",
      help: `Select how you want to save the data from ${rootConfig.damEnv.DAM_APP_NAME}.`,
      placeholder: "Enter the data structure to save in the entry",
      all_field_instruction:
        "The “All Fields” option lets you add a limited number of assets using their JSON data.",
      custom_field_instruction:
        "The “Custom Fields” option lets you define and select specific JSON fields to save in the entry.",
      notetext:
        "<b>Note:</b> Switching between “All” and “Custom” Fields only affects newly added assets. Existing assets will continue to follow the previous configuration.",
      wholeJson: "All Fields",
      customJson: "Custom Fields",
    },
    keysField: {
      label: `${rootConfig.damEnv.DAM_APP_NAME} Keys`,
      help: "Select the keys you want to save",
      placeholder: "Select keys",
      instruction: "Select the keys you want to save",
    },
    customWholeJson: {
      modal: {
        header: "Add Key Path",
        label: "Key Path",
        placeholder: "Enter Key Path",
        instructionS:
          'Use the dot format to enter nested objects, for example: "file.url".',
        instructionE:
          "Labels already added in the dropdown will not be created again.",
        note: "Note: ",
        btn: {
          cancel: "Cancel",
          create: "Create",
          apply: "Create and Apply",
        },
        addOption: "New Key Field",
        successToast: {
          type: "success",
          text: "Key path added successfully.",
        },
      },
      notification: {
        error: `The option "$var" already exists`,
        limitError: "Error: Limit of 150 options exceeded",
      },
    },
    missingCredentials: "Missing Required Fields",
    emptyValue: "Field Value Missing",
    selectField: {
      label: "Multiple Select",
      placeholder: "Select Multiple Options",
    },
  },
  CustomFields: {
    assetLimit: {
      btnTooltip: "Asset limit reached. Unable to select more assets.",
      notificationMsg: "Asset limit reached. You cannot add more assets",
    },
    assetValidation: {
      errorStatement:
        "Error: The selected '$var' cannot be added because it is not a supported file type.",
    },
    button: {
      btnText: "Choose Asset(s)",
    },
    assetCard: {
      hoverActions: {
        preview: "Preview",
        platformRedirect: `Open In ${rootConfig?.damEnv?.DAM_APP_NAME}`,
        remove: "Remove",
        drag: "Reorder",
      },
      noImage: "No image available",
      configDeletedImg:
        "We are unable to access the image URL. The link may be broken, the asset might have been deleted, or you may not have access to it.",
    },
    header: {
      asset: {
        singular: "Asset",
        plural: "Assets",
      },
      changeView: "Change View",
    },
    listViewTable: {
      thumbnailCol: "Image",
      assetNameCol: "Name",
      type: "Type",
    },
    toolTip: {
      thumbnail: "Thumbnail",
      list: "List",
      content: "Image not available for this asset",
    },
    DeleteModal: {
      header: "Remove Asset from Contentstack Entry",
      body: "Are you sure you want to remove <b>&apos;$&apos;</b> from Contentstack Entry?",
      textPlaceholder: "Enter the asset name for confirmation",
      cancelButton: "Cancel",
      confirmButton: "Remove",
    },
    AssetNotAddedText: "No assets have been added",
  },
  SelectorPage: {
    title: rootConfig?.damEnv?.DAM_APP_NAME,
  },
  Warnings: {
    incorrectConfig: `The credentials entered for the "${rootConfig?.damEnv?.DAM_APP_NAME} app" are invalid or missing. Update the configuration details and try again.`,
  },
  AppFailed: {
    Message1: "App location initialization failed.",
    Message2: "Reload the location and try again!",
    body: "For assistance, contact us at support@contentstack.com",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/marketplace-dam-app-boilerplate",
    },
  },
  Icons: {
    delete: "Delete",
    plus: "Plus",
    checkedWhite: "CheckedWhite",
    checkedPurple: "CheckedPurple",
    warning: "Warning",
    document: "Document",
    mp3: "MP3",
    mp4: "MP4",
    zip: "ZIP",
    doc2: "DOC2",
    json: "JSON",
    ppt: "PPT",
    xls: "XLS",
    pdf2: "PDF2",
    list: "List",
    thumbnail: "Thumbnail",
    removeFilled: "RemoveFilled",
    newTab: "NewTab",
    view: "View",
    moveIcon: "MoveIcon",
    addPlusBold: "AddPlusBold",
    dotsThreeLargeVertical: "DotsThreeLargeVertical",
    checkCircleDark: "CheckCircleDark",
    v2Plus: "v2-Plus",
  },
};

export default localeTexts;
