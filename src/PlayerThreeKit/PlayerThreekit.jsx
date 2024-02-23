import React, { useEffect, useState } from "react";

import s from "./PlayerThreeKit.module.scss";
import load3kit from "../utils/load3kit";
import { THREEKIT_PARAMS } from "../App";

export const PlayerThreeKit = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("asset");
  let mode = "image";
  if (urlParams.get("mode") == "webgl") {
    mode = "webgl";
  }

  const [loaded, setLoaded] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const playerEl = React.createRef();
  const init3kit = () => {
    if (!playerEl.current) return false;

    if (window.threekitPlayer && !initializing) {
      setInitializing(true);

      window
        .threekitPlayer({
          authToken: THREEKIT_PARAMS["authToken"],
          el: playerEl.current,
          assetId: product,
          // stageId: 'f9af640a-2f8e-4617-9484-84e723e97549',

          showConfigurator: true,
          display: mode,
          publishStage: "draft",
          // showAR: true,
        })
        .then(async (api) => {
          window.player = api;
          await api.when("preloaded");
          await window.player.when("loaded");

          // api.tools.removeTool('zoom');
          // window.configurator = await api.getConfigurator();
        });
    }
  };

  useEffect(() => {
    load3kit(null, () => {
      setLoaded(true);
      init3kit();
    });
  });
 

  return (
    <div className={s.player_wrapper}>
      {loaded ? <div id="player" className={s.player} ref={playerEl} /> : ""}
    </div>
  );
};
