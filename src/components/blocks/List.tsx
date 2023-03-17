type TProps = {
  list: string[];
  bulleted?: boolean;
};

const List = ({ list, bulleted = false }: TProps) => {
  return (
    <ul className={`text-indigo-500 ${bulleted ? "ml-4 list-disc list-outside mb-4" : ""}`}>
      {list.map((item, index) => (
        <li key={`listitem-${index}-${item}`} className={bulleted ? "" : "inline"}>
          {
            <>
              {index > 0 && !bulleted && ", "} {item}
            </>
          }
        </li>
      ))}
    </ul>
  );
};
export default List;
