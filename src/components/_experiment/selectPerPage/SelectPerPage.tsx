import { Select } from "@base-ui/react/select";
import { LucideChevronDown } from "lucide-react";

type TProps = {
  value: string;
  onChange: (value: string) => void;
};

const values = ["10", "20", "50", "100"];

export function SelectPerPage({ value, onChange }: TProps) {
  return (
    <div className="flex items-center gap-2 text-inky-black text-sm font-medium">
      <Select.Root defaultValue={"10"} onValueChange={(value) => onChange(value)}>
        <Select.Label className="cursor-default ">Results per page</Select.Label>
        <Select.Trigger className="flex text-sm h-8 items-center justify-between gap-2 rounded border border-transparent-regular px-2.5 bg-[canvas] select-none hover:border-inky-black focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:border-inky-black">
          <Select.Value className="">{value}</Select.Value>
          <Select.Icon className="flex">
            <LucideChevronDown width={16} height={16} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="outline-hidden z-10" sideOffset={4} alignItemWithTrigger={false}>
            <Select.Popup className="group max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) bg-clip-padding overflow-y-auto rounded-md bg-[canvas] shadow-lg shadow-gray-200 outline-1 outline-transparent-regular transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none">
              {values.map((value) => (
                <Select.Item
                  key={value}
                  value={value}
                  className="cursor-pointer px-2.5 py-2 text-sm font-medium transition hover:bg-inky-black hover:text-white"
                >
                  <Select.ItemText className="col-start-2">{value}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
