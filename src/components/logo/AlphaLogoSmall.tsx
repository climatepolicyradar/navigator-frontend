import Link from "next/link";
import Logo from "../svg/Logo";

const AlphaLogoSmall = () => {
  return (
    <div data-cy="cpr-logo" className="text-white flex mr-10">
      <Link href="/" className="relative block">
        <Logo />
      </Link>
    </div>
  );
};
export default AlphaLogoSmall;
