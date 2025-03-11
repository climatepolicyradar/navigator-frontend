import { useEffect, useState } from "react";
import SuggestList from "@/components/filters/SuggestList";
import { sortData } from "@utils/sorting";
import { Icon } from "@/components/atoms/icon/Icon";

interface ByTextInputProps {
  title: string;
  list: { [key: string]: {} };
  keyField: string;
  keyFieldDisplay?: string;
  filterType: string;
  handleFilterChange(filterType: string, value: string): void;
}

const GeographySelect = ({ title, list, keyField, keyFieldDisplay, filterType, handleFilterChange }: ByTextInputProps) => {
  const [input, setInput] = useState("");
  const [suggestList, setSuggestList] = useState([]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setInput(e.currentTarget.value);
  };

  useEffect(() => {
    if (!input.length) {
      setSuggestList([]);
      return;
    }
    let filteredList = [];
    filteredList = Object.values(list).filter((item) => {
      return item[keyFieldDisplay ?? keyField].toLowerCase().indexOf(input.toLowerCase()) > -1;
    });
    setSuggestList(sortData(filteredList, keyFieldDisplay));
  }, [input, keyField, keyFieldDisplay, list]);

  return (
    <div className="relative">
      <div className={`bg-white relative z-20 ${suggestList.length > 0 ? "rounded-b-none rounded-t-lg" : "rounded-full"}`}>
        <div className="absolute p-[1px] pr-0 top-0 left-0 h-full flex items-center justify-start z-20">
          <div
            className={`text-white py-1 px-2 pl-4 h-full transtion duration-300 shrink-0 drop-shadow flex items-center hover:bg-gray-100 ${
              suggestList.length > 0 ? "rounded-tl-lg" : "rounded-l-full"
            }`}
          >
            <Icon name="search" height="16" width="16" color="#475467" />
          </div>
        </div>
        <input
          data-analytics="map-searchInput"
          data-cy="map-input"
          className={`w-full bg-white appearance-none py-2 pl-12 pr-2 z-10 leading-snug relative flex-grow border-gray-300 placeholder:text-grey-300 ${
            suggestList.length > 0 ? "rounded-b-none rounded-t-lg" : "rounded-full"
          }`}
          type="search"
          placeholder={title}
          value={input}
          onChange={handleChange}
          aria-label="Search for a country or territory"
          name="Country Search"
        />
      </div>

      {suggestList.length > 0 && (
        <div className="absolute top-full mt-[-5px] left-0 w-full z-30">
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
export default GeographySelect;
