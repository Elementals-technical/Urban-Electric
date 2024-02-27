import { useLocation } from "react-router-dom";
import s from "./ControlConfig.module.scss";

import { useEffect, useState } from "react";
import axios from "axios";

export const ControlConfig = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("asset");

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
      setMode("Webgl");
    }
  };

  const RedirectToBase = () => {
    if (location.search.includes("mode=webgl")) {
      const params = new URLSearchParams(location.search);
      params.delete("mode");
      window.location.href = `${location.pathname}?${params}`;
    }
    setMode("Vray");
  };

  const onSelectedCamera = async (number) => {
    let stage = await window["player"].getStageConfigurator();
    stage.setConfiguration({
      "Camera Position v2": number,
    });
    setStateCamera(number);
  };

  useEffect(() => {}, []);

  function downloadBase64File(base64Data, filename) {
    window.loadImage = true;
    // Виділяємо тип даних з base64 строки
    const dataType = base64Data.match(/^data:(.*);base64,/)[1];
    // Перетворюємо base64 строку у чистий base64, видаляючи метадані
    const base64 = base64Data.replace(/^data:.*;base64,/, "");
    // Перетворюємо base64 у масив байт
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    // Створюємо Blob з масиву байт
    const blob = new Blob(byteArrays, { type: dataType });
    // Створюємо URL для Blob об'єкту
    const blobUrl = URL.createObjectURL(blob);

    // Створюємо тимчасове посилання для скачування
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    // Імітуємо клік по посиланню, щоб розпочати скачування
    document.body.appendChild(link);
    link.click();
    // Видаляємо тимчасове посилання
    document.body.removeChild(link);
    // Звільнюємо ресурси, видаляючи створений URL
    URL.revokeObjectURL(blobUrl);
    window.loadImage = false;
  }

  // Функция для скачивания изображения
  async function downloadImageApi(product, confThreekit, title) {
    const url = `https://ue-snapshot.3dconfiguration.com/thumbnail/${product}.jpg`;
    window.loadImage = true;
    try {
      const response = await axios.post(
        url,
        {
          configuration: confThreekit,
        },
        {
          responseType: "arraybuffer", // Указываем, что ожидаем ответ в виде буфера
        }
      );

      // Создаем Blob из полученного буфера данных
      const blob = new Blob([response.data], { type: "image/jpeg" });

      // Создаем URL для скачивания
      const downloadUrl = window.URL.createObjectURL(blob);

      // Создаем временную ссылку для скачивания
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${title}.jpg`); // Назначаем имя файла
      document.body.appendChild(link);
      link.click();

      // Очищаем ссылку после скачивания
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl); // Освобождаем URL

      window.loadImage = false;
    } catch (error) {
      console.error("Ошибка при скачивании изображения:", error);
    }
  }

  // Припустимо, test містить base64 зображення, отримане асинхронно
  async function handleSnapshot() {
    const conf = await window.player.getConfigurator();
    const confThreekit = conf.getFullConfiguration();

    if (mode === "Vray") {
      downloadImageApi(product, confThreekit, document.title);
    } else {
      let test = await window.player.snapshotAsync({
        size: { height: 1024 },
      });
      downloadBase64File(test, `${document.title}.png`);
    }
  }

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
      <div className={s.wrap}>
        <button onClick={() => handleSnapshot()}>Download Render</button>
      </div>
    </div>
  );
};
