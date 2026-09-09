import { ReactNode } from "react";

export type TFAQ = {
  id?: string;
  title: string;
  content: ReactNode;
  headContent?: ReactNode;
};
