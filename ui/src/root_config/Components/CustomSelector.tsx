import React, { useEffect } from "react";
/* Import other node modules */
import { PanelUISdk } from "@brandfolder-panel/sdk";
import "../styles.scss";

interface TypeCustomComponent {
  config: any;
  setError: Function;
  successFn: Function;
  closeFn: Function;
  damEnv: any;
}

const CustomSelector: React.FC<TypeCustomComponent> = function ({
  config,
  setError,
  successFn,
  damEnv,
  // eslint-disable-next-line
  closeFn,
}) {
  let panel: any;

  useEffect(() => {
    try {
      const authToken = config?.apiKey ?? config?.selected_config?.apiKey ?? "";
      if (!authToken) {
        localStorage.removeItem("IDENTITY_STORE_KEY");
      }
      const anchor = document?.getElementById("panel-anchor");
      if (anchor) {
        panel = new PanelUISdk({
          appName: damEnv.DAM_APP_NAME,
          anchorElement: anchor,
          authParameters: {
            token: authToken,
          },
          environmentVariables: {
            bfApiBaseUrl: damEnv.DAM_SCRIPT_URL,
          },
        });

        panel?.selectAttachments({
          onSelect: (attachment: any) => {
            successFn([attachment]);
            panel?.closePanel();
          },
        });
      } else {
        setError(true, damEnv.PANEL_LOADING_ERR);
      }
    } catch (error) {
      setError(true, damEnv.INCORRECT_CONFIG_ERR);
      console.error("Error while loading custom component", error);
    }
  }, [config]);

  return <div id="panel-anchor" />;
};

export default CustomSelector;
