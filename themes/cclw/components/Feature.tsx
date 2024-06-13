import { ReactNode } from "react";
import Image from "next/image";

type TProps = {
  heading?: string;
  contentSide?: "left" | "right";
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
};

export const Feature = ({ heading, contentSide = "left", image, imageAlt, children }: TProps) => {
  return (
    <div className="bg-cclw-dark text-white py-12">
      <div className="container md:flex gap-8">
        <div className={`basis-1/2 ${contentSide === "right" ? "order-last" : ""}`}>
          {heading && <h3 className="text-3xl md:text-h2 lg:text-h1 lg:leading-[72px] text-white">{heading}</h3>}
          {children}
        </div>
        {image && (
          <div className="mt-8 basis-1/2 rounded-2xl border-[12px] border-gray-300 bg-gray-300 shadow-2xl self-start">
            <div>
              <Image
                src={`/images/cclw/images/${image}`}
                alt={imageAlt}
                width={800}
                height={619}
                quality={85}
                sizes="(max-width: 768px) 0, (max-width: 1024px) 352, (max-width: 1536px) 50vw"
                className="rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
