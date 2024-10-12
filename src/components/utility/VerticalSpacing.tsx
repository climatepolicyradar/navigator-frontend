type spacingSize = "base" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "minimumtargetsize";

type Tprops = {
  size: spacingSize;
  children?: React.ReactNode;
};

const padding = {
  base: 1, //"4px",
  xs: 1, // "4px",
  sm: 2, // "8px",
  md: 4, // "16px",
  lg: 6, //"24px",
  xl: 8, // "32px",
  xxl: 10, // "40px",
  xxxl: 20, // "80px",
  /* 44x44 is the recommended minimum iOS touch target size */
  minimumtargetsize: "[44px]",
};

export const VerticalSpacing = ({ size, children = null }: Tprops) => {
  return <div className={`p-${padding[size]}`}>{children}</div>;
};
