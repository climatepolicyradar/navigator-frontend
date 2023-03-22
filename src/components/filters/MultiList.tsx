import useConfig from "@hooks/useConfig";
import FilterTag from "../buttons/FilterTag";
import { getCountryName } from "@helpers/getCountryFields";

type TProps = {
  list: string[];
  removeFilter: (type: string, value: string, action?: string) => void;
  type: string;
  dataCy?: string;
};

const MultiList = ({ list, removeFilter, type, dataCy }: TProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  const handleClick = (item: string) => {
    removeFilter(type, item, "delete");
  };

  return (
    <div className="flex flex-wrap mt-1" data-cy={dataCy ?? "multi-list"}>
      {list.length > 0
        ? list.map((item, index) => (
            <div key={`tag${index}`} className="mr-2 mt-1">
              <FilterTag onClick={() => handleClick(item)} item={type === "countries" ? getCountryName(item, countries) : item} />
            </div>
          ))
        : null}
    </div>
  );
};

export default MultiList;
