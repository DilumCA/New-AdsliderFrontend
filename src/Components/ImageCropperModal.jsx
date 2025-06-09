import React from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./utils/cropImage"; // Adjust the import path as necessary

const ImageCropperModal = ({
  open,
  imageSrc,
  onClose,
  onCropComplete,
  aspect = 2.5,
}) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const handleCropComplete = React.useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

   const handleDone = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const previewUrl = URL.createObjectURL(croppedBlob);
    onCropComplete(croppedBlob, previewUrl); // Pass both blob and preview URL
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[430px] max-w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>
        <div className="relative w-[400px] h-[160px] bg-gray-200 mx-auto">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex items-center mt-4">
          <span className="mr-2">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="w-48 accent-blue-500"
          />
          <span className="ml-2 text-sm text-gray-500">{zoom.toFixed(2)}x</span>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded shadow transition"
            type="button"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;