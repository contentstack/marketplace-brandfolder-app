/* Import React modules */
import React, { useEffect } from "react";
/* Import other node modules */
import { PanelUISdk } from "@brandfolder-panel/sdk";
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";

interface TypeCustomComponent {
  config: any;
  setError: Function;
  successFn: Function;
  closeFn: Function;
  damEnv: any;
}

const CustomComponent: React.FC<TypeCustomComponent> = function ({
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
      const anchor = document?.getElementById("panel-anchor");
      if (anchor) {
        panel = new PanelUISdk({
          appName: damEnv.DAM_APP_NAME,
          anchorElement: anchor,
          authParameters: {
            token: config?.apiKey,
          },
          environmentVariables: {
            bfApiBaseUrl: damEnv.BRANDFOLDER_API_BASE_URL,
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
  }, []);

  return <div id="panel-anchor" />;
};

export default CustomComponent;
