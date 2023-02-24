import Link from "next/link";
import LargeLogo from "../svg/LargeLogo";

const AlphaLogo = () => {
  return (
    <div data-cy="cpr-logo" className="text-white flex mr-10">
      <Link href="/" className="relative block">
        <LargeLogo />
      </Link>
    </div>
  );
};
export default AlphaLogo;
