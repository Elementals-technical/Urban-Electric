import React from "react";
import { useStoreDispatch, useStoreSelector } from "../../main";
import { getStageCamera } from "../../redux/features/configurator/configurator.selector";
import { setStageCamera } from "../../redux/features/configurator/configuratorSlice";
import s from "./PhotoSlider.module.scss";
export const ListSlider = ({ listAttribute }) => {
  let stageCamera = useStoreSelector(getStageCamera);

  const dispatch = useStoreDispatch();
  const onSelectCamera = (value) => {
    dispatch(setStageCamera(value));
  };

  return (
    <>
      {listAttribute.map((data) => {
        // Для кожного номера камери створюємо генератор URL з оновленою конфігурацією

        // Генеруємо URL для поточної камери
        const url = data.url;
        const camera = data.camera;

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
      })}
    </>
  );
};
