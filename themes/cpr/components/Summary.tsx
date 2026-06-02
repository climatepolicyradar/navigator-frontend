import { BookText } from "lucide-react";

import { ExternalLink } from "@/components/ExternalLink";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const Summary = () => {
  return (
    <section className="bg-blue-200">
      <SiteWidth extraClasses="py-24 md:flex items-center">
        <div>
          <Heading level={2}>Read our methodology</Heading>
          <p className="text-lg md:mr-8">
            Find out more about the scope and structure of our database, our data collection methods, terminology, updates and future developments.
          </p>
        </div>
        <ExternalLink
          url="https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md"
          className="flex flex-col gap-2 mt-4 md:mt-0 w-full text-center bg-blue-500 text-white md:grow-0 p-2 rounded-xl md:w-48 transition duration-300 hover:text-white"
        >
          <div className="flex justify-center">
            <BookText width={64} height={64} />
          </div>
          <span>Read more</span>
        </ExternalLink>
      </SiteWidth>
    </section>
  );
};
export default Summary;
