import { FileSearchCorner } from "lucide-react";

interface IProps {
  hasQueryString: boolean;
}

export const EmptyPassages = ({ hasQueryString }: IProps) => (
  <div className="flex flex-col gap-4 flex-1 pt-10 text-center text-[#374151] px-4">
    <div className="text-blue-800 flex justify-center items-center">
      <div className="rounded-full bg-blue-50 p-6 mb-2">
        <FileSearchCorner width="48" height="48" />
      </div>
    </div>
    <p className="text-xl font-medium">No {hasQueryString ? "results" : "searches yet"}</p>
    {hasQueryString && <p>No results found for this search. Please try again.</p>}
    {!hasQueryString && (
      <>
        <p>We'll search for the meaning of your phrase. You'll see exact matches and related phrases highlighted in the text.</p>
        <p>For example, a search for 'electric cars' will also show results for 'electric vehicles' and 'EVs'.</p>
      </>
    )}
  </div>
);
