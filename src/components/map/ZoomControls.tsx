interface IProps {
  mapZoom: number;
  minZoom: number;
  maxZoom: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleReset: () => void;
}

export const ZoomControls = ({ mapZoom, minZoom, maxZoom, handleZoomIn, handleZoomOut, handleReset }: IProps) => {
  return (
    <div className="absolute bottom-0 right-0 p-4 flex gap-2">
      <button className="text-xs bg-white text-[#6b7280] rounded-full border border-[#d1d5db] h-[40px] px-4" onClick={handleReset}>
        Reset
      </button>
      <button
        className="bg-white text-[#6b7280] rounded-full border w-[40px] h-[40px] border-[#d1d5db] disabled:opacity-50"
        disabled={mapZoom === maxZoom}
        onClick={handleZoomIn}
      >
        +
      </button>
      <button
        className="bg-white text-[#6b7280] rounded-full border w-[40px] h-[40px] border-[#d1d5db] disabled:opacity-50"
        disabled={mapZoom === minZoom}
        onClick={handleZoomOut}
      >
        -
      </button>
    </div>
  );
};
