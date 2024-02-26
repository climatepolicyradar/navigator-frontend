import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center flex-nowrap gap-2">
      <Image src="/images/cclw/cclw-logo-globe.png" alt="Climate Change Laws of the World logo globe" width={60} height={60} />
      <Image src="/images/cclw/cclw-logo-text-light.svg" alt="Climate Change Laws of the World logo text" width={223} height={30} />
    </div>
  );
};
