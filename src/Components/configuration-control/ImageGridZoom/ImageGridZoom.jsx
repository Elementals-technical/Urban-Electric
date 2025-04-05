import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Maximize2 } from "lucide-react";
import { AttributeHelper } from "../../../services/createAttributeHelper";

export const ImageGridZoom = ({ item }) => {
  const [zoomSrc, setZoomSrc] = useState(null);

  const imageUrl = AttributeHelper.getImage(item);

  return (
    <>
      <div className="relative w-full h-full  aspect-video rounded overflow-hidden border shadow-sm group cursor-pointer">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={AttributeHelper.getValueLabel(item)}
            className="w-full h-full object-cover"
          />
        )}
        <button
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow group-hover:scale-105 transition"
          onClick={() => {
            setZoomSrc(imageUrl);
          }}
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <Dialog
        open={!!zoomSrc}
        onClose={() => {
          setZoomSrc(null);
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Dialog.Panel className="max-w-4xl w-full p-4">
          <img
            src={zoomSrc}
            alt="Zoomed"
            className="w-full h-auto rounded-lg"
          />
        </Dialog.Panel>
      </Dialog>
    </>
  );
};
