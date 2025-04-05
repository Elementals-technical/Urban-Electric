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
    if (!item.value) return;
    const {
      UICategory,
      UICategoryOrder,
      UIGroupingOptionName,
      UIGroupingOrder,
      "3DOptionName": optionName,
      UIOptionOrder,
      typeUI,
      applyFilter,
    } = item.value;

    if (!UICategory || !UIGroupingOptionName || !optionName) return;

    // Якщо категорія ще не додана, створюємо об'єкт для неї
    if (!result[UICategory]) {
      result[UICategory] = {
        section: UICategory,
        sort: UICategoryOrder,
        groups: [],
      };
    }

    // Шукаємо групу в межах категорії
    let groupObj = result[UICategory].groups.find(
      (g) => g.groupName === UIGroupingOptionName
    );

    // Якщо група не існує, створюємо її
    if (!groupObj) {
      groupObj = {
        groupName: UIGroupingOptionName,
        order: UIGroupingOrder,
        options: [],
      };
      result[UICategory].groups.push(groupObj);
    }

    // Додаємо опцію, якщо її ще нема
    if (!groupObj.options.some((opt) => opt.option === optionName)) {
      groupObj.options.push({
        option: optionName,
        optionName: `UI_${optionName}`,
        order: UIOptionOrder,
        type: applyFilter ? "filter" : "simple",
        typeComponent: typeUI,
      });
    }
  });

  // Перетворюємо об'єкт в масив та сортуємо категорії за їх порядком
  const categories = Object.values(result);
  categories.forEach((cat) => {
    // Сортуємо групи всередині категорії
    cat.groups.sort((a, b) => a.order - b.order);
    cat.groups.forEach((group) => {
      // Сортуємо опції всередині групи
      group.options.sort((a, b) => a.order - b.order);
    });
  });
  categories.sort((a, b) => a.sort - b.sort);

  return categories;
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

  api.configurator.setConfiguration({
    UIGrouping: JSON.stringify(groupedStructure),
  });
}

// Виклик основної функції (приклад):
updateLogicAttribute(api);
