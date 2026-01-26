import { ReactNode } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { Heading } from "@/components/typography/Heading";

type TAcknowledgement = {
  partnerImage?: {
    url: string;
    imageUrl: string;
    imageAlt: string;
  };
  children?: ReactNode;
};

const Acknowledgement = ({ partnerImage, children }: TAcknowledgement) => {
  return (
    <div className="mb-6 md:flex">
      {partnerImage && (
        <div className="mb-4 md:mb-0 md:basis-1/2 lg:basis-1/3 flex">
          <ExternalLink className="" url={partnerImage.url}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/cclw/partners/${partnerImage.imageUrl}`} alt={partnerImage.imageAlt} className="max-h-[96px]" />
          </ExternalLink>
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
        The Climate Change Laws of the World project is made possible through the work of many contributors. In particular, the Grantham Research
        Institute at LSE would like to acknowledge the contributions of the following key partners:
      </p>
      <Acknowledgement
        partnerImage={{
          url: "https://climate.law.columbia.edu",
          imageUrl: "sabin-logo-full.jpg",
          imageAlt: "Sabin Center for Climate Change Law at Columbia Law School logo",
        }}
      >
        <p>
          The Sabin Center for Climate Change Law, a joint center of the Columbia Law School and the Climate School, develops and promulgates legal
          techniques to address climate change and trains the next generation of lawyers who will be leaders in the field. The Sabin Center is an
          affiliate of the Earth Institute and the Columbia Climate School. Climate Change Laws of the World builds on more than a decade of data
          collection by the Grantham Research Institute at LSE and the Sabin Center at Columbia Law School. Work to identify cases is now supported by
          a Global Network of Peer Reviewers, coordinated by the Sabin Center.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://www.filefoundation.org/",
          imageUrl: "FILE_logo.jpg",
          imageAlt: "Foundation for International Law and the Environment logo",
        }}
      >
        <p>
          FILE is a global philanthropic foundation supporting legal innovation to address the climate crisis. The Grantham Institute would like to
          thank FILE for its generous support for developments to the database.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://www.ipu.org/",
          imageUrl: "IPU_logo.png",
          imageAlt: "Inter-Parliamentary Union logo",
        }}
      >
        <p>
          The Inter-Parliamentary Union (IPU) is the global organisation of national parliaments. It began in 1889 as a small group of
          parliamentarians, dedicated to promoting peace through parliamentary diplomacy and dialogue, and has since grown into a truly global
          organisation of national parliaments. Through the Grantham Research Institute’s ongoing partnership with IPU, we work to develop timely and
          relevant outputs on climate change legislation and policy that can inform the work of IPU’s members.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://www.law.ed.ac.uk/research/research-centres-and-networks/edinburgh-centre-constitutional-law/about",
          imageUrl: "UoE_Law_logo.jpeg",
          imageAlt: "Edinburgh Centre for Constitutional Law logo",
        }}
      >
        <p>
          The Edinburgh Centre for Constitutional Law (ECCL) provides a focal point for staff and postgraduate research students working in all areas
          of Scots and UK public law, Commonwealth and comparative constitutional law, human rights law, environmental law and climate change law,
          democratisation and transitional constitutionalism, and constitutional theory. Data on climate-relevant constitutions found in the Climate
          Change Laws of the World database is gathered and maintained through an ongoing collaboration with ECCL.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://www.sussex.ac.uk/",
          imageUrl: "UoS_logo.png",
          imageAlt: "University of Sussex logo",
        }}
      >
        <p>
          Based on the best practices of former treaty campaigns and existing struggles led by frontline communities, the Fossil Fuel
          Non-Proliferation Treaty Initiative started in 2019 through a Climate Breakthrough Project award. The Initiative promotes international
          action to phase out fossil fuel production based on the principles of non-proliferation, a fair phase out, and a just transition. LSE
          collaborates with researchers at the University of Sussex supporting the non-proliferation initiative to exchange information on national
          level laws and policies regarding moratoria, bans, and limits placed on fossil fuel use and/or divestment from fossil fuels.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://www.juma.nima.puc-rio.br/sobre-juma/",
          imageUrl: "JUMA_logo.png",
          imageAlt: "JUMA logo",
        }}
      >
        <p>
          The Law, Environment and Justice in the Anthropocene Research Group (JUMA) produces qualified knowledge on topics linked to environmental
          and climate issues in the context of the Anthropocene. Its objective is to contribute to the fight against socio-environmental and climate
          injustice, based on a critical analysis of the challenges of Law in the face of the hypercomplex scenario of environmental and climate
          crisis.
        </p>
      </Acknowledgement>
      <Acknowledgement
        partnerImage={{
          url: "https://www.vancecenter.org/ ",
          imageUrl: "CRVCIJ_logo.png",
          imageAlt: "Cyrus R. Vance Center for International Justice logo",
        }}
      >
        <p>
          The Vance Center advances global justice by engaging lawyers across borders to support civil society and an ethically active legal
          profession.
        </p>
      </Acknowledgement>
    </div>
  );
};
