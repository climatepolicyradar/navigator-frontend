import Tooltip from "../tooltip";
import List from "./List";

type TListType = {
  name: string;
  children?: TListChild[];
};

type TListChild = {
  parent: string;
  name: string;
};

type TDoucmentInfoProps = {
  heading: string;
  text?: string;
  list?: string[];
  id?: string;
  tooltip?: string;
  bulleted?: boolean;
};

const DocumentInfo = ({ heading, text = "", list = [], id = "", tooltip = "", bulleted = false }: TDoucmentInfoProps) => {
  const dataProps = {};
  dataProps[`data-analytics-${heading}`] = "";

  return (
    <div className="mt-4">
      <h4 className="text-base text-indigo-400 font-semibold flex">
        {heading}
        {tooltip.length > 0 && (
          <div className="ml-1 font-normal">
            <Tooltip id={id} tooltip={tooltip} />
          </div>
        )}
      </h4>
      {list.length ? (
        <List list={list} bulleted={bulleted} dataProps={dataProps} />
      ) : (
        <p className="text-indigo-500" {...dataProps}>
          {text}
        </p>
      )}
    </div>
  );
};

export default DocumentInfo;
