import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center flex-nowrap gap-1">
      <Image src="/images/cclw/cclw-logo-globe.png" alt="Climate Change Laws of the World logo globe" width={40} height={40} />
      <Image src="/images/cclw/cclw-logo-text-light.svg" alt="Climate Change Laws of the World logo text" width={223} height={34} />
    </div>
  );
};
