import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const ContextualSearchContent = () => {
  return (
    <SiteWidth extraClasses="!max-w-[1024px]">
      <div className="flex flex-col md:flex-row justify-center">
        <div className="border-gray-300 border-solid border-t pt-16 pb-16 md:pr-8 flex-1">
          <Heading level={2} extraClasses="custom-header">
            Central knowledge-base for MCFs
          </Heading>
          <p>Find information from 4 different funds projects and policies in more than 130 countries.</p>
          <div className="pt-9">
            <img
              src={"/images/climate-project-explorer/cpe-search-results.jpg"}
              alt={`Climate Project Explorer Search Filters Snapshot`}
              className="h-auto w-auto"
            />
          </div>
        </div>
        <div className=" border-gray-300 border-solid border-t md:border-l md:pl-8 pt-16 pb-16 flex-1">
          <Heading level={2} extraClasses="custom-header">
            Contextual search
          </Heading>
          <p>Quickly find exact matches and highlighted related phrases. Get English translations of relevant passages.</p>

          <div className="pt-9">
            <img
              src={"/images/climate-project-explorer/cpe-contextual-search.jpg"}
              alt={`Climate Project Explorer Contextual Search Snapshot`}
              className="h-auto w-auto"
            />
          </div>
        </div>
      </div>
    </SiteWidth>
  );
};

export default ContextualSearchContent;
