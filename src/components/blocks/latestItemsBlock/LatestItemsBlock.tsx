import { LinkWithQuery } from "@/components/LinkWithQuery";
import { TLatestItem } from "@/types";
import { formatDate } from "@/utils/timedate";

interface IProps {
  latestItems: TLatestItem[];
}

export const LatestItemsBlock = ({ latestItems }: IProps) => {
  return (
    <aside aria-labelledby="latest" className="bg-surface-heavy p-5 flex flex-col space-y-4 text-text-primary h-full">
      <h2 id="latest" className="font-bold border-b border-border-semi-transparent pb-4">
        Latest
      </h2>

      <ol className="flex-1 overflow-auto list-none space-y-4">
        {latestItems.map((item) => {
          const [year, day, month] = formatDate(item.date);
          return (
            <li key={item.url} className="border-b border-border-semi-transparent pb-4">
              <p className="text-sm text-text-tertiary">
                {day} {month} {year}
              </p>
              <LinkWithQuery href={item.url} className="block font-bold">
                {item.title}
              </LinkWithQuery>
            </li>
          );
        })}
      </ol>

      <LinkWithQuery href="/search" className="block font-semi-bold">
        View all cases →
      </LinkWithQuery>
    </aside>
  );
};
