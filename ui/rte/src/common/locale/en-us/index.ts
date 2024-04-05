import rteConfig from "../../../rte_config/index";

const localeTexts = {
  SelectorPage: {
    title: `${rteConfig?.damEnv?.DAM_APP_NAME}`,
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
  },
  DeleteModal: {
    header: "Remove",
    body: "This will remove <b>&apos;$&apos;</b> permanently.",
    cancelButton: "Cancel",
    confirmButton: "Remove",
  },
  ModalTitle: {
    video: "Edit Video",
    audio: "Edit Audio",
    image: "Edit Image",
    default: "Edit Asset",
  },
};

export default localeTexts;
