import ThreekitURLGenerator from "../../services/ThreeekitURLGroup";
import {
  getSelectedAttributes,
  getStageCamera,
} from "../../redux/features/configurator/configurator.selector";
import { useStoreDispatch, useStoreSelector } from "../../main";

import s from "./PhotoSlider.module.scss";
import { setStageCamera } from "../../redux/features/configurator/configuratorSlice";

export const PhotoSlider = () => {


  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("asset");


  let listSelectedAttribute = useStoreSelector(getSelectedAttributes);
  let stageCamera = useStoreSelector(getStageCamera);

  const dispatch = useStoreDispatch();

  // Обробка зміни значення слайдера
  const cameraNumbers = [4, 8, 9, 10];

  if (Object.keys(listSelectedAttribute).length < 1) return <></>;
  const config = listSelectedAttribute;
  const keysToExclude = [
    "UIGrouping",
    "start_script",
    "UI_Arm",
    "UI_Basin",
    "UI_Bench",
    "UI_Faucet",
    "UI_Model",
    "UI_Size",
    "UI_Towel Knob",
  ];
  const allowedKeys = Object.keys(config).filter(
    (key) => !keysToExclude.includes(key)
  );

  const filteredConfig = allowedKeys.reduce((acc, key) => {
    acc[key] = config[key];
    return acc;
  }, {});
  console.log("Filtered Config:", filteredConfig);

  const onSelectCamera = (value) => {
    dispatch(setStageCamera(value));
  };

  return (
    <div className={s.wrapBox}>
      {cameraNumbers.map((camera) => {
        // Для кожного номера камери створюємо генератор URL з оновленою конфігурацією
        const generator = new ThreekitURLGenerator({
          assetId: product,
          orgId: "12a6bfdf-aa5f-48e7-97ff-172e9c5775d8",
          stageId: "592a5a16-b3f4-481f-a65f-ac4138f38fa0",
          bearer_token: "0b66f870-d3d5-4e41-b5f4-0862133df6a0",
          display: "image",
          height: 200,
          width: 200,
          format: "jpg",

          configuration: filteredConfig,
          stageConfiguration: { Camera: camera },
        });

        // Генеруємо URL для поточної камери
        const url = generator.generateURL();

        let classWrap = `${s.wrap}`;
        if ([8, 9, 10].includes(stageCamera) && camera === stageCamera)
          classWrap += ` ${s.active}`;

        if (![8, 9, 10].includes(stageCamera) && camera === 4)
          classWrap += ` ${s.active}`;

        return (
          <div
            key={url}
            className={`${classWrap}`}
            onClick={() => onSelectCamera(camera)}
          >
            <img src={url} alt={`Camera ${camera}`} className={s.thumbnail} />
          </div>
        );

        // return (
        //   <div
        //     className={classWrap}
        //     key={`${camera}+${url}`}
        //     style={{ minWidth: "100px", textAlign: "center" }}
        //     onClick={() => hasChangeCamera(camera)}
        //   >
        //     <img
        //       src={url}
        //       key={url}
        //       alt={`Config camera ${camera}`}
        //       style={{
        //         width: "100px",
        //         height: "100px",
        //       }}
        //     />
        //   </div>

        // );
      })}
    </div>
  );
};
