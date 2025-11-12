import { LinkWithQuery } from "@/components/LinkWithQuery";
import { COUNTRY_FLAGS } from "@/constants/flags";

export interface IProps {
  code: string;
  name: string;
  slug?: string;
}

export const GeographyLink = ({ code, name, slug }: IProps) => {
  const flag = code in COUNTRY_FLAGS ? <>{COUNTRY_FLAGS[code]}&nbsp;</> : null;
  const content = (
    <>
      {flag}
      {name}
    </>
  );

  return slug ? (
    <LinkWithQuery href={`/geographies/${slug}`} className="hover:underline decoration-gray-500">
      {content}
    </LinkWithQuery>
  ) : (
    content
  );
};
