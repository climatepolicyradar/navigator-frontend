type TProps = {
  dataAttribute: string;
  count: number | string;
  overideText?: string | JSX.Element;
  familyMatches?: number;
};

const formatMatches = (count: number, familyMatches?: number) => {
  if (familyMatches >= 500) {
    return "more than " + count;
  }
  return count;
};

const MatchesButton = ({ dataAttribute, count, overideText, familyMatches }: TProps) => {
  const numberOfMatches = typeof count === "number" ? count : parseInt(count, 10);

  if (!numberOfMatches && !overideText) return null;

  return (
    <span
      data-cy="document-matches-button"
      data-analytics="document-matches-button"
      data-slug={dataAttribute}
      className="text-sm text-blue-400 shrink-0"
    >
      {overideText ? overideText : `View ${formatMatches(numberOfMatches, familyMatches)} match${numberOfMatches > 1 ? "es" : ""}`}
    </span>
  );
};

export default MatchesButton;
