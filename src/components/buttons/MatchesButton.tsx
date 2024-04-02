type TProps = {
  dataAttribute: string;
  count: number | string;
  overideText?: string | JSX.Element;
};

const MatchesButton = ({ dataAttribute, count, overideText }: TProps) => {
  const numberOfMatches = typeof count === "number" ? count : parseInt(count, 10);

  if (!numberOfMatches && !overideText) return null;

  return (
    <span data-cy="document-matches-button" data-analytics="document-matches-button" data-slug={dataAttribute} className="text-sm text-blue-400 shrink-0">
      {overideText
        ? overideText
        : `View ${numberOfMatches > 10 ? 10 : numberOfMatches}${numberOfMatches > 10 ? "+" : ""} match${numberOfMatches > 1 ? "es" : ""}`}
    </span>
  );
};

export default MatchesButton;
