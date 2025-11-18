import rteConfig from "../../../rte_config/index";

const localeTexts = {
  SelectorPage: {
    title: rteConfig?.damEnv?.DAM_APP_NAME,
  },
  RTE: {
    ToolTip: {
      viewIcon: "Preview",
      openInDAM: `Open In ${rteConfig?.damEnv?.DAM_APP_NAME}`,
    },
    title: `Choose assets from ${rteConfig?.damEnv?.DAM_APP_NAME}`,
    button: {
      cancel: "Cancel",
      save: "Save",
    },
    iconContent: {
      remove: "Remove",
      edit: "Edit Properties",
      preview: "Preview Asset",
      openInDAM: `Open In ${rteConfig?.damEnv?.DAM_APP_NAME}`,
    },
    assetValidation: {
      errorStatement:
        "Error: $var cannot be added. It does not meet the asset constraints.",
      configDeletedImg:
        "Cannot access image URL. It may be broken, deleted, or you may not have the permissions to view it.",
    },
  },
  DeleteModal: {
    header: "Remove Asset from Entry",
    body: "This will remove <b>'$'</b> from the entry. This action cannot be undone.",
    textPlaceholder: "Enter the asset name for confirmation",
    cancelButton: "Cancel",
    confirmButton: "Remove",
  },
  ModalTitle: {
    video: "Edit Video Properties",
    audio: "Edit Audio Properties",
    image: "Edit Image Properties",
    default: "Edit Asset Properties",
  },
  Icons: {
    embed: "Embed",
    dontSave: "DontSave",
    imageSettings: "ImageSettings",
    addPlus: "AddPlus",
    saveWhite: "SaveWhite",
    removeFilled: "RemoveFilled",
  },
};

export default localeTexts;
