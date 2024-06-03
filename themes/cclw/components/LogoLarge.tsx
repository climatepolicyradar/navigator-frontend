import Image from "next/image";

export const LogoLarge = () => {
  return (
    <div className="flex items-center flex-nowrap gap-6" data-cy="cclw-logo">
      <Image src="/images/cclw/cclw-logo-globe-large.png" alt="Climate Change Laws of the World logo globe" width={109} height={109} />
      <Image src="/images/cclw/cclw-logo-text-light.svg" alt="Climate Change Laws of the World logo text" width={296} height={45} />
    </div>
  );
};
