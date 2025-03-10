import { useEffect, useState } from "react";

import { Search2Icon } from "@/components/svg/Icons";
import { sortData } from "@/utils/sorting";

import { TextInput } from "./TextInput";
import SuggestList from "../filters/SuggestList";

type TProps = {
  list: Object[];
  selectedList: string[];
  keyField: string;
  keyFieldDisplay?: string;
  filterType: string;
  handleFilterChange(filterType: string, value: string): void;
};

export const TypeAhead = ({ list, selectedList, keyField, keyFieldDisplay, filterType, handleFilterChange }: TProps) => {
  const [input, setInput] = useState("");
  const [suggestList, setSuggestList] = useState<Object[]>([]);

  const handleChange = (value: string): void => {
    setInput(value);
  };

  useEffect(() => {
    if (!input.length) {
      setSuggestList([]);
      return;
    }
    const filteredList = list?.filter((item) => {
      /* Make sure item hasn't already been selected and limit list to 20 items */
      return item[keyFieldDisplay ?? keyField].toLowerCase().indexOf(input.toLowerCase()) > -1 && selectedList.indexOf(item[keyField]) === -1;
    });
    setSuggestList(sortData(filteredList, keyField));
  }, [input, keyField, keyFieldDisplay, list, selectedList]);

  return (
    <div className="relative">
      <TextInput
        className={
          suggestList.length
            ? "!rounded-t-xl !border-b-transparent !rounded-b-none !outline-none !ring-0 hover:!border-borderNormal focus:!border-borderNormal !bg-white"
            : ""
        }
        onChange={handleChange}
        value={input}
        placeholder="Start typing..."
        aria-label="Search for a jurisdiction"
        name="jurisdiction-search"
      >
        <Search2Icon width="16" height="16" />
      </TextInput>
      {suggestList.length > 0 && (
        <div className="absolute top-full left-0 w-full z-30 mt-[-1px]">
          <SuggestList
            list={suggestList}
            setList={setSuggestList}
            keyField={keyField}
            keyFieldDisplay={keyFieldDisplay}
            type={filterType}
            setInput={setInput}
            handleFilterChange={handleFilterChange}
          />
        </div>
      )}
    </div>
  );
};
