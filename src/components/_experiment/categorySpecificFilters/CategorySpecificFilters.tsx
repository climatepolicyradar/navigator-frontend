import { TSearchLabel } from "./filterData.stub";

interface IProps {
  labels: TSearchLabel[];
}

export const CategorySpecificFilters = ({ labels }: IProps) => (
  <div className="col-start-1 -col-end-1">
    {labels.map((label, labelIndex) => (
      <p key={labelIndex}>{label.value}</p>
    ))}
  </div>
);
