type TProps = {
  pageNumber: number;
  ct: string;
  offSet: number;
  isCurrentPage: boolean;
  clickHandler(ct: string, offSet: number): void;
};

export const PageButton = ({ pageNumber, ct, offSet, isCurrentPage, clickHandler }: TProps) => {
  const baseCssClasses = "rounded px-3 py-1 transition duration-300 text-sm md:text-base";
  const colorCssClasses = isCurrentPage ? "bg-blue-400 text-white pointer-events-none" : "hover:bg-gray-100";
  return (
    <button
      key={pageNumber}
      value={pageNumber}
      type="button"
      className={`${baseCssClasses} ${colorCssClasses}`}
      onClick={() => {
        clickHandler(ct, offSet);
      }}
      data-ct={ct}
      data-offset={offSet}
    >
      {pageNumber}
    </button>
  );
};
