import { SiteWidth } from "@components/panels/SiteWidth";
import { Heading } from "@components/typography/Heading";
import { LinkWithQuery } from "@components/LinkWithQuery";

const AboutClimateProjectExplorer = () => {
  return (
    <SiteWidth extraClasses="">
      <div className="relative h-auto w-auto md:h-[1280px] md:w-[1440px] pb-16 md:pb-0">
        <div className="absolute z-0 w-full h-full hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={"/images/climate-project-explorer/cpe-search-page.png"}
            alt={`Green Climate Fund logo`}
            className="h-full w-full object-cover"
          />{" "}
        </div>
        <div className="max-w-xl relative z-10">
          <Heading level={2} extraClasses="custom-header">
            About Climate Project Explorer
          </Heading>
          <p>
            The MCFs have agreed to jointly develop and launch this platform as a single point of entry for navigating and exploring the MCF’s
            documents (including project documents and policies). This platform will serve as a knowledge tool to raise awareness of the value and
            impact of the MCFs, facilitate the exchange of information to enhance access to the funds, and promote transparency.
          </p>
          <br />
          <LinkWithQuery className="underline" href="/about">
            Find out more
          </LinkWithQuery>
        </div>
      </div>
    </SiteWidth>
  );
};

export default AboutClimateProjectExplorer;
