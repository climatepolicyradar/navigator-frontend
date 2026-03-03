export function AppliedLabels({
  query,
  labels,
  onSelectLabel,
  setQuery,
}: {
  query: string;
  labels: string[];
  onSelectLabel?: (label: string) => void;
  setQuery?: (query: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {query && (
        <button className="text-sm bg-gray-100 rounded p-2 flex items-center gap-1 hover:bg-gray-200" onClick={() => setQuery("")}>
          <span>Anything matching "{query}"</span>
          <span>&times;</span>
        </button>
      )}
      {labels.map((label, i) => (
        <button key={i} className="text-sm bg-gray-100 rounded p-2 flex items-center gap-1 hover:bg-gray-200" onClick={() => onSelectLabel?.(label)}>
          <span key={i} className="">
            {labels.length > 1 ? `or: ` : ""}
            {label}
          </span>
          <span>&times;</span>
        </button>
      ))}
    </div>
  );
}
