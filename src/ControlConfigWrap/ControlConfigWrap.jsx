import React from "react";
import { ControlConfig } from "../ControlConfig/ControlConfig";

export const ControlConfigWrap = () => {
  return window["player"] ? <ControlConfig /> : <></>;
};
