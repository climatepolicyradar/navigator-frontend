// Adds styling to the first case-insensitive match in the given text
export const addSubStringHighlights = (text: string, match: string, className: string) => {
  if (!text.toLowerCase().includes(match.toLowerCase())) return text;

  const matchIndex = text.toLowerCase().indexOf(match.toLowerCase());
  const beforeMatch = text.slice(0, matchIndex);
  const matchText = text.slice(matchIndex, matchIndex + match.length);
  const afterMatch = text.slice(matchIndex + match.length);

  return (
    <>
      {beforeMatch.length > 0 && beforeMatch}
      <span className={className}>{matchText}</span>
      {afterMatch.length > 0 && afterMatch}
    </>
  );
};
