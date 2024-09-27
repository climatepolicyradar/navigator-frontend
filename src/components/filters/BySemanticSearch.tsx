import { ChangeEvent } from "react";
import { QUERY_PARAMS } from "@constants/queryParams";

const BySemanticSearch = ({ handleSearchChange, checked }) => {
  const handleClick = (e: ChangeEvent<HTMLInputElement>) => {
    // Note: the value of the radio is a string, not a boolean
    const isExact = !!parseInt(e.target.value);
    handleSearchChange(QUERY_PARAMS.exact_match, isExact);
  };

  return (
    <div className="flex flex-wrap gap-2 md:flex-col">
      <div>
        <label
          className="checkbox-input flex items-center border py-2 px-1 rounded-md cursor-pointer border-gray-300 bg-white"
          htmlFor="related_phrases"
        >
          <input
            className="border-gray-300 cursor-pointer"
            id="related_phrases"
            type="radio"
            name="exact_match"
            value={0}
            checked={!checked}
            onChange={handleClick}
          />
          <span className="px-2 text-sm">Related phrases</span>
        </label>
      </div>
      <div>
        <label className="checkbox-input flex items-center border py-2 px-1 rounded-md cursor-pointer border-gray-300 bg-white" htmlFor="exact_match">
          <input
            className="border-gray-300 cursor-pointer"
            id="exact_match"
            type="radio"
            name="exact_match"
            value={1}
            checked={!!checked}
            onChange={handleClick}
          />
          <span className="px-2 text-sm">Exact phrases only</span>
        </label>
      </div>
    </div>
  );
};

export default BySemanticSearch;
