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
      className="text-white py-1 px-2 rounded-r-full h-full transtion duration-300 shrink-0 hover:bg-gray-100 md:px-4"
    >
      <SearchIcon height="18" width="18" color="#1F93FF" />
      {children}
    </button>
  );
};

export default SearchButton;
