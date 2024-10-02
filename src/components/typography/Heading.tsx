type THeadingLevels = 1 | 2 | 3 | 4;

type TProps = {
  level?: THeadingLevels;
  extraClasses?: string;
  children: React.ReactNode;
  [x: string]: any;
};

// Dev note: because we have dynamic content that we may not have control over, please update the style.css with the corresponding html heading tags
export const coreClasses = "text-textDark font-medium";
export const h1Classes = "text-4xl";
export const h2Classes = "text-2xl mb-5";
export const h3Classes = "text-xl mb-5";
export const h4Classes = "text-lg mb-5";

export const Heading = ({ level, extraClasses = "", children, ...props }: TProps) => {
  switch (level) {
    case 1:
      return (
        <h1 className={`${coreClasses} ${h1Classes} ${extraClasses}`} {...props}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={`${coreClasses} ${h2Classes} ${extraClasses}`} {...props}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 className={`${coreClasses} ${h3Classes} ${extraClasses}`} {...props}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 className={`${coreClasses} ${h4Classes} ${extraClasses}`} {...props}>
          {children}
        </h4>
      );
    default:
      return (
        <h1 className={`${coreClasses} ${h1Classes} ${extraClasses}`} {...props}>
          {children}
        </h1>
      );
  }
};
