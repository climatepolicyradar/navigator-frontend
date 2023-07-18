import { MAX_PASSAGE_LENGTH } from "@constants/document";
import Loader from "./Loader";
import { truncateString } from "@helpers/index";
import { TPassage } from "@types";

type TProps = {
  passages: TPassage[];
  onClick: (index: number) => void;
  activeIndex?: number;
  showPageNumbers?: boolean;
};

const PassageMatches = ({ passages, onClick, activeIndex, showPageNumbers = true }: TProps) => {
  return (
    <>
      {!passages ? (
        <div className="w-full flex justify-center h-96">
          <Loader />
        </div>
      ) : (
        <div className="my-4" id="passage-matches">
          {passages.map((item, index: number) => (
            <div key={item.text_block_id} data-analytics-passage={index + 1} id={`passage-${index}`} className="mb-4">
              <div
                className={`p-4 cursor-pointer border border-white rounded-md bg-white hover:border-blue-300 ${
                  activeIndex === index ? "border-blue-300 bg-blue-100" : ""
                }`}
                onClick={() => {
                  onClick(index);
                }}
              >
                {showPageNumbers && (
                  <div className="text-sm text-blue-500">
                    <span className="font-bold">Page {item.text_block_page}</span>
                  </div>
                )}
                <p className="mt-2 text-indigo-400 font-light">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default PassageMatches;
