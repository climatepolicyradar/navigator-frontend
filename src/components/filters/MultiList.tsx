import { QUERY_PARAMS } from "@/constants/queryParams";
import { getCountryNameOld } from "@/helpers/getCountryFields";
import useConfig from "@/hooks/useConfig";

import FilterTag from "../labels/FilterTag";

interface IProps {
  list: string[];
  removeFilter: (type: string, value: string) => void;
  type: string;
  dataCy?: string;
}

const MultiList = ({ list, removeFilter, type, dataCy }: IProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery; // TODO: Update as part of APP-841

  const handleClick = (item: string) => {
    removeFilter(type, item);
  };

  return (
    <div className="flex flex-wrap mt-1" data-cy={dataCy ?? "multi-list"}>
      {list.length > 0
        ? list.map((item, index) => (
            <div key={`tag${index}`} className="mr-2 mt-1">
              <FilterTag onClick={() => handleClick(item)} item={type === QUERY_PARAMS.country ? getCountryNameOld(item, countries) : item} />
            </div>
          ))
        : null}
    </div>
  );
};

export default MultiList;
