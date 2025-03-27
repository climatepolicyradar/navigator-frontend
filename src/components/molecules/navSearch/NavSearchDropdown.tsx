import { useEffect, useRef, useState } from "react";
import { LuChevronsUpDown } from "react-icons/lu";

interface NavSearchDropdownProps {
  contextualSearchName: string;
  isEverything: boolean;
  setIsEverything: (newValue: boolean) => void;
}

type DropdownOption = {
  name: string;
  newIsEverythingValue: boolean;
};

export const NavSearchDropdown = ({ contextualSearchName, isEverything, setIsEverything }: NavSearchDropdownProps) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleFocusOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleTab = (event: KeyboardEvent) => {
      if (event.key === "Tab" && ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleFocusOutside, true);
    document.addEventListener("keyup", handleTab, true);

    return () => {
      document.removeEventListener("click", handleFocusOutside, true);
      document.removeEventListener("keyup", handleTab, true);
    };
  }, [ref]);

  // Show the other option below the currently selected one
  const dropdownOptions: DropdownOption[] = [
    {
      name: "Everything",
      newIsEverythingValue: true,
    },
    {
      name: contextualSearchName,
      newIsEverythingValue: false,
    },
  ];
  if (!isEverything) dropdownOptions.reverse();
  const [firstOption, secondOption] = dropdownOptions;

  const handleClick = (newValue: boolean) => {
    setIsOpen((current) => !current);
    if (isOpen) setIsEverything(newValue);
  };

  const optionClasses = "h-full w-full flex items-center justify-between gap-2 pl-3 pr-3 bg-surface-ui text-sm leading-4 text-nowrap cursor-pointer";

  return (
    <div ref={ref} className="border-l border-l-border-light">
      <button
        type="button"
        onClick={() => handleClick(firstOption.newIsEverythingValue)}
        className={`${optionClasses} ${isOpen ? "rounded-tr-md" : "rounded-r-md"}`}
      >
        {firstOption.name}
        <div className={isOpen ? "invisible" : ""}>
          <LuChevronsUpDown height="12" width="12" />
        </div>
      </button>
      <button
        type="button"
        onClick={() => handleClick(secondOption.newIsEverythingValue)}
        className={`${optionClasses} ${isOpen ? "" : "invisible"} rounded-b-md`}
      >
        {secondOption.name}
      </button>
    </div>
  );
};
