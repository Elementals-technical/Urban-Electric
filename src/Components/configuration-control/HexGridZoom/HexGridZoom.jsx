import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Maximize2 } from "lucide-react";
import { AttributeHelper } from "../../../services/AttributeHelper";

export const HexGridZoom = ({ item }) => {
  const [zoomSrc, setZoomSrc] = useState(null);

  const defaultHex = `#f2f1f1`;

  const hexColor = AttributeHelper.getHexColor(item);

  return (
    <>
      <div
        className="relative w-full h-full  aspect-video rounded overflow-hidden border shadow-sm group cursor-pointer"
        style={{ backgroundColor: hexColor || defaultHex }}
      >
        <div
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow group-hover:scale-105 transition"
          onClick={(e) => {
            e.stopPropagation();
            setZoomSrc(hexColor || defaultHex);
          }}
          role="button"
          tabIndex={0}
        >
          <Maximize2 size={16} />
        </div>
      </div>
      <Dialog
        open={!!zoomSrc}
        onClose={() => {
          setZoomSrc(null);
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Dialog.Panel className="max-w-4xl w-full p-4">
          <div
            className="w-full aspect-video rounded"
            style={{ backgroundColor: zoomSrc }}
          ></div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};
