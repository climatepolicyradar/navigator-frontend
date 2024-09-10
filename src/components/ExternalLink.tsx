import { FC, ReactNode } from "react";

type TProps = {
  url: string;
  className?: string;
  children?: ReactNode;
  cy?: string;
};

export const ExternalLink: FC<TProps> = ({ url, className, children, cy }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className} data-cy={cy}>
      {children}
    </a>
  );
};
