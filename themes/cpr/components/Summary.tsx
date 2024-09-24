import { SiteWidth } from "@components/panels/SiteWidth";

import { ExternalLink } from "@components/ExternalLink";
import { ReadMoreIcon } from "@components/svg/Icons";

const Summary = () => {
  return (
    <section className="bg-blue-200">
      <SiteWidth extraClasses="py-24 md:flex items-center">
        <div>
          <h2 className="text-indigo-500 mb-4">Read our methodology</h2>

          <p className="text-lg md:mr-8">
            Please refer to this page for information about the scope and structure of our database, our data collection methods and terminology,
            updates to the database and planned future developments.
          </p>
        </div>

        <ExternalLink
          url="https://github.com/climatepolicyradar/methodology"
          className="mt-4 md:mt-0 block w-full text-center bg-blue-500 text-white md:grow-0 p-2 rounded-xl md:w-48 hover:bg-indigo-600 transition duration-300"
        >
          <div className="flex justify-center">
            <ReadMoreIcon />
          </div>
          <span>Read more</span>
        </ExternalLink>
      </SiteWidth>
    </section>
  );
};
export default Summary;