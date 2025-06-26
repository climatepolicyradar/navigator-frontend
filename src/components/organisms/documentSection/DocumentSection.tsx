import { LucideListFilter, LucideScrollText, LucideSearch, LucideTable } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { Section } from "@/components/molecules/section/Section";
import { Toggle } from "@/components/molecules/toggleGroup/Toggle";
import { ToggleGroup } from "@/components/molecules/toggleGroup/ToggleGroup";

import { IInteractiveTableColumn, InteractiveTable } from "../interactiveTable/InteractiveTable";

type TView = "table" | "list";
const DEFAULT_VIEW: TView = "table";

type TColumnKeys = "action" | "date" | "document" | "summary" | "type";
const TABLE_COLUMNS: IInteractiveTableColumn<TColumnKeys>[] = [
  {
    id: "date",
    name: "Filing date",
  },
  { id: "type" },
  {
    id: "action",
    name: "Action taken",
    sortable: false,
  },
  {
    id: "document",
    sortable: false,
  },
  {
    id: "summary",
    fraction: 2,
  },
];

interface IProps {}

export const DocumentSection = ({}: IProps) => {
  const [view, setView] = useState<TView>(DEFAULT_VIEW);
  const [searchText, setSearchText] = useState("");

  const onViewChange = (value: TView[]) => setView(value[0] || DEFAULT_VIEW);

  return (
    <Section title="Entries">
      {/* Controls */}
      <div className="py-6 flex items-center gap-3">
        <ToggleGroup className="flex-1" defaultValue={[DEFAULT_VIEW]} toggleMultiple={false} onValueChange={onViewChange}>
          <Toggle Icon={LucideTable} rounded value="table">
            Table
          </Toggle>
          <Toggle Icon={LucideScrollText} rounded value="list">
            List
          </Toggle>
        </ToggleGroup>
        <Input
          containerClasses="min-w-1/3"
          Icon={LucideSearch}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search..."
          value={searchText}
        />
        <Toggle Icon={LucideListFilter}>Filter</Toggle>
      </div>

      {/* Content */}
      <div className="">
        {view === "table" && <InteractiveTable columns={TABLE_COLUMNS} rows={[]} />}
        {view === "list" && <div>List, eventually</div>}
      </div>
    </Section>
  );
};
