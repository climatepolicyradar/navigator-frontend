import { useEffect, useState } from "react";
import { getEnvFromServer } from "@api/http-common";
import { hasMcfAccess } from "@utils/checkCorpusAccess";

export const Legend = ({ max }: { max: number }) => {
  const [showMcf, setShowMcf] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data } = await getEnvFromServer();
      setShowMcf(hasMcfAccess(data?.env?.app_token));
    };
    checkAccess();
  }, []);

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
        Size and colour show the number of laws, policies{showMcf ? ", MCF projects" : ""} or international agreements submission in our databases.
      </p>
    </div>
  );
};
