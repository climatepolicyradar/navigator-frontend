import Button from "./Button";

type TProps = {
  dataAttribute: string;
  count: number | string;
  variant?: "ghost" | "secondary" | "clear" | "light";
  overideText?: string | JSX.Element;
};

const MatchesButton = ({ dataAttribute, count, overideText, variant = "light" }: TProps) => {
  const numberOfMatches = typeof count === "number" ? count : parseInt(count, 10);

  return (
    <Button
      data-cy="document-matches-button"
      data-analytics="document-matches-button"
      extraClasses="text-sm"
      data-slug={dataAttribute}
      color={variant}
    >
      {overideText ? overideText : `View ${numberOfMatches} match${numberOfMatches > 1 ? "es" : ""} in document`}
    </Button>
  );
};

export default MatchesButton;
