import { SiteWidth } from "@components/panels/SiteWidth";
import { Heading } from "@components/typography/Heading";
import { VerticalSpacing } from "@components/utility/VerticalSpacing";

const ContextualSearchContent = () => {
  return (
    <SiteWidth>
      <div className="flex flex-col md:flex-row justify-center">
        <div className="border-slate-700 border-solid border-t-2 pt-16 pb-16 pr-16 flex-1">
          <Heading level={2} extraClasses="custom-header">
            Central knowledge-base for MCFs
          </Heading>
          <p>
            Find information from 4 different funds projects and policies <br /> in more than 130 countries.
          </p>
          <VerticalSpacing size="sm" />
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/images/climate-project-explorer/cpe-search-results.png"}
              alt={`Green Climate Fund logo`}
              className="h-auto w-auto md:h-[354px] md:w-[516px]"
            />
          </div>
        </div>
        <div className=" border-slate-700 border-solid border-t-2 md:border-l-2 md:pl-16 pt-16 pb-16 pr-16 flex-1">
          <Heading level={2} extraClasses="custom-header">
            Contextual search
          </Heading>
          <p>Quickly find exact matches and highlighted related phrases.</p>
          <p>Get English translations of relevant passages.</p>
          <VerticalSpacing size="sm" />
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/images/climate-project-explorer/cpe-contextual-search.png"}
              alt={`Green Climate Fund logo`}
              className="h-auto w-auto md:h-[354px] md:w-[516px]"
            />
          </div>
        </div>
      </div>
    </SiteWidth>
  );
};

export default ContextualSearchContent;
