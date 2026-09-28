// The most generic label type
export type TLabel = {
  id: string;
  type: string;
  value: string;
  children?: TLabel[];
};
