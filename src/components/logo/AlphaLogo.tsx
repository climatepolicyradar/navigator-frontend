import { LinkWithQuery } from "@components/LinkWithQuery";
import LargeLogo from "../svg/LargeLogo";

const AlphaLogo = () => {
  return (
    <div data-cy="cpr-logo" className="text-white flex mr-10">
      <LinkWithQuery href="/" className="relative block">
        <LargeLogo />
      </LinkWithQuery>
    </div>
  );
};
export default AlphaLogo;
