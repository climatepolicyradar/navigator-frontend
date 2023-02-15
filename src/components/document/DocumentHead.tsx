import { CountryLink } from "@components/CountryLink";
import { convertDate } from "@utils/timedate";

type TProps = {
  document: any;
  onCollectionClick?: (e: any) => void;
};

export const DocumentHead = ({ document, onCollectionClick }: TProps) => {
  const [year] = convertDate(document?.publication_ts);

  return (
    <div className="bg-offwhite border-solid border-lineBorder border-b">
      <div className="container">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 my-4">
            <h1 className="text-3xl lg:smaller">{document.title}</h1>
            {document?.collection?.name && (
              <div className="flex text-base text-indigo-400 mt-4 items-center w-full mb-2 font-medium">
                <span>Part of &nbsp;</span>
                {onCollectionClick ? (
                  <a onClick={onCollectionClick} href="#collection" className="underline text-primary-400 hover:text-indigo-600 duration-300">
                    {document?.collection.name}
                  </a>
                ) : (
                  document?.collection.name
                )}
              </div>
            )}
            <div className="flex text-base text-grey-700 mt-4 items-center w-full font-medium divide-x gap-2 divide-grey-700">
              <CountryLink countryCode={document.geography.value} className="text-primary-400 hover:text-indigo-600 duration-300">
                <span className={`rounded-sm border border-black flag-icon-background flag-icon-${document.geography.value.toLowerCase()}`} />
                <span className="ml-2">{document.geography.display_value}</span>
              </CountryLink>
              <span className="pl-2">{year}</span>
              {document?.variant && <span className="pl-2">{document.variant.label}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
