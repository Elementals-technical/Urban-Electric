import { AttributeHelper } from "../../../services/AttributeHelper";
import { ImageGridZoom } from "../ImageGridZoom/ImageGridZoom";
import { HexGridZoom } from "../HexGridZoom/HexGridZoom";
import { useThreekitAttribute } from "../../../hook/useThreekitAttribute";
import { useEffect, useState } from "react";
import { useStoreDispatch, useStoreSelector } from "../../../main";
import { setActiveAttributes } from "../../../redux/features/configurator/configuratorSlice";
import { getAttributeByName } from "../../../redux/features/configurator/configurator.selector";

export const MaterialSelect = ({ attribute }) => {
  let attributeThreekit = useStoreSelector(
    getAttributeByName(attribute.optionName)
  );

  const { loading, error } = useThreekitAttribute(attribute.optionName);

  const dispatch = useStoreDispatch();

  const [filters, setFilters] = useState({ Finish: "", Color: "" });
  const [sortBy, setSortBy] = useState("");
  const [selected, setSelected] = useState(attribute.value?.assetId);

  const handleSelect = (assetId) => {
    setSelected(assetId);

    dispatch(
      setActiveAttributes({
        name: attributeThreekit.name,
        value: { assetId, type: "item" },
      })
    );
  };

  useEffect(() => {
    if (!loading && attributeThreekit) {
      setSelected(attributeThreekit.value.assetId);
    }
  }, [loading, attributeThreekit]);
  if (loading) return <>Download...</>;
  if (error) return <>MaterialSelect: Attribute loading error</>;
  if (!attributeThreekit) return <></>;

  // Фільтрація та сортування
  const filteredItems = attributeThreekit.values.filter((item) => {
    return (
      (!filters.Finish || item.metadata?.Finish === filters.Finish) &&
      (!filters.Color || item.metadata?.Color === filters.Color)
    );
  });

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
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, Finish: e.target.value }))
            }
          >
            <option key="finish-default" value="">
              Finish
            </option>
            {[
              ...new Set(
                attributeThreekit.values.map((i) => i.metadata?.Finish)
              ),
            ]
              .filter(Boolean) // Фільтруємо, щоб не було undefined або пустих значень
              .map((f, index) => (
                <option key={`finish-${f}-${index}`} value={f}>
                  {f}
                </option>
              ))}
          </select>
          <select
            className="rounded-full border px-3 py-1"
            value={filters.Color}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, Color: e.target.value }))
            }
          >
            <option key="color-default" value="">
              Color
            </option>
            {[
              ...new Set(
                attributeThreekit.values.map((i) => i.metadata?.Color)
              ),
            ]
              .filter(Boolean)
              .map((c, index) => (
                <option key={`color-${c}-${index}`} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
        <div>
          <select
            className="rounded-full border px-3 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="asc">Name ↑</option>
            <option value="desc">Name ↓</option>
          </select>
        </div>
      </div>

      <p className="font-medium mb-2">
        {attributeThreekit.metadata?.label || attributeThreekit.label}
      </p>
      <div className="grid grid-cols-6 gap-2">
        {sortedItems.map((val) => {
          const isSelected = selected === val.assetId;
          return (
            <button
              key={val.assetId}
              onClick={() => handleSelect(val.assetId)}
              className={`relative aspect-square border-2 rounded-sm overflow-hidden transition ${
                isSelected ? "border-black" : "border-transparent"
              }`}
            >
              {AttributeHelper.getImage(val) ? (
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
