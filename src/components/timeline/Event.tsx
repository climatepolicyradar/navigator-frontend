import { TEvent } from "@/types";
import { convertDate } from "@/utils/timedate";

interface IProps {
  event: TEvent;
  last: boolean;
  index: number;
}

export const Event = ({ event, last, index }: IProps) => {
  const { title, date } = event;
  const [year, _, month] = convertDate(date);

  const even = (index + 1) % 2 === 0;

  const timelineStyles = last && index === 0 ? "" : last ? "right-1/2 w-1/2" : index === 0 ? "left-1/2 w-1/2" : "w-full";

  const renderText = (name: string, date: string) => (
    <div>
      <div className="w-[280px]">
        <p className="text-[18px] capitalize text-textDark font-medium">{name}</p>
        <p>{date}</p>
      </div>
    </div>
  );

  return (
    <div className={`text-center w-[140px] relative flex-shrink-0`}>
      <div className={`h-[2px] bg-blue-600 absolute top-1/2 translate-y-[-1px] z-0 ${timelineStyles}`} />
      <div className="flex items-end justify-center h-[100px]">{!even && renderText(title, month + " " + year)}</div>
      <div className="flex place-content-center h-full relative z-10">
        <div className="circle-container">
          <div className={index === 0 || last ? "circle-full" : "circle-empty"}></div>
        </div>
      </div>
      <div className="flex items-start justify-center h-[100px]">{even && renderText(title, month + " " + year)}</div>
    </div>
  );
};
