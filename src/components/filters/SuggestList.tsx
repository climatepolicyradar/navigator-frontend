import { useEffect, useRef, useCallback, useState } from "react";

import { addClass, removeClass } from "@/utils/cssClass";

interface SuggestListItem {
  [key: string]: string;
}

interface SuggestListProps {
  list: SuggestListItem[];
  setList: React.Dispatch<React.SetStateAction<SuggestListItem[]>>;
  keyField: string;
  keyFieldDisplay?: string;
  type: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleFilterChange: (type: string, value: string) => void;
}

const SuggestList: React.FC<SuggestListProps> = ({ list, setList, keyField, keyFieldDisplay, type, setInput, handleFilterChange }) => {
  const [liSelected, setLiSelected] = useState<HTMLLIElement | null>(null);
  const [index, setIndex] = useState(-1);
  const ulRef = useRef<HTMLUListElement>(null);

  const handleClick = (item: SuggestListItem): void => {
    handleFilterChange(type, item[keyField]);
    setList([]);
    setInput("");
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!ulRef.current) return;

      const ulElement = ulRef.current;
      const liElements = ulElement.getElementsByTagName("li");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (liSelected) {
          removeClass(liSelected, "selected");
        }
        const newIndex = index + 1 >= liElements.length ? 0 : index + 1;
        const newLiSelected = liElements[newIndex];
        addClass(newLiSelected, "selected");
        setLiSelected(newLiSelected);
        setIndex(newIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (liSelected) {
          removeClass(liSelected, "selected");
        }
        const newIndex = index - 1 < 0 ? liElements.length - 1 : index - 1;
        const newLiSelected = liElements[newIndex];
        addClass(newLiSelected, "selected");
        setLiSelected(newLiSelected);
        setIndex(newIndex);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (liSelected) {
          liSelected.click();
        }
      }
    },
    [index, liSelected]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <ul ref={ulRef} className="bg-white rounded-b-xl border border-borderNormal border-t-0 m-0">
      {list.map(
        (item: SuggestListItem, idx: number) =>
          idx < 10 && (
            <li
              key={idx}
              onClick={() => {
                handleClick(item);
              }}
              className="cursor-pointer p-2 hover:text-textDark hover:font-medium hover:bg-blue-100 last:rounded-b-xl"
            >
              {item[keyFieldDisplay ?? keyField]}
            </li>
          )
      )}
    </ul>
  );
};

export default SuggestList;
