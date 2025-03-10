import { useMcfData } from "@/hooks/useMcfData";

export const Legend = ({ max }: { max: number }) => {
  const showMcf = useMcfData();

  const scale = [1, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];

  return (
    <div className="border border-t-0 p-4 flex gap-4 items-baseline text-gray-700">
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
        Size and colour show the number of laws, policies
        {showMcf ? ", MCF projects" : ""} or UNFCCC submissions in our databases.
      </p>
    </div>
  );
};
