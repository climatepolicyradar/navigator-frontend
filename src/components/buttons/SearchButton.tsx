import { FC, ReactNode, useContext } from "react";
import { ThemeContext } from "@context/ThemeContext";
import { SearchIcon } from "../svg/Icons";

type TProps = {
  onClick?: () => void;
  children?: ReactNode;
};

const SearchButton: FC<TProps> = ({ onClick, children }) => {
  const theme = useContext(ThemeContext);

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  const buttonCssClass = "bg-blue-600 hover:bg-cpr-dark";

  return (
    <button
      onClick={handleOnClick}
      type="submit"
      className={`text-white py-1 px-2 md:px-4 rounded-r-lg h-full transtion duration-300 shrink-0 ${buttonCssClass}`}
    >
      <SearchIcon height="20" width="40" />
      {children}
    </button>
  );
};

export default SearchButton;
