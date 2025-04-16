import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../index";
import { isConfigurationAsset } from "./configuratorFunctions";

// export const getConfigCategoryById = (id: any) => (state: RootState) =>
//   state.configurator.interfaceCategories.find(
//     (category: any) => category.id === id
//   );

// export const getConfigCategories = (state: RootState) =>
//   state.configurator.interfaceCategories;

// export const getDoorStyle = (state: RootState) => state.configurator.doorStyle;
// export const getHasFirstLoad = (state: RootState) =>
//   state.configurator.isFirstLoadPlayer;
// export const getShouldLoadPlayer = (state: RootState) =>
//   state.configurator.shouldLoadPlayer;

// export const getDefaultConfiguration = (state: RootState) => state.configurator.defaultConfiguration;
export const getListAttributes = (state: RootState) =>
  state.configurator.listAttributes;
export const getStageCamera = (state: RootState) => {
  debugger;
  return state.configurator.stageCamera;
};
export const getAttributeByName =
  (optionName: string) => (state: RootState) => {
    let listAttributes = getListAttributes(state);

    return listAttributes.find((attr) => attr.name === optionName);
  };

export const getSelectedAttributes = (state: RootState) => {
  let listAttributes = getListAttributes(state);

  if (listAttributes.length < 1) return [];

  const objConfig = {};

  listAttributes.forEach((attr) => {
    objConfig[attr.name] = attr.value;
  });

  return objConfig;
};

// export const getActiveAttributes = (state: RootState) => state.configurator.activeAttributes;
// export const getActiveAttributesSupport = (state: RootState) => state.configurator.activeAttributesSupport;
// export const getCameraData = (state: RootState) => state.configurator.camera;
// export const getIsLoadingConfiguration = (state: RootState) => state.configurator.isLoadingConfiguration;
// export const getIsScreenshotCaptured = (state: RootState) => state.configurator.isScreenShotCaptured;
// export const getActiveShortId = (state: RootState) => state.configurator.shortId;
// export const getActiveAttributesForShortId = (state: RootState) => state.configurator.activeAttributesForShortId;

// export const checkUpdatedConfiguration = createSelector(
//   [getDefaultConfiguration, getActiveAttributes],
//   (defaultConfiguration, activeAttributes) => {
//     return activeAttributes.reduce<boolean>(
//       (isUpdatedConfiguration, activeAttribute) => {
//         if (isUpdatedConfiguration) return isUpdatedConfiguration;

//         const { assetId, name } = activeAttribute;
//         const configurationAttribute = defaultConfiguration?.[name];

//         if (
//           configurationAttribute &&
//           typeof configurationAttribute === "object" &&
//           isConfigurationAsset(configurationAttribute) &&
//           configurationAttribute.assetId !== assetId
//         ) {
//           isUpdatedConfiguration = true;
//         }
//         return isUpdatedConfiguration;
//       },
//       false
//     );
//   }
// );

// export const checkUpdatedConfigurationForShortId = createSelector(
//   [getActiveAttributes, getActiveAttributesSupport, getActiveAttributesForShortId],
//   (activeAttributes, activeAttributesSupport, historyAttributes) => {

//     if (historyAttributes.length === 0) return true;

//     return [ ...activeAttributes, ...activeAttributesSupport ].reduce<boolean>(
//       (isUpdatedConfiguration, activeAttribute) => {
//         if (isUpdatedConfiguration) return isUpdatedConfiguration;

//         const { assetId, name } = activeAttribute;
//         const historyAttribute = historyAttributes.find(({name: nameH}) => nameH === name);

//         if (historyAttribute === undefined) isUpdatedConfiguration = true;

//         if (
//           historyAttribute &&
//           historyAttribute.assetId !== assetId
//         ) {
//           isUpdatedConfiguration = true;
//         }
//         return isUpdatedConfiguration;
//       },
//       false
//     );
//   }
// );
