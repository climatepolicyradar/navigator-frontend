import { useEffect } from "react";
import Loader from "./Loader";
import { TPassage } from "@types";

type TProps = {
  passages: TPassage[];
  onClick: (index: number) => void;
  activeIndex?: number;
  showPageNumbers?: boolean;
  pageColour?: string;
};

const PassageMatches = ({ passages, onClick, activeIndex, showPageNumbers = true, pageColour = "blue-500" }: TProps) => {
  return (
    <>
      {!passages ? (
        <div className="w-full flex justify-center h-96">
          <Loader />
        </div>
      ) : (
        <div className="my-4" id="passage-matches">
          {passages.map((item, index: number) => (
            <div key={item.text_block_id} data-analytics="document-passage-result" id={`passage-${index}`} className="mb-4">
              <div
                className={`p-4 cursor-pointer border border-gray-200 rounded-md bg-white hover:border-blue-300 ${
                  activeIndex === index ? "border-blue-300 bg-blue-100" : ""
                }`}
                onClick={() => {
                  onClick(index);
                }}
              >
                {showPageNumbers && (
                  <div className={`text-sm ${"text-" + pageColour}`}>
                    <span className="font-bold">Page {item.text_block_page}</span>
                  </div>
                )}
                <p className="mt-2 text-indigo-400 font-light break-words">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default PassageMatches;
