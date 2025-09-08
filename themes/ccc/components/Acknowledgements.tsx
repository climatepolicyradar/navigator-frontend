import { ReactNode } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { Heading } from "@/components/typography/Heading";

type TAcknowledgement = {
  partnerImage?: {
    url: string;
    imageUrl: string;
    imageAlt: string;
  };
  partnerImages?: Array<{
    url: string;
    imageUrl: string;
    imageAlt: string;
  }>;
  children?: ReactNode;
};

const Acknowledgement = ({ partnerImage, partnerImages, children }: TAcknowledgement) => {
  const images = partnerImages || (partnerImage ? [partnerImage] : []);

  return (
    <div className="mb-6 md:flex">
      {images.length > 0 && (
        <div className="mb-4 md:mb-0 md:basis-1/2 lg:basis-1/3 flex gap-4">
          {images.map((img, index) => (
            <ExternalLink key={index} className="" url={img.url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.imageUrl.startsWith("/") ? img.imageUrl : `/images/ccc/partners/${img.imageUrl}`}
                alt={img.imageAlt}
                className="max-h-[96px]"
              />
            </ExternalLink>
          ))}
        </div>
      )}
      <div className="md:basis-1/2 lg:basis-2/3 md:pl-6">{children}</div>
    </div>
  );
};

export const Acknowledgements = () => {
  return (
    <div>
      <Heading level={2}>Acknowledgements</Heading>
      <p className="mb-8">
        The Climate Litigation Database project is made possible through the work of many contributors. In particular, the Sabin Center would like to
        acknowledge the contributions of the following key partners:
      </p>
      <Acknowledgement
        partnerImage={{
          url: "https://www.filefoundation.org/",
          imageUrl: "FILE_logo.jpg",
          imageAlt: "Foundation for International Law and the Environment logo",
        }}
      >
        <p>
          FILE is a global philanthropic foundation supporting legal innovation to address the climate crisis. The Sabin Center's work on climate
          litigation is generously supported by FILE.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://juma.jur.puc-rio.br/base-dados-litigancia-climatica-no-brasil",
          imageUrl: "JUMA_logo.png",
          imageAlt: "Law, Environment and Justice in the Anthropocene Research Group (JUMA) logo",
        }}
      >
        <p>
          The Law, Environment and Justice in the Anthropocene Research Group (JUMA) produces qualified knowledge on topics linked to environmental
          and climate issues in the context of the Anthropocene. Its objective is to contribute to the fight against socio-environmental and climate
          injustice, based on a critical analysis of the challenges of Law in the face of the hypercomplex scenario of environmental and climate
          crisis. The Sabin Center relies on JUMA's{" "}
          <ExternalLink url="https://juma.jur.puc-rio.br/base-dados-litigancia-climatica-no-brasil">database</ExternalLink> for climate cases from
          Brazil.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://law.app.unimelb.edu.au/climate-change/",
          imageUrl: "UoM_logo.png",
          imageAlt: "The University of Melbourne's logo",
        }}
      >
        <p>
          The University of Melbourne's{" "}
          <ExternalLink url="https://law.app.unimelb.edu.au/climate-change/">Australia and Pacific Climate Change Litigation Database</ExternalLink>{" "}
          records litigation (including settled cases and court orders) on issues of climate change in Australia, New Zealand, and the Pacific
          Islands. The Sabin Center relies on its database for cases in Australia.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://aida-americas.org/en/blog/climate-litigation-platform-latin-america-and-caribbean-road-traveled",
          imageUrl: "AIDA_logo.svg",
          imageAlt: "Climate Litigation Platform for Latin America and the Caribbean (PLC) logo",
        }}
      >
        <p>
          The{" "}
          <ExternalLink url="https://aida-americas.org/en/blog/climate-litigation-platform-latin-america-and-caribbean-road-traveled">
            Climate Litigation Platform for Latin America and the Caribbean (PLC)
          </ExternalLink>
          , coordinated by AIDA, systematizes and analyzes climate-related cases across the region. Its purpose is to strengthen litigation as a tool
          to address the climate crisis, providing accessible information, legal analysis, and resources to people interested in climate justice
          (practitioners, researchers, attorneys, and communities). By documenting ongoing and concluded cases and disseminating information through
          reports, articles, blogs, and newsletters, the PLC promotes transparency, fosters collaboration, and highlights the role of the judiciary
          towards climate justice throughout the Latin American region. The Sabin Center collaborates with AIDA on tracking cases in Latin America and
          the Caribbean.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://www.ucc.ie/en/youthclimatejustice/caselawdatabase/",
          imageUrl: "YCJ_logos.png",
          imageAlt: "Youth Climate Justice partners logos",
        }}
      >
        <p>
          The <ExternalLink url="https://www.ucc.ie/en/youthclimatejustice/caselawdatabase/">Youth Climate Justice database</ExternalLink> is part of
          the Youth Climate Justice project, funded by the European Research Council. The project researches youth climate action and its impact on
          international human rights law, working with young climate leaders across five continents. The database contains over 80 climate cases
          involving children and youth (up to age 25). Breakdowns are provided of these cases on the basis of various children's rights considerations
          - e.g., the ways in which children/youth were involved, the UN Convention on the Rights of the Child rights involved, or whether future
          generations are mentioned in the case. The aim of the database is to provide researchers with significant amounts of information to
          facilitate research and writing on youth climate cases. The database relies on summaries from the Sabin Center's database.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImages={[
          {
            url: "https://www.lse.ac.uk/",
            imageUrl: "/images/partners/lse-logo.png",
            imageAlt: "London School of Economics logo",
          },
          {
            url: "https://www.lse.ac.uk/granthaminstitute/",
            imageUrl: "/images/partners/grantham-logo.png",
            imageAlt: "Grantham Research Institute for Climate Change and the Environment logo",
          },
        ]}
      >
        <p>
          The Sabin Center often collaborates with the{" "}
          <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/">
            Grantham Research Institute on Climate Change and the Environment
          </ExternalLink>
          .
        </p>
      </Acknowledgement>
    </div>
  );
};
