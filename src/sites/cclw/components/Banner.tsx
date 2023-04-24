import { LinkWithQuery } from "@components/LinkWithQuery";

export const Banner = () => {
  return (
    <div className="bg-[#7cb4fa] w-full flex justify-center p-2 font-bold text-sm">
      <div>
        We've upgraded this site.{" "}
        <LinkWithQuery className="underline" href="/faq">
          Find out more
        </LinkWithQuery>
      </div>
    </div>
  );
};
