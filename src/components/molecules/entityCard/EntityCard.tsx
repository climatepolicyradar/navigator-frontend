import { PageLink } from "@/components/atoms/pageLink/PageLink";

export interface IProps {
  href: string;
  metadata: string[];
  title: string;
}

export const EntityCard = ({ href, metadata, title }: IProps) => (
  <PageLink keepQuery href={href} className="inline-block w-51 h-67 shrink-0 border-t-2 border-t-surface-brand-darker">
    <div className="flex flex-col justify-between gap-5 h-full p-5 border border-border-light border-t-0">
      <div className=" text-text-brand-darker font-semibold leading-tight line-clamp-7">{title}</div>
      <ul className="flex flex-col gap-1.5 text-[13px] text-text-tertiary leading-tight">
        {metadata.map((line, lineIndex) => (
          <li key={lineIndex} className="overflow-hidden whitespace-nowrap text-ellipsis">
            {line}
          </li>
        ))}
      </ul>
    </div>
  </PageLink>
);
