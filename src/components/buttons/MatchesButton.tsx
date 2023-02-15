type TProps = {
  dataAttribute: string;
  count: number | string;
  overideText?: string;
};

const MatchesButton = ({ dataAttribute, count, overideText }: TProps) => {
  const numberOfMatches = typeof count === "number" ? count : parseInt(count, 10);

  return (
    <button
      data-slug={dataAttribute}
      className="matches-button mt-2 lg:mt-0 py-1 px-4 bg-blue-600 text-white text-sm font-medium transition duration-300 rounded hover:bg-indigo-600"
    >
      {overideText ? overideText : `${numberOfMatches} match${numberOfMatches > 1 ? "es" : ""} in document`}
    </button>
  );
};

export default MatchesButton;
