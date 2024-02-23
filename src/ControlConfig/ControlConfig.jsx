import { useLocation } from "react-router-dom";
import s from "./ControlConfig.module.scss";

import { useEffect, useState } from "react";

export const ControlConfig = () => {
  const location = useLocation();

  const [cameraState, setStateCamera] = useState(0);
  const [mode, setMode] = useState(
    location.search.includes("mode=webgl") ? "Webgl" : "Vray"
  );

  const RedirectToWebgl = () => {
    if (!location.search.includes("mode=webgl")) {
      window.location.href = `${location.pathname}?${new URLSearchParams({
        ...Object.fromEntries(new URLSearchParams(location.search)),
        mode: "webgl",
      })}`;
      setMode("Webgl")
    }
  };

  const RedirectToBase = () => {
    if (location.search.includes("mode=webgl")) {
      const params = new URLSearchParams(location.search);
      params.delete("mode");
      window.location.href = `${location.pathname}?${params}`;
    }
    setMode("Vray")
  };

  const onSelectedCamera = async (number) => {
    let stage = await window["player"].getStageConfigurator();
    stage.setConfiguration({
      "Camera Position v2": number,
    });
    setStateCamera(number);
  };

  useEffect(() => {}, []);

  return (
    <div className={s.wrapConf}>
      <div className={s.wrap}>
        <label className={s.label}>Type config</label>
        <div className={s.wrapButton}>
          {["Webgl", "Vray"].map((type) => {
            let classB = ``;
            if (mode === type) classB += `${s.active}`;

            return (
              <button
                key={type}
                className={classB}
                onClick={() =>
                  type === "Webgl" ? RedirectToWebgl() : RedirectToBase()
                }
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
      <div className={s.wrap}>
        <label className={s.label}>Camera Position</label>
        <div className={s.wrapButton}>
          {[0, 1, 2].map((item) => {
            let classButton = ``;

            if (item === cameraState) classButton += `${s.active}`;

            return (
              <button
                key={item}
                className={classButton}
                onClick={() => onSelectedCamera(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
