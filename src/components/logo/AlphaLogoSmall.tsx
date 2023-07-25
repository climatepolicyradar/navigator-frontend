import { LinkWithQuery } from "@components/LinkWithQuery";
import Logo from "../svg/Logo";

const AlphaLogoSmall = () => {
  return (
    <div data-cy="cpr-logo" className="text-white flex mr-10">
      <LinkWithQuery href="/" className="relative block text-white hover:text-white">
        <Logo />
      </LinkWithQuery>
    </div>
  );
};
export default AlphaLogoSmall;
