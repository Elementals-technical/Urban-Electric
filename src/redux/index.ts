import { configureStore } from "@reduxjs/toolkit";
import ConfiguratorReducer, {
  setIsLoadingConfiguration,
  setListAttributes,
} from "./features/configurator/configuratorSlice";
import UIReducer from "./features/ui/UISlice";
import { ThreekitService } from "../services/ThreekitService";
// import { ThreekitDisplayAttribute } from "../shared/services/Threekit/ThreekitDisplayAttribute/ThreekitDisplayAttribute";

declare const window: any;

const loggerMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  if (
    action.type === "configurator/setActiveAttributes" &&
    action.payload.value
  ) {
    let functionsetData = async () => {
      storeAPI.dispatch(setIsLoadingConfiguration(true));

      await window.configurator.setConfiguration({
        [action.payload.name]: action.payload.value,
      });

      const configurator1 = await window.player.getConfigurator();
      const attributeThreekitUIModel = configurator1
        .getDisplayAttributes()
        .find((attr) => attr.name === "UI_Model");

      await window.configurator.setConfiguration({
        ["UI_Model"]: {
          assetId: attributeThreekitUIModel.values[0].assetId,
        },
      });

      const configurator = await window.player.getConfigurator();
      const attributeThreekit = await configurator.getDisplayAttributes();

      storeAPI.dispatch(setListAttributes(attributeThreekit));
      storeAPI.dispatch(setIsLoadingConfiguration(false));
    };
    functionsetData();
  }

  if (action.type === "configurator/setStageCamera" && action.payload) {
    let functionsetData = async () => {
      storeAPI.dispatch(setIsLoadingConfiguration(true));

      await window.stageConfigurator.setConfiguration({
        Camera: action.payload,
      });

      storeAPI.dispatch(setIsLoadingConfiguration(false));
    };
    functionsetData();
  }

  const result = next(action);

  return result;
};

export const store = configureStore({
  reducer: {
    configurator: ConfiguratorReducer,
    ui: UIReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
