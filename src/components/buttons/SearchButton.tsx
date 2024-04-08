import { FC, ReactNode } from "react";
import { SearchIcon } from "../svg/Icons";

type TProps = {
  onClick?: () => void;
  children?: ReactNode;
};

const SearchButton: FC<TProps> = ({ onClick, children }) => {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button
      onClick={handleOnClick}
      type="submit"
      className="text-white py-1 px-2 rounded-l-full h-full transtion duration-300 shrink-0 drop-shadow hover:bg-gray-100 md:pl-4"
      aria-label="Search"
    >
      <SearchIcon height="16" width="16" color="#475467" />
      {children}
    </button>
  );
};

export default SearchButton;
