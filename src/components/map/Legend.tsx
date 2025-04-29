type TLegendProps = {
  max: number;
  showLitigation: boolean;
  showMcf: boolean;
};

export const Legend = ({ max, showLitigation, showMcf }: TLegendProps) => {
  const scale = [1, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];

  return (
    <div className="border border-gray-300 border-t-0 p-4 flex gap-4 items-baseline text-gray-700">
      <div className="map-circles">
        <div className="scale-item">
          <div className="circle"></div>
          <p>{scale[0]}</p>
        </div>
        <div className="scale-item">
          <div className="circle"></div>
          <p>{scale[1]}</p>
        </div>
        <div className="scale-item">
          <div className="circle"></div>
          <p>{scale[2]}</p>
        </div>

        <div className="scale-item">
          <div className="circle"></div>
          <p>{scale[3]}</p>
        </div>

        <div className="scale-item">
          <div className="circle"></div>
          <p>{scale[4]}</p>
        </div>
      </div>
      <p>
        Size and colour show the number of laws, policies, reports{showLitigation ? ", litigation" : ""}
        {showMcf ? ", MCF projects" : ""} or UNFCCC submissions in our databases.
      </p>
    </div>
  );
};
