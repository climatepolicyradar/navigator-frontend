type TProps = {
  mapZoom: number;
  minZoom: number;
  maxZoom: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleReset: () => void;
};

export const ZoomControls = ({ mapZoom, minZoom, maxZoom, handleZoomIn, handleZoomOut, handleReset }: TProps) => {
  return (
    <div className="absolute bottom-0 right-0 p-4 flex gap-2">
      <button className="text-xs bg-white text-gray-500 rounded-full border border-gray-300 h-[40px] px-4" onClick={handleReset}>
        Reset
      </button>
      <button
        className="bg-white text-gray-500 rounded-full border w-[40px] h-[40px] border-gray-300 disabled:opacity-50"
        disabled={mapZoom === maxZoom}
        onClick={handleZoomIn}
      >
        +
      </button>
      <button
        className="bg-white text-gray-500 rounded-full border w-[40px] h-[40px] border-gray-300 disabled:opacity-50"
        disabled={mapZoom === minZoom}
        onClick={handleZoomOut}
      >
        -
      </button>
    </div>
  );
};
