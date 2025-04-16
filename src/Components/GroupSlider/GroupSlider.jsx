import { useEffect, useState } from "react";
import { ThreekitService } from "../../services/ThreekitService";
import { PhotoSlider } from "../PhotoSlider/PhotoSlider";
import s from "./../PhotoSlider/PhotoSlider.module.scss";

export const GroupSlider = () => {
  const [configuratorLoaded, setConfiguratorLoaded] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const configurator = await ThreekitService.loadConfigurator();
        const attributeThreekit = configurator.getDisplayAttributes();

        setTimeout(() => {
          setConfiguratorLoaded(true);
        }, 3000);
      } catch (error) {
        console.error("Помилка при завантаженні конфігуратора:", error);
      }
    };

    initData();
  }, []);

  // Перевірка: рендеримо лише, якщо плеєр завантажено
  if (!configuratorLoaded) {
    return <div className={s.wrapBox}>Loaded...</div>;
  }
  return (
    <>
      <PhotoSlider />
    </>
  );
};
