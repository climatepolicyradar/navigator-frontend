interface PaginationProps {
  pageNumber: number;
  pageCount: number;
  onChange(page: number): void;
  maxNeighbourDistance?: number;
}

const Pagination = ({ pageNumber, pageCount, onChange, maxNeighbourDistance = 2 }: PaginationProps) => {
  const renderPlaceholder = (page: number) => {
    return (
      <span key={page} className="md:mx-1">
        ...
      </span>
    );
  };
  const renderPageButton = (page: number) => {
    const baseCssClasses = "mx-1 rounded px-3 py-1 transition duration-300 text-sm md:text-base";
    const colorCssClasses = page === pageNumber ? "bg-blue-400 text-white pointer-events-none" : "hover:bg-gray-100 text-cpr-dark";
    return (
      <button
        key={page}
        value={page}
        type="button"
        className={`${baseCssClasses} ${colorCssClasses}`}
        onClick={() => {
          onChange(page);
        }}
      >
        {page}
      </button>
    );
  };

  return (
    <div className="pagination w-full flex justify-center mt-6">
      {new Array(pageCount).fill(0).map((item, itemIndex) => {
        const page = itemIndex + 1;
        if (page === 1 || page === pageCount || (page >= pageNumber - maxNeighbourDistance && page <= pageNumber + maxNeighbourDistance)) {
          return renderPageButton(page);
        }
        if (page === 2 || page === pageCount - 1) {
          return renderPlaceholder(page);
        }
      })}
    </div>
  );
};

export default Pagination;
