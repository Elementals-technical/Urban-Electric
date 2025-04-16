import ThreekitURLGenerator from "../../services/ThreeekitURLGroup";

import s from "./PhotoSlider.module.scss";
import { ListSlider } from "./ListSlider";

export const PhotoSlider = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("asset");

  // Обробка зміни значення слайдера
  const cameraNumbers = [4, 8, 9, 10];

  const config = window.configurator.getConfiguration();
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

  let listAttribute = cameraNumbers.map((camera) => {
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

    return {
      url,
      camera,
    };
  });

  return (
    <div className={s.wrapBox}>
      <ListSlider listAttribute={listAttribute} />
    </div>
  );
};
