import { ChangeEvent, useContext } from "react";

import { QUERY_PARAMS } from "@/constants/queryParams";
import { ThemeContext } from "@/context/ThemeContext";

const ExactMatch = ({ id, handleSearchChange, checked, landing = false }) => {
  const handleClick = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    handleSearchChange(QUERY_PARAMS.exact_match, isChecked);
  };

  // Landing: CCC=dark, others=light. Non-landing: always dark
  const { theme } = useContext(ThemeContext);
  const checkboxClass = landing ? (theme === "ccc" ? "checkbox-dark" : "checkbox-light") : "checkbox-dark";
  const textClass = landing ? (theme === "ccc" ? "text-text-primary" : "text-white") : "text-text-primary";

  return (
    <div className={landing ? "landing" : ""}>
      <label className={`${checkboxClass} flex items-center cursor-pointer`} htmlFor={id}>
        <input className={`${checkboxClass} rounded`} id={id} type="checkbox" checked={checked} onChange={handleClick} />
        <span className={`${landing ? "text-lg" : "text-sm"} ${textClass} pl-2 leading-none`}>Only show exact matches</span>
      </label>
    </div>
  );
};

export default ExactMatch;
