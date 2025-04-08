import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CameraI,
  ConfiguratorState,
  IAttributeAsset,
} from "./configurator.type";

const initialState: ConfiguratorState = {
  isLoadingConfiguration: false,
  defaultConfiguration: null,
  listAttributes: [],
  selectedAttributes: [],
};

export const reducerSlice = createSlice({
  initialState,
  name: "configurator",
  reducers: {
    setIsLoadingConfiguration: (state, action: PayloadAction<boolean>) => {
      state.isLoadingConfiguration = action.payload;
    },

    setDefaultConfiguration: (state, action) => {
      if (!state.defaultConfiguration) {
        state.defaultConfiguration = action.payload;
      }
    },
    setListAttributes: (
      state: ConfiguratorState,
      action: PayloadAction<IAttributeAsset[]>
    ) => {
      state.listAttributes = action.payload;
    },

    setActiveAttributes: (
      state: ConfiguratorState,
      action: PayloadAction<{ name: string; value: any | string }>
    ) => {},
  },
});

export const {
  setIsLoadingConfiguration,
  setDefaultConfiguration,
  setListAttributes,
  setActiveAttributes,
} = reducerSlice.actions;

export default reducerSlice.reducer;
