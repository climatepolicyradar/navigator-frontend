import Image from "next/image";
import { ComponentProps, ReactNode } from "react";

import { TQueryParams } from "@/constants/queryParams";

import { TFeature } from "./features";

type TImageProps = ComponentProps<typeof Image> & {
  // Prevents no width/height runtime error
  width: number;
  height: number;
};

export type TSearchSuggestion = {
  label: string;
  params: Partial<Record<TQueryParams, string>>;
  newParams: Record<string, string>;
};

export type TLandingPageSearchConfig = {
  button: TSearchSuggestion;
  suggestions: TSearchSuggestion[];
};

export type TLandingPageConfig = {
  background?: {
    classes?: string;
    image: TImageProps;
  };
  hero: {
    description: string;
    taxonomy: string;
    title: string;
  };
  heroImage?: {
    src: string;
  };
  // Replaces the CPR logo in the header with a co-branded lockup, e.g. CPR
  // "in partnership with UNFCCC". Needs a light and a dark variant because the
  // header renders dark over a hero image and light everywhere else.
  headerLogo?: {
    alt: string;
    darkSrc: string;
    lightSrc: string;
    width: number;
    height: number;
  };
  organisation?: {
    name: string;
    logoImage: TImageProps;
    links: {
      label: string;
      externalHref: string;
    }[];
  };
  search: TLandingPageSearchConfig;
  partners?: {
    title: string;
    logos: {
      src: string;
      alt: string;
      width: number;
      height: number;
    }[];
  };
  textContent: {
    title: string;
    content: ReactNode;
  }[];
  requiredFeature?: TFeature;
};
