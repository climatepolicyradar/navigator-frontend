import { useContext, useEffect, useState } from "react";

import { configureDocumentsFilters, PRINCIPAL_DOCUMENTS_FILTER } from "@/api/search";
import { INSTRUCTIONS } from "@/cclw/constants/instructions";
import { FeaturesContext } from "@/context/FeaturesContext";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import { TNestedSearchLabel } from "@/types";

const ANIMATION_DELAY = 3000;
const CATEGORY_LABEL_PATTERN = "category::*";

const getFamilyTotals = (categories: TNestedSearchLabel[]) => {
  const countOf = (id: string) => categories.find((category) => category.id === id)?.count ?? 0;

  return {
    laws: countOf("category::Law"),
    policies: countOf("category::Policy"),
    unfccc: countOf("category::UN submission"),
    reports: countOf("category::Report"),
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scrollToMap = () => {
  const worldMap = document.getElementById("world-map");
  worldMap?.scrollIntoView({ behavior: "smooth" });
};

const Instructions = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAnimated, setIsAnimated] = useState(false);
  const features = useContext(FeaturesContext);
  const { labels: categories } = useTaxonomy({
    patterns: [CATEGORY_LABEL_PATTERN],
    filters: configureDocumentsFilters({ op: "and", filters: [PRINCIPAL_DOCUMENTS_FILTER] }, undefined, features),
  });

  const totalFamilies = getFamilyTotals(categories);

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
            <MoveDown height={14} width={14} />
          </span>
        </Button>
      </div> */}
    </div>
  );
};
export default Instructions;
