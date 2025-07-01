import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

// Helper function to call the backend crop API using axios
async function cropImage(file, crop) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const formData = new FormData();
  formData.append("image", file);
  formData.append("x", crop.x);
  formData.append("y", crop.y);
  formData.append("width", crop.width);
  formData.append("height", crop.height);

  const response = await axios.post(`${baseUrl}/api/crop`, formData, {
    responseType: "blob",
  });

  if (response.status !== 200) throw new Error("Crop failed");
  return URL.createObjectURL(response.data);
}

const CONTAINER_WIDTH = 500;
const CONTAINER_HEIGHT = 200;
const ASPECT_RATIO = 3; // 6:2 = 3:1
const MIN_CROP_WIDTH = 60;
const MIN_CROP_HEIGHT = 20;

const CropSelector = ({ imageSrc, originalFile, onCropConfirm, onCancel }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 1, height: 1 });
  const [crop, setCrop] = useState({
    x: (CONTAINER_WIDTH - 300) / 2,
    y: (CONTAINER_HEIGHT - 100) / 2,
    width: 300,
    height: 100,
    resizing: false,
    resizeCorner: null, // "br" or "tl"
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startX: 0,
    startY: 0,
    startWidth: 300,
    startHeight: 100,
  });

  // Get natural size of the image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new window.Image();
    img.onload = () => setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = imageSrc;
  }, [imageSrc]);

  // Mouse events for dragging the crop frame
  const onCropMouseDown = (e) => {
    // Only drag if not resizing
    if (crop.resizing) return;
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setCrop((prev) => ({
      ...prev,
      dragging: true,
      dragStartX: e.clientX - rect.left,
      dragStartY: e.clientY - rect.top,
      startX: prev.x,
      startY: prev.y,
    }));
  };

  // Mouse events for resizing the crop box (aspect ratio locked)
  const onResizeDown = (corner) => (e) => {
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setCrop((prev) => ({
      ...prev,
      resizing: true,
      resizeCorner: corner,
      resizeStartX: e.clientX - rect.left,
      resizeStartY: e.clientY - rect.top,
      startX: prev.x,
      startY: prev.y,
      startWidth: prev.width,
      startHeight: prev.height,
    }));
  };

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    if (crop.resizing) {
      if (crop.resizeCorner === "br") {
        // Bottom-right: resize width/height with aspect ratio
        let deltaX = mouseX - crop.resizeStartX;
        let newWidth = crop.startWidth + deltaX;
        let newHeight = newWidth / ASPECT_RATIO;

        // Clamp width and height
        if (newWidth < MIN_CROP_WIDTH) {
          newWidth = MIN_CROP_WIDTH;
          newHeight = newWidth / ASPECT_RATIO;
        }
        if (newHeight < MIN_CROP_HEIGHT) {
          newHeight = MIN_CROP_HEIGHT;
          newWidth = newHeight * ASPECT_RATIO;
        }
        // Clamp to container
        newWidth = Math.min(newWidth, CONTAINER_WIDTH - crop.x);
        newHeight = Math.min(newHeight, CONTAINER_HEIGHT - crop.y);

        setCrop((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
        }));
      } else if (crop.resizeCorner === "tl") {
        // Top-left: move x/y and resize width/height with aspect ratio
        let deltaX = mouseX - crop.resizeStartX;
        let newWidth = crop.startWidth - deltaX;
        let newHeight = newWidth / ASPECT_RATIO;
        let newX = crop.startX + deltaX;
        let newY = crop.startY + (crop.startHeight - newHeight);

        // Clamp width and height
        if (newWidth < MIN_CROP_WIDTH) {
          newWidth = MIN_CROP_WIDTH;
          newHeight = newWidth / ASPECT_RATIO;
          newX = crop.startX + (crop.startWidth - newWidth);
          newY = crop.startY + (crop.startHeight - newHeight);
        }
        if (newHeight < MIN_CROP_HEIGHT) {
          newHeight = MIN_CROP_HEIGHT;
          newWidth = newHeight * ASPECT_RATIO;
          newX = crop.startX + (crop.startWidth - newWidth);
          newY = crop.startY + (crop.startHeight - newHeight);
        }
        // Clamp to container
        newX = Math.max(0, Math.min(newX, crop.startX + crop.startWidth - MIN_CROP_WIDTH));
        newY = Math.max(0, Math.min(newY, crop.startY + crop.startHeight - MIN_CROP_HEIGHT));
        if (newX + newWidth > CONTAINER_WIDTH) {
          newX = CONTAINER_WIDTH - newWidth;
        }
        if (newY + newHeight > CONTAINER_HEIGHT) {
          newY = CONTAINER_HEIGHT - newHeight;
        }

        setCrop((prev) => ({
          ...prev,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        }));
      }
    } else if (crop.dragging) {
      // Dragging the crop frame
      let newX = mouseX - crop.dragStartX + crop.startX;
      let newY = mouseY - crop.dragStartY + crop.startY;
      // Clamp to container
      newX = Math.max(0, Math.min(newX, CONTAINER_WIDTH - crop.width));
      newY = Math.max(0, Math.min(newY, CONTAINER_HEIGHT - crop.height));
      setCrop((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    }
  };

  const onMouseUp = () => {
    if (crop.resizing) setCrop((prev) => ({ ...prev, resizing: false, resizeCorner: null }));
    if (crop.dragging) setCrop((prev) => ({ ...prev, dragging: false }));
  };

  // Calculate crop area in original image coordinates
  const getCropData = () => {
    const displayWidth = CONTAINER_WIDTH;
    const displayHeight = CONTAINER_HEIGHT;
    const scaleX = imgSize.width / displayWidth;
    const scaleY = imgSize.height / displayHeight;
    const offsetX = 0;
    const offsetY = 0;
    const cropX = crop.x - offsetX;
    const cropY = crop.y - offsetY;
    return {
      x: Math.max(0, Math.round(cropX * scaleX)),
      y: Math.max(0, Math.round(cropY * scaleY)),
      width: Math.round(crop.width * scaleX),
      height: Math.round(crop.height * scaleY),
    };
  };

  // Confirm crop: call backend and return preview URL
  const handleConfirm = async () => {
    if (!originalFile) return;
    setLoading(true);
    try {
      const cropData = getCropData();
      const previewUrl = await cropImage(originalFile, cropData);
      onCropConfirm(previewUrl, cropData);
    } catch (err) {
      alert("Cropping failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Attach mousemove/mouseup to window for resizing/dragging
  useEffect(() => {
    if (crop.resizing || crop.dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  });

  return (
    <div>
      <div
        ref={containerRef}
        className="relative mx-auto bg-gray-200 rounded-lg overflow-hidden select-none"
        style={{ width: `${CONTAINER_WIDTH}px`, height: `${CONTAINER_HEIGHT}px` }}
      >
        {/* Image, fixed size */}
        <img
          src={imageSrc}
          alt="To crop"
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: `${CONTAINER_WIDTH}px`,
            height: `${CONTAINER_HEIGHT}px`,
            userSelect: "none",
            pointerEvents: "none",
          }}
          draggable={false}
        />
        {/* Crop frame with two resize handles and drag */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-200/20 pointer-events-auto cursor-move"
          style={{
            left: crop.x,
            top: crop.y,
            width: crop.width,
            height: crop.height,
            boxSizing: "border-box",
          }}
          onMouseDown={onCropMouseDown}
        >
          {/* Bottom-right resize handle */}
          <div
            className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-se-resize right-0 bottom-0 translate-x-1/2 translate-y-1/2"
            onMouseDown={onResizeDown("br")}
          />
          {/* Top-left resize handle */}
          <div
            className="absolute w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize left-0 top-0 -translate-x-1/2 -translate-y-1/2"
            onMouseDown={onResizeDown("tl")}
          />
        </div>
        {/* Dark overlay outside crop frame */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top overlay */}
          <div
            className="absolute left-0 right-0 bg-black/30"
            style={{ top: 0, height: crop.y }}
          />
          {/* Bottom overlay */}
          <div
            className="absolute left-0 right-0 bg-black/30"
            style={{ top: crop.y + crop.height, bottom: 0 }}
          />
          {/* Left overlay */}
          <div
            className="absolute top-0 bottom-0 bg-black/30"
            style={{ left: 0, width: crop.x }}
          />
          {/* Right overlay */}
          <div
            className="absolute top-0 bottom-0 bg-black/30"
            style={{ left: crop.x + crop.width, right: 0 }}
          />
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="px-4 py-2 bg-blue-700 text-white rounded" onClick={handleConfirm} disabled={loading}>
          {loading ? "Cropping..." : "Crop"}
        </button>
      </div>
    </div>
  );
};

export default CropSelector;