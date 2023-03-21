import { TPassage } from "@types";
import Loader from "./Loader";

type TProps = {
  passages: TPassage[];
  setPassageIndex: (index: number) => void;
  activeIndex?: number;
};

const PassageMatches = ({ passages, setPassageIndex, activeIndex }: TProps) => {
  return (
    <>
      {!passages ? (
        <div className="w-full flex justify-center h-96">
          <Loader />
        </div>
      ) : (
        <div className="divide-lineBorder divide-y passage-matches-list">
          {passages.map((item, index: number) => (
            <div key={item.text_block_id} data-analytics-passage={index + 1}>
              <div
                className={`p-4 cursor-pointer border-x hover:bg-offwhite ${
                  activeIndex === index ? "border-lineBorder bg-grey-200" : "border-transparent"
                }`}
                onClick={() => {
                  setPassageIndex(index);
                }}
              >
                <div className="text-s text-blue-500">
                  <span className="font-bold">Page {item.text_block_page} | &nbsp;</span>
                  <span>go to page &gt;</span>
                </div>
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
