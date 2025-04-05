// Створюємо функцію для роботи з ThreekitApi
function createThreekitApiService(api) {
  const player = api.enableApi("player");

  return {
    getAttributeState: () => player.configurator.getAttributeState(),
    getMetadataValue: function (name, api) {
      const listMetadata = api.configurator.metadata;
      return listMetadata[name];
    },
    getAttributes: () => player.configurator.getAttributes(),
    getDisplayAttributes: () => player.configurator.getDisplayAttributes(),
    getFullConfiguration: () => player.configurator.getFullConfiguration(),
    setAttributeState: (attrId, state) =>
      player.configurator.setAttributeState(attrId, state),
    setConfiguration: (config) => player.configurator.setConfiguration(config),
    callStoreApi: (params) => player.getStore().callApi(params),
  };
}

// Сервіс роботи з дататаблицями Threekit
function createThreekitDatatableService(apiService, orgId) {
  const cache = (window.tkdatatables = window.tkdatatables || {});

  async function loadDatatableRows(tableId) {
    if (!cache[tableId]) {
      const url = `${window.threekitconf.datatablesApiRoot}/datatables/${tableId}/rows?orgId=${orgId}&all=true`;
      const res = await apiService.callStoreApi({ url });
      cache[tableId] = res?.rows || [];
      if (!cache[tableId].length) {
        console.error(`No data found for table: ${tableId}`);
      }
    }
    return cache[tableId];
  }

  function getCachedDatatable(tableId) {
    return cache[tableId] || [];
  }

  return {
    loadDatatableRows,
    getCachedDatatable,
  };
}

// Менеджер дататаблиць (загальний інтерфейс)
function createDatatableManager(apiService, orgId) {
  const threekitService = createThreekitDatatableService(apiService, orgId);

  return {
    loadTableRows: (tableId) => threekitService.loadDatatableRows(tableId),
    getCachedTable: (tableId) => threekitService.getCachedDatatable(tableId),
  };
}

// Хелпер: з групи рядків витягає пари optionName => [optionValue...]
function getValuesBy3DOptions(dataArray, optionName, optionValue) {
  const objProps = {};
  const arrayAttribute = dataArray.map(({ value }) => {
    const nameAttribute = value[optionName];
    const valAttribute = value[optionValue];
    if (objProps[nameAttribute]) {
      objProps[nameAttribute].push(valAttribute);
    } else {
      objProps[nameAttribute] = [valAttribute];
    }
    return { Name: nameAttribute, Value: valAttribute };
  });
  return { objProps, arrayAttribute };
}

// Хелпер: перевіряє, чи всі непорожні значення configuration є у рядку inputText
function checkConfigurationInString(inputText, configuration) {
  const entries = Object.entries(configuration);
  if (entries.every(([, val]) => !val?.trim())) {
    return true; // Усі поля порожні — жодних умов
  }
  const nonEmptyValues = entries
    .filter(([, val]) => val?.trim())
    .map(([, val]) => val.trim());
  return nonEmptyValues.every((val) => inputText.includes(val));
}
/**
 * Групує дані за UIGroupingOptionName та повертає об’єкт виду:
 * {
 *   UIGroupingOptionName: [3DOptionName, 3DOptionName, 3DOptionName],
 *   ...
 * }
 *
 * @param {Array} data - Масив об’єктів, де кожен має вкладене поле `value` із властивостями:
 *   - UIGroupingOptionName
 *   - 3DOptionName
 * @returns {Object} - Об’єкт з групуванням даних.
 */
function generateGroupedStructure(data) {
  const result = {};

  data.forEach((item) => {
    if (!item.value) return; // Перевірка наявності поля value

    const group = item.value.UIGroupingOptionName;
    const optionName = item.value["3DOptionName"];

    if (!group) return; // Якщо немає імені групи, пропускаємо запис

    // Якщо група ще не створена — ініціалізуємо її як Set для уникнення дублікатів
    if (!result[group]) {
      result[group] = new Set();
    }
    if (optionName) {
      result[group].add(optionName);
    }
  });

  // Перетворюємо кожен Set в масив
  Object.keys(result).forEach((group) => {
    result[group] = Array.from(result[group]);
  });

  return result;
}

