import { DownChevronIcon } from "../svg/Icons";

interface FilterToggleProps {
  toggle(): void;
  isOpen: boolean;
}

const FilterToggle = ({ toggle, isOpen }: FilterToggleProps) => {
  return (
    <button onClick={toggle} className="text-sm flex items-center bg-blue-500 mt-2 text-white flex-nowrap rounded-md px-4 py-2 md:hidden">
      <span>{isOpen ? "Hide" : "Show"} filters</span>{" "}
      <div className={`ml-2 ${isOpen && "rotate-180"}`}>
        <DownChevronIcon />
      </div>
    </button>
  );
};
export default FilterToggle;
