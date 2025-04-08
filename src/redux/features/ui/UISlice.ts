import { createSlice } from "@reduxjs/toolkit";
import { UIState } from "./ui.type";

const initialState: UIState = {};

export const uiSlice = createSlice({
  name: "UI",
  initialState,
  reducers: {},
});

export const {} = uiSlice.actions;

export default uiSlice.reducer;
