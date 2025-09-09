import { LinkWithQuery } from "@/components/LinkWithQuery";
import { TLatestItem } from "@/types";
import { formatDate } from "@/utils/timedate";

export interface IProps {
  latestItems: TLatestItem[];
}

export const LatestItemsBlock = ({ latestItems: latestItems }: IProps) => {
  const ITEM_LIMIT = 3;
  const limitedLastItems = latestItems.slice(0, ITEM_LIMIT);

  return (
    <aside aria-labelledby="latest" className="w-[321px] h-[520px] bg-[#E8EBED] p-4 shadow flex flex-col">
      <h2 id="latest" className="text-m font-bold text-text-primary mb-4 border-b border-gray-300 pb-4">
        Latest
      </h2>

      <div className="flex-1 overflow-auto">
        <ol className="list-none space-y-4 min-w-0">
          {limitedLastItems.map((item) => {
            const [year, day, month] = formatDate(item.date);
            return (
              <li key={item.slug} className="border-b border-gray-300 pb-4 min-w-0">
                <p className="text-sm text-text-primary opacity-60">
                  {day} {month} {year}
                </p>
                <LinkWithQuery href={item.url} className="block w-full break-words text-m font-bold text-text-primary">
                  {item.title}
                </LinkWithQuery>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="pt-4">
        <LinkWithQuery href="/search" className="block text-m font-semi-bold text-text-primary">
          View all cases →
        </LinkWithQuery>
      </div>
    </aside>
  );
};