// Основна функція логіки оновлення
async function updateLogicAttribute(api) {
  const orgId = "12a6bfdf-aa5f-48e7-97ff-172e9c5775d8";

  const apiService = createThreekitApiService(api);
  const tableManager = createDatatableManager(apiService, orgId);

  // 1) Зчитуємо метадані
  const masterFile = apiService.getMetadataValue("Hasting-Master-File", api);
  const productName = apiService.getMetadataValue("Product", api);

  // 2) Завантажуємо рядки з майстер-файлу
  const masterRows = await tableManager.loadTableRows(masterFile);
  // 3) Шукаємо потрібний продукт
  const foundMaster = masterRows.find((row) =>
    row.value.name.includes(productName)
  );

  // 4) Завантажуємо його таблицю
  const productId = foundMaster?.value?.id;
  const productRows = await tableManager.loadTableRows(productId);

  const groupedStructure = generateGroupedStructure(productRows);

  console.log("groupedStructure", groupedStructure);

  debugger;

  // 5) Фільтруємо за applyFilter === "TRUE"
  // const filterProperty = productRows.filter(
  //   (r) => r.value.applyFilter === "TRUE"
  // );
  // const dataValue = getValuesBy3DOptions(
  //   filterProperty,
  //   "3DOptionName",
  //   "3DOptionValue"
  // );

  // const objectFilterAttribute = dataValue["objProps"];

  // console.log("dataValue", dataValue);

  // 6) Знаходимо атрибут Model і його стейт
  // const displayAttrs = await api.configurator.getDisplayAttributes();
  // const attributeModel = displayAttrs.find((attr) => attr.name === "Model");
  // if (!attributeModel) {
  //   console.warn("Model attribute not found");
  //   return;
  // }
  // const attributeModelID = attributeModel.id;
  // const displayAttrState = await api.configurator.getAttributeState();
  // const modelState = displayAttrState[attributeModelID];
  // const modelValues = modelState?.values || [];

  // 7) Ліст доступних моделей (3DOptionName === "Model")
  // const modelRows = productRows.filter(
  //   (item) => item.value["3DOptionName"] === "Model"
  // );
  // const { objProps: availableModels } = getValuesBy3DOptions(
  //   modelRows,
  //   "3DOptionName",
  //   "3DOptionValue"
  // );

  // // 8) Зчитаємо поточну конфігурацію
  // let activeValue = {};

  // Object.keys(objectFilterAttribute).forEach((key) => {
  //   activeValue[key] = api.configuration[key];
  // });

  // debugger;

  // // 9) Формуємо новий список значень
  // let refinedModelValues = modelValues.map((attr) => {
  //   const { value } = attr;
  //   const inList = availableModels["Model"]?.includes(value);
  //   const visible = inList;
  //   return { ...attr, visible };
  // });

  // // 10) Оновлюємо стейт
  // await api.configurator.setAttributeState(attributeModelID, {
  //   values: refinedModelValues,
  // });
  // refinedModelValues = modelValues.map((attr) => {
  //   const { value } = attr;
  //   const inList = availableModels["Model"]?.includes(value);
  //   const visible = inList && checkConfigurationInString(value, activeValue);
  //   return { ...attr, visible };
  // });

  // // 10) Оновлюємо стейт
  // await api.configurator.setAttributeState(attributeModelID, {
  //   values: refinedModelValues,
  // });

  // console.log("Updated Model values:", refinedModelValues);

  // Object.keys(objectFilterAttribute).forEach((key) => {
  //   const attributeModelData = displayAttrs.find((attr) => attr.name === key);

  //   const attributeID = attributeModelData.id;

  //   let modelStateAttribute = displayAttrState[attributeID];

  //   const modelStateValues = modelStateAttribute?.values || [];

  //   let refinedModelValuesAttribute1 = modelStateValues.map((attr) => {
  //     const { value } = attr;
  //     const inList = objectFilterAttribute[key]?.includes(value);
  //     const visible = inList;
  //     return { ...attr, visible };
  //   });
  //   debugger;
  //   api.configurator.setAttributeState(attributeID, {
  //     values: refinedModelValuesAttribute1,
  //   });
  // });
}

// Виклик основної функції (приклад):
updateLogicAttribute(api);
