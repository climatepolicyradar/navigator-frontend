import { useEffect, useState } from "react";

import { TPassage } from "@/types";

import Loader from "./Loader";
import { Icon } from "./atoms/icon/Icon";

interface IProps {
  passages: TPassage[];
  onClick: (index: number) => void;
  pageColour?: string;
  position?: number;
  positionOffset?: number;
}

const COPY_TIMEOUT = 1000;

const PassageMatches = ({ passages, onClick, pageColour = "textDark", position, positionOffset }: IProps) => {
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

  const onButtonClick = (item: TPassage) => {
    onClick(item.text_block_page);
  };

  const hasPosition = typeof position === "number" && typeof positionOffset === "number";

  return (
    <>
      {!passages ? (
        <div className="w-full flex justify-center h-96">
          <Loader />
        </div>
      ) : (
        <ul className="my-5" id="passage-matches" aria-label="Passage matches">
          {passages.map((item, index: number) => (
            <li key={item.text_block_id} data-analytics="document-passage-result" id={`passage-${index}`} className="mb-2 hide-in-percy">
              <button
                type="button"
                className={`w-full p-4 cursor-pointer border border-gray-300 rounded-md bg-white hover:border-gray-500`}
                onClick={() => onButtonClick(item)}
                data-ph-capture-attribute-position-page={hasPosition ? position : undefined}
                data-ph-capture-attribute-position-total={hasPosition ? positionOffset + position : undefined}
                data-ph-capture-attribute-button-purpose="search-result-family-passage"
              >
                <div className={`text-sm flex justify-between ${"text-" + pageColour}`}>
                  <span className="font-medium">{item.text_block_page !== null && <>Page {item.text_block_page}</>}</span>
                  <div className={`text-blue-400 ${hasCopied === index && "text-green-700"}`} onClick={(e) => copyOnClick(e, index, item.text)}>
                    {hasCopied === index ? "Copied" : <Icon name="copy" width="16" height="16" />}
                  </div>
                </div>
                <p className="mt-2 text-left wrap-break-word">{item.text}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
export default PassageMatches;
