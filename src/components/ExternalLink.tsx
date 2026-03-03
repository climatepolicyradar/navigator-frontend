import { FC, ReactNode } from "react";

interface IProps {
  url: string;
  className?: string;
  children?: ReactNode;
  cy?: string;
}

export const ExternalLink: FC<IProps> = ({ url, className, children, cy, ...props }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className} data-cy={cy} {...props}>
      {children}
    </a>
  );
};
