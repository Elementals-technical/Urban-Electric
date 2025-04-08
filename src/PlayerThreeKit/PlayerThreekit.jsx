import React, { useEffect, useState } from "react";

import s from "./PlayerThreeKit.module.scss";
import load3kit from "../utils/load3kit";
import { THREEKIT_PARAMS } from "../App";
import { rotationScript } from "../cusmtomToolsThreekit/customRotation";
import { useStoreDispatch } from "../main";
import { setListAttributes } from "../redux/features/configurator/configuratorSlice";
import { ThreekitService } from "../services/ThreekitService";

export const PlayerThreeKit = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("asset");
  let mode = "image";
  if (urlParams.get("mode") == "webgl") {
    mode = "webgl";
  }
  const dispatch = useStoreDispatch();

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
          initialConfiguration: {
            ["BG_on/off"]: true,
          },
          showConfigurator: true,
          display: mode,
          publishStage: "draft",
          // showAR: true,
        })
        .then(async (api) => {
          window.player = api;
          await api.when("preloaded");
          await window.player.when("loaded");
          window.configurator = await api.getConfigurator();

          window.configurator.setConfiguration({ start_script: false });

          window.configurator.setConfiguration({ start_script: true });

          // let advancedPlayer = api.enableApi("player");
          // advancedPlayer.tools.removeTool("zoom");
          rotationScript(api);

          const configurator = await ThreekitService.loadConfigurator();
          const attributeThreekit = configurator.getDisplayAttributes();

          dispatch(setListAttributes(attributeThreekit));

          // api.tools.removeTool('zoom');
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
