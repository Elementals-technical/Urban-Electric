import { useEffect, useState } from "react";
import s from "./ControlConfig.module.scss";
import { ThreekitService } from "../services/ThreekitService";
import { SectionWrapper } from "../Components/SectionWrapper/SectionWrapper";
import { GroupedStructureService } from "../services/groupedStructureService";
export const ControlConfig = () => {
  const [attributes, setAttributes] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [configuratorLoaded, setConfiguratorLoaded] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const configurator = await ThreekitService.loadConfigurator();
        const attributeThreekit = configurator.getDisplayAttributes();
        setAttributes(attributeThreekit);
        setConfiguratorLoaded(true);
      } catch (error) {
        console.error("Помилка при завантаженні конфігуратора:", error);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    const data = GroupedStructureService.buildGroupedStructure(attributes);
    setGroupedData(data);
  }, [attributes]);

  // Перевірка: рендеримо лише, якщо плеєр завантажено
  if (!configuratorLoaded) {
    return <div>Loaded...</div>;
  }
console.log('groupedData',groupedData);

  return (
    <div className="p-4">
      {groupedData.map((section) => (
        <SectionWrapper key={section.section} sectionsData={section} />
      ))}
    </div>
  );
};
