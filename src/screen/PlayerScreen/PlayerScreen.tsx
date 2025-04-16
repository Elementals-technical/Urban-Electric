import s from "./PlayerScreen.module.scss";

import { ControlConfig } from "../../ControlConfig/ControlConfig";
import { LoaderWrap } from "../../LoaderWrap/LoaderWrap";
import { PlayerThreeKit } from "../../PlayerThreeKit/PlayerThreekit";
import { GroupSlider } from "../../Components/GroupSlider/GroupSlider";

export const PlayerScreen = () => {
  return (
    <div className={s.wrap}>
      <LoaderWrap />
      <div className={s.box_player}>
        <PlayerThreeKit />
        <GroupSlider />
      </div>
      <div className={s.box_control_panel}>
        <ControlConfig />
      </div>
    </div>
  );
};
