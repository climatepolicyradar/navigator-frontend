import { Toggle as BaseToggle } from "@base-ui-components/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui-components/react/toggle-group";

import { joinTailwindClasses } from "@/utils/tailwind";
import { firstCase } from "@/utils/text";

export type TToggleGroupToggle<ToggleId extends string> = {
  id: ToggleId;
  label?: string;
};

interface IProps<ToggleId extends string> {
  buttonClasses?: string;
  buttonSize: "medium" | "large";
  groupClasses?: string;
  onValueChange: (value: ToggleId) => void;
  toggles: TToggleGroupToggle<ToggleId>[];
  value: ToggleId;
}

export const ToggleGroup = <ToggleId extends string>({
  buttonClasses,
  buttonSize,
  groupClasses,
  onValueChange,
  toggles,
  value,
}: IProps<ToggleId>) => {
  const allGroupClasses = joinTailwindClasses("inline-flex gap-1", groupClasses);
  const allButtonClasses = joinTailwindClasses(
    "rounded-full text-base text-gray-700 font-heavy leading-none data-[pressed]:bg-gray-950 data-[pressed]:text-white",
    buttonSize === "medium" ? "px-3 py-2 text-base" : "px-4 py-2.5 text-lg",
    buttonClasses
  );

  const changeValue = (toggles: ToggleId[]) => {
    if (toggles.length > 0) onValueChange(toggles[0]);
  };

  return (
    <BaseToggleGroup className={allGroupClasses} defaultValue={[toggles[0].id]} value={[value]} multiple={false} onValueChange={changeValue}>
      {toggles.map(({ id, label }) => (
        <BaseToggle key={id} className={allButtonClasses} pressed={value === id} value={id} data-ph-capture-attribute-page-header-tab={id}>
          {label || firstCase(id)}
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  );
};
