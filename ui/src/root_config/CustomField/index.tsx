/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

/* NOTE: Remove Functions which are not used */

import {
  TypeAsset,
  TypeErrorFn,
  TypeRootCustomField,
} from "../../common/types";
import DamEnvVariables from "../DamEnv";
import utils from "../utils";

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Enter your code for filteration of assets to the specified format
    const { id, dimensions, sizeInBytes, url, name, extension, filename } =
      asset;
      const portalUrl = "https://brandfolder.com/contentstack/#!asset/"
      console.info("___________________portalUrl+asset?.assetId",portalUrl+asset?.assetId , asset?.assetId)
    return {
      id,
      type: utils.getAssetType(extension),
      name: name || filename,
      width: dimensions?.width,
      height: dimensions?.height,
      size: sizeInBytes, // add size in bytes as string eg.'416246'
      thumbnailUrl: url,
      previewUrl: url, // add this parameter if you want "Preview" in tooltip action items
      platformUrl: portalUrl+asset?.assetId, // add this parameter if you want "Open In DAM" in tooltip action items
    };
  }); 

  return filterAssetArray;
};

const handleConfigtoSelectorPage = (
  config: any,
  contentTypeConfig: any,
  currentLocale: string
) => {
  /* Return Config to be used on selector page */
  return {};
};

const getSelectorWindowUrl = (config: any, contentTypeConfig: any) => {
  return ""; // return url to be opened as selector page
};

const handleSelectorPageData = (event: any) => {
  // "event" is the event object which is received from your opened selector page
  return []; // return array of asset objects which are selected
};

const handleSelectorWindow = (
  config: any,
  contentTypeConfig: any,
  setError: (errObj: TypeErrorFn) => void
) => {
  /* code logic to open the DAM selector window */
};

const handleAuthWindow = (
  configObj: {
    config: any;
    contentTypeConfig: any;
  },
  resolve: Function,
  reject: Function
) => {
  /* code logic to open the DAM auth window */
  resolve(); // if authentication is success, call resolve() | if failed, call reject(error) with error
};

const modifyAssetsToSave = (
  config: any,
  contentTypeConfig: any,
  assets: any[],
  isExtensionSupport: any
) => {
  let modifiedArray: any[] = assets;

  /* code logic to modify the assets to save in Custom Field */
  if (config?.is_extension) {
    const isExtensionAsset = assets?.slice(-1);

    const formattedArray = Object.values(isExtensionAsset).map((item: any) => {
      const attributes = item?.apiDto?.attributes || item?.attributes;
      const relationships = item?.apiDto?.relationships || item?.relationships;

      const modifiedItem = {
        ...item,
        attributes,
        relationships,
        size: attributes?.size || item?.size,
        width: attributes?.width || item?.width,
        height: attributes?.height || item?.height,
        url: attributes?.url || item?.url,
        cdn_url: attributes?.cdn_url || item?.cdn_url,
        is_processing: attributes?.is_processing || item?.isProcessing,
        thumbnail_url: attributes?.thumbnail_url || item?.thumbnailUrl,
        created_at: attributes?.created_at || item?.createdAt,
        updated_at: attributes?.updated_at || item?.updatedAt,
      };

      const {
        isProcessing,
        thumbnailUrl,
        createdAt,
        updatedAt,
        apiDto,
        assetId,
        dimensions,
        mediaType,
        name,
        sizeInBytes,
        supported,
        ...rest
      } = modifiedItem;
      return rest;
    });
    const sliceData = assets.slice(0, -1);
    modifiedArray = [...sliceData, ...formattedArray];
  }
  return modifiedArray;
};

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
  getSelectorWindowUrl,
  handleConfigtoSelectorPage,
  handleSelectorPageData,
  handleSelectorWindow,
  handleAuthWindow,
  modifyAssetsToSave,
};

export default rootCustomField;
