import { Card } from "@/components/atoms/card/Card";
import { LuX } from "react-icons/lu";

export const NewFeatures = () => (
  <div className="absolute inset-0 z-200 p-4 flex flex-col justify-end pointer-events-none">
    <Card className="max-w-[300px] pointer-events-auto">
      <div className="flex justify-between">
        <span>New thing!</span>
        <LuX height="16" width="16" />
      </div>
      <a href="#" onClick={() => alert("clicked")}>
        Read more
      </a>
    </Card>
  </div>
);
