import { useEffect, useState } from "react";
import { AttributeHelper } from "../../../services/createAttributeHelper";

export const SimpleSelect = ({ attribute }) => {
  const [attributeSelecteThreekit, setAttributeSelecteThreekit] =
    useState(undefined);

  const [selected, setSelected] = useState(undefined);

  const handleSelect = (assetId) => {
    setSelected(assetId);
    window.player.setConfiguration({
      [attributeSelecteThreekit.name]: { assetId, type: "item" },
    });
  };

  const { optionName } = attribute;

  useEffect(() => {
    let initAttribute = async () => {
      const conf = await window.player.getConfigurator();

      let attributeThreekit = conf
        .getDisplayAttributes()
        .find((attr) => attr.name === optionName);

      setAttributeSelecteThreekit(attributeThreekit);

      setSelected(attributeThreekit.value?.assetId);
    };

    initAttribute();
  }, []);

  if (!attributeSelecteThreekit) return <>1</>;
  return (
    <div>
      <p className="font-medium mb-2">
        {attributeSelecteThreekit &&
          AttributeHelper.getAttributeLabel(attributeSelecteThreekit)}
        :
      </p>
      <div className="flex flex-wrap gap-2">
        {attributeSelecteThreekit &&
          attributeSelecteThreekit.values.map((val) => {
            return (
              <button
                key={val.assetId}
                onClick={() => handleSelect(val.assetId)}
                className={`px-4 py-2 rounded-full border transition ${
                  selected === val.assetId
                    ? "bg-black text-white"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {AttributeHelper.getValueLabel(val)}
              </button>
            );
          })}
      </div>
    </div>
  );
};
