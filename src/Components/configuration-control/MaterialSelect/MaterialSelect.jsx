import { useEffect, useState } from "react";
import { AttributeHelper } from "../../../services/createAttributeHelper";
import { ImageGridZoom } from "../ImageGridZoom/ImageGridZoom";
import { HexGridZoom } from "../HexGridZoom/HexGridZoom";

export const MaterialSelect = ({ attribute }) => {
  const [filters, setFilters] = useState({ Finish: "", Color: "" });
  const [sortBy, setSortBy] = useState("");

  const [attributeSelecteThreekit, setAttributeSelecteThreekit] =
    useState(undefined);

  const [selected, setSelected] = useState(attribute.value?.assetId);

  const handleSelect = (assetId) => {
    setSelected(assetId);
    window.configurator.setConfiguration({
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
    };

    initAttribute();
  }, []);

  if (!attributeSelecteThreekit) return <>MaterialSelect</>;
  debugger;
  const filteredItems = attributeSelecteThreekit.values.filter((item) => {
    debugger;
    return (
      (!filters.Finish || item.metadata?.Finish === filters.Finish) &&
      (!filters.Color || item.metadata?.Color === filters.Color)
    );
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "asc")
      return AttributeHelper.getValueLabel(a).localeCompare(
        AttributeHelper.getValueLabel(b)
      );
    if (sortBy === "desc")
      return AttributeHelper.getValueLabel(b).localeCompare(
        AttributeHelper.getValueLabel(a)
      );
    return 0;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex gap-2">
          <select
            className="rounded-full border px-3 py-1"
            value={filters.Finish}
            onChange={(e) => handleFilterChange("Finish", e.target.value)}
          >
            <option value="">Finish</option>
            {[
              ...new Set(
                attributeSelecteThreekit.values.map((i) => i.metadata?.Finish)
              ),
            ].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <select
            className="rounded-full border px-3 py-1"
            value={filters.Color}
            onChange={(e) => handleFilterChange("Color", e.target.value)}
          >
            <option value="">Color</option>
            {[
              ...new Set(
                attributeSelecteThreekit.values.map((i) => i.metadata?.Color)
              ),
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            className="rounded-full border px-3 py-1 text-sm"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="asc">Name ↑</option>
            <option value="desc">Name ↓</option>
          </select>
        </div>
      </div>

      <p className="font-medium mb-2">
        {attributeSelecteThreekit?.metadata?.label ||
          attributeSelecteThreekit.label}
      </p>
      <div className="grid grid-cols-6 gap-2">
        {sortedItems &&
          sortedItems.map((val) => {
            const isSelected = selected === val.assetId;
            const image = AttributeHelper.getImage(val);

            return (
              <button
                key={val.assetId}
                onClick={() => handleSelect(val.assetId)}
                className={`relative aspect-square border-2 rounded-sm overflow-hidden transition ${
                  isSelected ? "border-black" : "border-transparent"
                }`}
              >
                {image ? (
                  <ImageGridZoom item={val} />
                ) : (
                  <HexGridZoom item={val} />
                )}
                {isSelected && (
                  <div className="absolute inset-0 ring-2 ring-black pointer-events-none" />
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
};
