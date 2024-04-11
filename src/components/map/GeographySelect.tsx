import { useEffect, useState } from "react";
import SuggestList from "@components/filters/SuggestList";
import { sortData } from "@utils/sorting";

interface ByTextInputProps {
  title: string;
  list: { [key: string]: {} };
  selectedList: string[];
  keyField: string;
  keyFieldDisplay?: string;
  filterType: string;
  handleFilterChange(filterType: string, value: string): void;
}

const GeographySelect = ({ title, list, selectedList, keyField, keyFieldDisplay, filterType, handleFilterChange }: ByTextInputProps) => {
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
      /* Make sure item hasn't already been selected and limit list to 20 items */
      return item[keyFieldDisplay ?? keyField].toLowerCase().indexOf(input.toLowerCase()) > -1 && selectedList.indexOf(item[keyField]) === -1;
    });
    setSuggestList(sortData(filteredList, keyFieldDisplay));
  }, [input, keyField, keyFieldDisplay, list, selectedList]);

  return (
    <div className="relative">
      <input
        type="text"
        className="border border-gray-300 small outline-none placeholder:text-gray-300"
        placeholder={title}
        value={input}
        onChange={handleChange}
        aria-label="Search for a country or territory"
      />

      {suggestList.length > 0 && (
        <div className="absolute top-full mt-[-10px] left-0 w-full z-30">
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
