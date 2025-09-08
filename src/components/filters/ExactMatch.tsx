import { ChangeEvent } from "react";

import { QUERY_PARAMS } from "@/constants/queryParams";
import useGetTheme from "@/hooks/useGetTheme";

const ExactMatch = ({ id, handleSearchChange, checked, landing = false }) => {
  const handleClick = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    handleSearchChange(QUERY_PARAMS.exact_match, isChecked);
  };

  const { theme } = useGetTheme();
  const themeClass = theme === "ccc" ? "checkbox-dark" : "checkbox-light";

  return (
    <div className={`${landing ? "landing" : ""}`}>
      <label className={`${themeClass} flex items-center cursor-pointer`} htmlFor={id}>
        <input
          className={`${landing ? "text-indigo-600/0" : "text-text-light"} ${themeClass} rounded`}
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleClick}
        />
        <span className={`${landing ? "text-lg" : "text-sm"} ${theme === "ccc" ? "text-text-primary" : "text-text-light"} pl-2 leading-none`}>
          Only show exact matches
        </span>
      </label>
    </div>
  );
};

export default ExactMatch;
