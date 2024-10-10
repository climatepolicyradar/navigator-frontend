import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center flex-nowrap gap-2">
      <Image src="/images/climate-project-explorer/cpe-logo.svg" alt="Climate Project Explorer" width={104.56} height={44} />
    </div>
  );
};
