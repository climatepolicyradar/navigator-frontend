interface IProps {
  onClick(): void;
  item: string;
}

const FilterTag = ({ onClick, item }: IProps) => {
  return (
    <div className="rounded bg-cpr-dark text-white flex items-center py-1 px-2">
      <div className="text-xs">{item}</div>
      <button onClick={onClick} className="ml-2 text-lg leading-none">
        &times;
      </button>
    </div>
  );
};
export default FilterTag;
