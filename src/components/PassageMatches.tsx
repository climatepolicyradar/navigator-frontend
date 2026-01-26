import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

import { TPassage } from "@/types";

import Loader from "./Loader";
import { Icon } from "./atoms/icon/Icon";

interface IProps {
  passages: TPassage[];
  onClick: (index: number) => void;
  pageColour?: string;
}

const COPY_TIMEOUT = 1000;

const PassageMatches = ({ passages, onClick, pageColour = "textDark" }: IProps) => {
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

  const posthog = usePostHog();

  return (
    <>
      {!passages ? (
        <div className="w-full flex justify-center h-96">
          <Loader />
        </div>
      ) : (
        <div className="my-5" id="passage-matches">
          {passages.map((item, index: number) => (
            <div
              key={item.text_block_id}
              data-analytics="document-passage-result"
              id={`passage-${index}`}
              className="mb-2"
              onClick={() => posthog.capture("Passage matches click", { index })}
            >
              <div
                className={`p-4 cursor-pointer border border-gray-300 rounded-md bg-white hover:border-gray-500`}
                onClick={() => {
                  onClick(item.text_block_page);
                }}
              >
                <div className={`text-sm flex justify-between ${"text-" + pageColour}`}>
                  <span className="font-medium">{item.text_block_page !== null && <>Page {item.text_block_page}</>}</span>
                  <div className={`text-blue-400 ${hasCopied === index && "text-green-700"}`} onClick={(e) => copyOnClick(e, index, item.text)}>
                    {hasCopied === index ? "Copied" : <Icon name="copy" width="16" height="16" />}
                  </div>
                </div>
                <p className="mt-2 break-words">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default PassageMatches;
