import { useEffect, useState } from "react";

import { INSTRUCTIONS } from "@/cclw/constants/instructions";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { calculateTotalFamilies } from "@/helpers/getFamilyCounts";
import useConfig from "@/hooks/useConfig";

const ANIMATION_DELAY = 3000;

const scrollToMap = () => {
  const worldMap = document.getElementById("world-map");
  worldMap?.scrollIntoView({ behavior: "smooth" });
};

const Instructions = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const configQuery = useConfig();
  const { data: { corpus_types } = {} } = configQuery;

  const totalFamilies = calculateTotalFamilies(corpus_types);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, ANIMATION_DELAY);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="xl:max-w-[880px] mx-auto relative">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
        {INSTRUCTIONS(totalFamilies).map((instruction, index) => (
          <div key={index} className="p-3 flex gap-4 items-center bg-cclw-light rounded-lg text-sm" data-cy={instruction.cy}>
            <div className="flex items-center justify-center">{instruction.icon}</div>
            <div>{instruction.content}</div>
          </div>
        ))}
      </div>
      {/* TODO: reinstate when the world map API is back */}
      {/* <div className="hidden md:block absolute top-0 right-0 -translate-y-[140%] 2xl:top-auto 2xl:bottom-0 2xlright-full 2xl:translate-y-0 2xl:translate-x-[110%]">
        <Button content="both" rounded className="!bg-blueGray-800  hover:!bg-blueGray-700 border !border-blueGray-700" onClick={scrollToMap}>
          Or try exploring by country
          <span className={`hover:animate-none ${isAnimated ? "animate-bounce" : ""}`}>
            <Icon name="downArrow" />
          </span>
        </Button>
      </div> */}
    </div>
  );
};
export default Instructions;
