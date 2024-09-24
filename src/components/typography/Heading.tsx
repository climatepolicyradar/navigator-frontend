type THeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;

type TProps = {
  level?: THeadingLevels;
  as?: THeadingLevels;
  extraClasses?: string;
  children: React.ReactNode;
};

export const Heading = ({ level, as, extraClasses, children }: TProps) => {
  switch (level) {
    case 1:
      return <h1 className={` ${extraClasses}`}>{children}</h1>;
    case 2:
      return <h2 className={` ${extraClasses}`}>{children}</h2>;
    case 3:
      return <h3 className={` ${extraClasses}`}>{children}</h3>;
    case 4:
      return <h4 className={` ${extraClasses}`}>{children}</h4>;
    case 5:
      return <h5 className={` ${extraClasses}`}>{children}</h5>;
    case 6:
      return <h6 className={` ${extraClasses}`}>{children}</h6>;
    default:
      return <h1 className={` ${extraClasses}`}>{children}</h1>;
  }
};
