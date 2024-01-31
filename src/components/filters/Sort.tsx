import { ChangeEvent, useEffect, useState } from "react";
import { sortOptions, sortOptionsBrowse } from "@constants/sortOptions";

type TProps = {
  updateSort: (e: ChangeEvent<HTMLSelectElement>) => void;
  defaultValue: string;
  isBrowsing?: boolean;
};

const Sort = ({ updateSort, defaultValue, isBrowsing = false }: TProps) => {
  const [options, setOptions] = useState(sortOptions);
  const [defaultV, setDefault] = useState("");

  useEffect(() => {
    setOptions(isBrowsing ? sortOptionsBrowse : sortOptions);
  }, [isBrowsing]);

  useEffect(() => {
    setDefault(defaultValue);
  }, [defaultValue]);

  return (
    <div className="flex items-center" data-cy="sort">
      <select className="border border-gray-300 small ml-2 z-0" onChange={updateSort} defaultValue={defaultV} key={defaultV} aria-label="Sort">
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default Sort;
