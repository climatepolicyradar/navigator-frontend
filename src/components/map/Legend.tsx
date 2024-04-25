export const Legend = ({ max }: { max: number }) => {
  const scale = [1, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];

  return (
    <div className="border border-t-0 p-4 flex gap-6 items-baseline">
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
      <p className="mb-2">The size and colour of the circles indicate the number of laws and policies or UNFCCC submissions in our knowledge base</p>
    </div>
  );
};
