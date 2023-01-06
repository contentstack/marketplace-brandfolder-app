/* eslint no-underscore-dangle: 0 */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import ContentstackSDK from "@contentstack/app-sdk";
import { TrackJS } from "trackjs";
import DAMIcon from "./components/DAMImages/DAMIcon";
import ImageElement from "./components/DAMImages/ImageElement";
import { onClickHandler } from "./dam";
import rteConfig from "./rte_config";
import localeTexts from "./common/locale/en-us/index";

TrackJS.install({
  token: `${process.env.REACT_APP_TRACKER_TOKEN}`,
  application: process.env.REACT_APP_TRACKER_ENV,
  console: { display: true },
});

TrackJS.addMetadata("application_type", "marketplace");
TrackJS.addMetadata("application_name", "Brandfolder RTE App");

export default ContentstackSDK.init()
  .then(async (sdk) => {
    const { api_key: apiKey, name, org_uid: orgUid } = sdk?.stack?._data;
    const { uid } = sdk?.currentUser;
    const extensionObj = await sdk.location;
    const RTE = await extensionObj.RTEPlugin;

    if (!RTE) return;

    const DAM = RTE(rteConfig?.damEnv?.DAM_APP_NAME, (rte: any) => {
      const inline = rte._adv.editor.isInline;
      rte._adv.editor.isInline = (element: any) => {
        if (
          element.type === rteConfig?.damEnv?.DAM_APP_NAME &&
          element.attrs.inline
        ) {
          return true;
        }
        return inline(element);
      };

      return {
        title: localeTexts.RTE.title,
        icon: <DAMIcon />,
        render: ImageElement,
        display: ["toolbar"],
        elementType: ["void"],
      };
    });

    TrackJS.addMetadata("stack", `${name}`);
    TrackJS.addMetadata("organization", `${orgUid}`);
    TrackJS.addMetadata("api_key", `${apiKey}`);
    TrackJS.addMetadata("user_uid", `${uid}`);

    // @ts-ignore
    DAM.on("beforeRender", (rte: RTE) => {
      if (
        rte?.element?.type === rteConfig?.damEnv?.DAM_APP_NAME &&
        rte?.element?.attrs?.inline
      ) {
        rte.DisableDND = true;
        rte.DisableSelectionHalo = true;
      }
    });

    // @ts-ignore
    DAM.on("exec", async (rte: RTE) => {
      const config = await rte.getConfig();
      const savedSelection = rte.selection.get();
      onClickHandler({ extension: sdk, rte, savedSelection, config });
    });

    // eslint-disable-next-line
    return {
      DAM,
    };
  })
  .catch((err) => {
    TrackJS.track(err);
    console.error(
      `Error in loading ${rteConfig?.damEnv?.DAM_APP_NAME} plugin :: `,
      err
    );
  });
