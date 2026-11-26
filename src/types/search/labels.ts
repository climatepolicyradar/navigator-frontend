export type TFilterPathLabel = {
  id: string;
  type: string;
  value: string;
  alternative_labels?: string[];
};

export type TNestedSearchLabel = TFilterPathLabel & {
  children: TNestedSearchLabel[];
  parentPath?: TFilterPathLabel[];
  count?: number;
  description?: string;
};
