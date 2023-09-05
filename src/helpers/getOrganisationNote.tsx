import { ExternalLink } from "@components/ExternalLink";

type TProps = string;

export const getOrganisationNote = (organisation: TProps) => {
  switch (organisation) {
    case "CCLW":
      return (
        <p>
          The summary of this document was written by researchers at the{" "}
          <ExternalLink url="http://lse.ac.uk/grantham" className="alt">Grantham Research Institute</ExternalLink>. If you want to use this summary, please check{" "}
          <ExternalLink url="https://www.lse.ac.uk/granthaminstitute/cclw-terms-and-conditions" className="alt">terms of use</ExternalLink> for citation and licensing
          of third party data.
        </p>
      );
    case "UNFCCC":
      return (
        <p>
          This document was downloaded from the <ExternalLink url="https://unfccc.int/" className="alt">UNFCCC website</ExternalLink>. Please check{" "}
          <ExternalLink url="https://unfccc.int/this-site/terms-of-use" className="alt">terms of use</ExternalLink> for citation and licensing of third party data.
        </p>
      );
  }
};
