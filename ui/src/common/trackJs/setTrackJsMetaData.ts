import { TrackJS } from "trackjs";
import { TrackProps } from "../types";

export const useJsErrorTracker = () => {
  const addMetadata = (key: string, value: string) => {
    TrackJS.addMetadata(key, value);
  };
  const trackError = (error: any) => {
    TrackJS.track(error);
  };
  return { addMetadata, trackError };
};

export const setTrackJsMetaData = ({
  apiKey,
  orgUid,
  name,
  userUid,
}: TrackProps) => {
  const { addMetadata } = useJsErrorTracker();
  addMetadata("stack", `${name}`);
  addMetadata("organization", `${orgUid}`);
  addMetadata("api_key", `${apiKey}`);
  addMetadata("user_uid", `${userUid}`);
};
