type THeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;

type TProps = {
  level?: THeadingLevels;
  extraClasses?: string;
  children: React.ReactNode;
};

export const coreClasses = "text-textDark font-medium";
export const h1Classes = "text-4xl";
export const h2Classes = "text-2xl mb-5";
export const h3Classes = "text-xl mb-5";
export const h4Classes = "text-lg mb-5";

export const Heading = ({ level, extraClasses = "", children }: TProps) => {
  switch (level) {
    case 1:
      return <h1 className={`${coreClasses} ${h1Classes} ${extraClasses}`}>{children}</h1>;
    case 2:
      return <h2 className={`${coreClasses} ${h2Classes} ${extraClasses}`}>{children}</h2>;
    case 3:
      return <h3 className={`${coreClasses} ${h3Classes} ${extraClasses}`}>{children}</h3>;
    case 4:
      return <h4 className={`${coreClasses} ${h4Classes} ${extraClasses}`}>{children}</h4>;
    default:
      return <h1 className={`${coreClasses} ${h1Classes} ${extraClasses}`}>{children}</h1>;
  }
};