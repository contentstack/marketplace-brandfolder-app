import React from "react";

const ASSET_DOCUMENT_TYPE = "Document";
const ASSET_IMAGE_TYPE = "Image";
const ASSET_PDF_TYPE = "Pdf";
const ASSET_ARCHIVE_TYPE = "Archive";
const ASSET_VIDEO_TYPE = "Video";
const ASSET_AUDIO_TYPE = "Audio";
const PREVIEW_ICON = "Eye";

const damEnv = {
  DAM_APP_NAME: "Brandfolder",
  ASSET_NAME_PARAM: "name",
  RTE_DAM_ICON: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 18.9369H15.7009V16.7036H3.23467V4.23502H15.7037V12.4179H14.6375L16.8186 14.5993L19 12.4179H17.9369V2H1V18.9369ZM6.67021 5.61202C6.95793 5.56583 7.29009 5.53081 7.66724 5.50374C8.04566 5.47667 8.51683 5.46338 9.08249 5.46338C9.57616 5.46338 10.0442 5.50374 10.4835 5.58502C10.9243 5.66518 11.308 5.80215 11.6352 5.99537C11.9625 6.18908 12.2213 6.44607 12.41 6.77042C12.5985 7.09323 12.6927 7.49724 12.6927 7.98296C12.6927 8.27012 12.6511 8.53716 12.5645 8.78452C12.4801 9.03034 12.3652 9.24648 12.2214 9.43168C12.0774 9.61534 11.9163 9.76721 11.7358 9.88829C11.5566 10.0098 11.373 10.0847 11.1845 10.1102C11.3907 10.1378 11.619 10.2015 11.8714 10.3007C12.1223 10.398 12.3555 10.5449 12.5711 10.7382C12.787 10.9314 12.9675 11.1809 13.111 11.4856C13.2549 11.7909 13.3268 12.1583 13.3268 12.5899C13.3268 13.1743 13.2167 13.6522 12.9961 14.0253C12.7758 14.398 12.4801 14.6915 12.1061 14.9077C11.734 15.1231 11.3026 15.2713 10.8139 15.3514C10.3236 15.4327 9.80917 15.4731 9.271 15.4731C8.85714 15.4731 8.44996 15.4618 8.04566 15.4396C7.6401 15.4173 7.18307 15.3738 6.67021 15.3116V5.61202V5.61202ZM8.62412 13.8294V11.0269H9.43237C9.71179 11.0269 9.96428 11.0498 10.1941 11.0944C10.4226 11.1389 10.6209 11.2176 10.7869 11.3312C10.953 11.4426 11.0807 11.5913 11.1704 11.775C11.2599 11.9586 11.3061 12.1901 11.3061 12.4683C11.3061 12.7651 11.2469 13.005 11.1303 13.1903C11.0138 13.374 10.8651 13.5178 10.6862 13.6219C10.5064 13.724 10.3101 13.7942 10.1063 13.8294C9.9003 13.8661 9.7023 13.8836 9.51358 13.8836C9.37788 13.8836 9.22797 13.8789 9.06182 13.8708C8.89539 13.8614 8.7502 13.8481 8.62412 13.8294V13.8294ZM9.21658 9.54474H8.62412V6.95893C8.79498 6.93179 9.00578 6.91857 9.25799 6.91857C9.43715 6.91857 9.61919 6.93341 9.80291 6.96526C9.98657 6.99711 10.1527 7.05976 10.3014 7.1537C10.4498 7.2482 10.571 7.37884 10.6656 7.54498C10.7599 7.71113 10.806 7.92348 10.806 8.18413C10.806 8.45384 10.7662 8.67631 10.6862 8.85202C10.6048 9.02717 10.493 9.16625 10.3492 9.2687C10.2056 9.3722 10.0359 9.44448 9.84271 9.48427C9.65111 9.52569 9.44193 9.54474 9.21658 9.54474Z"
        fill="#647696"
      />
    </svg>
  ),
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
};

const getDisplayUrl = (asset: any) => asset?.url;

const getAssetType = (asset: any) => {
  /* possible return values ==> Document, Image, Pdf, Archive, Video, Audio */
  const { extension } = asset;
  let assetType = ASSET_DOCUMENT_TYPE;
  const audioExtensions = ["mp3", "m4a", "flac", "wav", "wma", "aac"];
  const videoExtnesions = [
    "mp4",
    "mov",
    "wmv",
    "avi",
    "avchd",
    "flv",
    "f4v",
    "swf",
    "ogg",
  ];
  const imageExtension = [
    "jpeg",
    "jpg",
    "png",
    "gif",
    "bmp",
    "apng",
    "avif",
    "jfif",
    "pjpeg",
    "pjp",
    "svg",
    "webp",
    "ico",
    "cur",
    "tif",
    "tiff",
  ];

  if (videoExtnesions?.includes(extension)) {
    assetType = ASSET_VIDEO_TYPE;
  } else if (audioExtensions?.includes(extension)) {
    assetType = ASSET_AUDIO_TYPE;
  } else if (imageExtension?.includes(extension)) {
    assetType = ASSET_IMAGE_TYPE;
  } else if (extension === "pdf") {
    assetType = ASSET_PDF_TYPE;
  } else if (extension === "zip") {
    assetType = ASSET_ARCHIVE_TYPE;
  }
  return assetType;
};

// eslint-disable-next-line
const getViewIconforTooltip = (type: string) => {
  type = type?.toLowerCase();
  if (type === "image" || type === "video") return PREVIEW_ICON;
};

const rteConfig: any = {
  damEnv,
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
};

export default rteConfig;
