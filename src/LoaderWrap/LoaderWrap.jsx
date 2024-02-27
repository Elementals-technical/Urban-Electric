import s from "./LoaderWrap.module.scss";
import { useWindowPropertyWatcher } from "../utils/useWindowPropWatcher";
export const LoaderWrap = () => {
  const customPropertyValue = useWindowPropertyWatcher("loadImage", "");
  console.log("customPropertyValue", customPropertyValue);

  return customPropertyValue ? (
    <div className={s.loadWrap}>
      <span className={s.loader}></span>
    </div>
  ) : (
    <></>
  );
};
