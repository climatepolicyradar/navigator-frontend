import { useEffect, useState } from "react";
import Loader from "./Loader";
import { TPassage } from "@types";
import { CopyIcon } from "./svg/Icons";
import Button from "./buttons/Button";

type TProps = {
  passages: TPassage[];
  onClick: (index: number) => void;
  activeIndex?: number;
  pageColour?: string;
  showLoadMore?: boolean;
  loadMore?: () => void;
};

const COPY_TIMEOUT = 1000;

const PassageMatches = ({ passages, onClick, activeIndex, pageColour = "gray-700", showLoadMore, loadMore }: TProps) => {
  const [hasCopied, setHasCopied] = useState<number | null>(null);

  const copyOnClick = (e: React.MouseEvent<HTMLDivElement>, index: number, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setHasCopied(index);
  };

  useEffect(() => {
    if (hasCopied !== null) {
      setTimeout(() => {
        setHasCopied(null);
      }, COPY_TIMEOUT);
    }
  }, [hasCopied]);

  return (
    <>
      {!passages ? (
        <div className="w-full flex justify-center h-96">
          <Loader />
        </div>
      ) : (
        <div className="my-4" id="passage-matches">
          <>
            {passages.map((item, index: number) => (
              <div key={item.text_block_id} data-analytics="document-passage-result" id={`passage-${index}`} className="mb-4">
                <div
                  className={`p-4 cursor-pointer border border-gray-200 rounded-md bg-white hover:border-gray-500 ${
                    activeIndex === index ? "border-gray-50 bg-gray-50 hover:!border-gray-50" : ""
                  }`}
                  onClick={() => {
                    onClick(index);
                  }}
                >
                  <div className={`text-sm flex justify-between ${"text-" + pageColour}`}>
                    <span className="font-bold">{item.text_block_page !== null && <>Page {item.text_block_page}</>}</span>
                    <div className={`text-blue-400 ${hasCopied === index && "text-green-700"}`} onClick={(e) => copyOnClick(e, index, item.text)}>
                      {hasCopied === index ? "Copied" : <CopyIcon width="16" height="16" />}
                    </div>
                  </div>
                  <p className="mt-2 text-indigo-400 font-light break-words">{item.text}</p>
                </div>
              </div>
            ))}
            {showLoadMore && loadMore && (
              <div className="flex justify-center">
                <Button onClick={loadMore}>Load more passages</Button>
              </div>
            )}
          </>
        </div>
      )}
    </>
  );
};
export default PassageMatches;
