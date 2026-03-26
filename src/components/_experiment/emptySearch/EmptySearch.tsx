export function EmptySearch() {
  return (
    <div className="w-[250px] m-auto">
      <div className="flex flex-col items-center text-center py-20">
        <h2 className="font-semibold text-inky-black">No results yet</h2>
        <p className="text-inky-black items-center">Combine filters with search terms to get precise results</p>
      </div>
    </div>
  );
}
