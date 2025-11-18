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
      tooltip: "Limit Reached",
    },
    accModal: {
      header: "Add Configuration",
      textLabel: "Configuration Name",
      textPlaceholder: "Enter configuration name",
      duplicateError:
        "This name already exists. Enter a different name and try again.",
      nameLengthError:
        "Configuration name must be between 1 to 50 characters.",
      legacyNameError: `"legacy_config" is a reserved configuration name. Please use a
      different name.`,
      specialCharacterError:
        "Special characters,space and numeric-only name is not allowed in the configuration name, except for '-' and '_'.",
      nullundefinedError: `"null" or "undefined" cannot be used as a configuration name`,
      cancelBtn: "Cancel",
      addBtn: "Add",
    },
    DeleteModal: {
      header: "Confirm Deletion",
      body: "This will delete <b>'$'</b>. This action cannot be undone. To proceed, type its name and click Delete.",
      textPlaceholder: "Enter configuration name for confirmation",
      cancelButton: "Cancel",
      confirmButton: "Delete",
    },
    entrySaveRadioButton: {
      label: "Choose the Brandfolder Keys to Save in Entry",
      help: `Select how to save data from ${rootConfig.damEnv.DAM_APP_NAME}.`,
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
        placeholder: "Enter key path",
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
        limitError: "Error: Limit exceeded. You can add up to 150 options",
      },
    },
    missingCredentials: "Missing Required Fields",
    emptyValue: "Field Value Missing",
    noSelectedDefault: "Select at least one default configuration",
    noConfiguration: "Add at least one configuration",
    selectField: {
      label: "Multiple Select",
      placeholder: "Select Multiple Options",
    },
  },
  CustomFields: {
    assetLimit: {
    btnTooltip:
        "Asset selection is unavailable as the maximum limit has been reached.",
      notificationMsg:
        "The maximum asset limit has been reached. You cannot add more assets beyond the preconfigured limit.",
    },
    assetValidation: {
      errorStatement:
        "Error: The selected '$var' cannot be added, Unsupported file type",
    },
    button: {
      btnText: "Choose Assets",
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
        "Cannot access image URL. It may be broken, deleted, or you may not have the permissions to view it.",
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
      content: "No image available for this asset",
    },
    DeleteModal: {
      header: "Remove Asset from Entry",
      body: "This will remove <b>'$'</b> from the entry. This action cannot be undone",
      textPlaceholder: "Enter the asset name for confirmation",
      cancelButton: "Cancel",
      confirmButton: "Remove",
    },
    AssetNotAddedText: "No assets added",
  },
  SelectorPage: {
    title: rootConfig?.damEnv?.DAM_APP_NAME,
  },
  Warnings: {
    incorrectConfig: `The credentials for the "${rootConfig?.damEnv?.DAM_APP_NAME} app" are invalid or missing. Update the configuration and try again.`,
    invalidAdvancedConfig: "The added configuration is invalid or deleted",
  },
  AppFailed: {
    Message1: "App location initialization failed.",
    Message2: "Reload the app and try again!",
    body: "Contact us at support@contentstack.com for assistance",
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
