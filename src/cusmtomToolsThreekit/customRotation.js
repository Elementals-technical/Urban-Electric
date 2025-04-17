import { store } from "../redux";
import { getStageCamera } from "../redux/features/configurator/configurator.selector";
import { setStageCamera } from "../redux/features/configurator/configuratorSlice";

export async function rotationScript(api) {
  // Ініціалізація API та stageConfigurator
  let advancedPlayer = api.enableApi("player");
  advancedPlayer.tools.removeTool("zoom");
  let stageConfigurator = await api.getStageConfigurator();

  let initialX = 0; // Фіксована стартова позиція під час mousedown
  let counter = 0;
  let isDragging = false;

  // Функція обчислення кута камери за циклічним (кольцевим) перебором значень від 1 до 7
  function getCameraAngle(counter) {
    const normalized = ((counter % 7) + 7) % 7;
    return normalized + 1;
  }

  // Функція оновлення кута камери через stageConfigurator
  function updateCameraAngle(angle) {
    store.dispatch(setStageCamera(angle));

    stageConfigurator.setConfiguration({
      Camera: angle,
    });
  }
 
  // Визначення допустимого діапазону стартової позиції

  let currentAngle = stageConfigurator.getConfiguration()["Camera"];
  const toolConfig = {
    key: "movepartSelect",
    label: "Part Select Tool",
    active: true,
    enabled: true,
    // При потребі можна передати кастомну стартову позицію, наприклад:

    handlers: {
      mousedown: function (ev) {
        const storeState = store.getState();

        const stageCamera = getStageCamera(storeState);
        if ([8, 9, 10].includes(stageCamera)) return;

        isDragging = true;
        // Скидаємо лічильник для сесії
        counter = 0;
        // Використовуємо customStart або значення, отримане з getValueStart()
        let value = ev.clientX;
        currentAngle = stageConfigurator.getConfiguration()["Camera"];
        // Забезпечуємо, що стартова позиція в межах діапазону

        initialX = value;
        // console.log("mousedown, стартова позиція:", initialX);
        updateCameraAngle(getCameraAngle(currentAngle + counter - 1));
      },
      hover: (ev) => {
        if (!isDragging) return;
        // Обчислюємо різницю від початкової позиції
        const diff = ev.clientX - initialX;
        // Кожні 40 пікселів – один крок; counter обчислюється на основі повної різниці
        counter = Math.floor(diff / 40);
        console.log("Counter:", counter);
        console.log("currentAngle+counter:", currentAngle + counter);
        const angle = getCameraAngle(currentAngle + counter);
        updateCameraAngle(angle);
      },
      mouseup: (ev) => {
        if (!isDragging) return;
        isDragging = false;
        console.log("Final counter:", counter);
      },
    },
  };

  advancedPlayer.tools.addTool(toolConfig);
}
