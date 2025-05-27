import { LinkWithQuery } from "@/components/LinkWithQuery";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const AboutClimateProjectExplorer = () => {
  return (
    <SiteWidth extraClasses="!max-w-[1024px]">
      <div className="absolute lg:z-0 hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"/images/climate-project-explorer/cpe-hp-1.jpg"}
          alt={`Climate Project Explorer Search Page Snapshot`}
          className="max-h-[824px] max-w-[1024px] object-cover"
        />{" "}
      </div>
      <div className="lg:relative lg:h-[824px] w-auto pb-16 lg:pb-0">
        <div className="max-w-xl lg:relative lg:z-10 ">
          <Heading level={2} extraClasses="custom-header">
            About Climate Project Explorer
          </Heading>
          <p>
            The MCFs have agreed to jointly develop and launch this platform as a single point of entry for navigating and exploring the MCF’s
            documents (including project documents and policies). This platform will serve as a knowledge tool to raise awareness of the value and
            impact of the MCFs, facilitate the exchange of information to enhance access to the funds, and promote transparency.
          </p>
          <br />
          <LinkWithQuery className="text-blue-600 underline hover:text-blue-800" href="/about">
            Find out more
          </LinkWithQuery>
        </div>
      </div>
    </SiteWidth>
  );
};

export default AboutClimateProjectExplorer;
