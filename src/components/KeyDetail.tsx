type TProps = {
  detail: string;
  extraDetail?: string;
  amount: number | string | JSX.Element;
  icon?: JSX.Element;
  onClick?: () => void;
  cssClasses?: string;
};

export const KeyDetail = ({ detail, amount, icon, extraDetail, onClick, cssClasses }: TProps) => {
  const handleOnClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      className={`key-detail bg-cpr-dark text-white flex p-3 shadow-md transition-all ${
        onClick ? "cursor-pointer hover:bg-blue-500" : ""
      } ${cssClasses}`}
      onClick={handleOnClick}
    >
      {icon && (
        <div className="flex items-center justify-center">
          <div className={`p-1 bg-white rounded-full w-[54px] h-[54px] flex items-center justify-center text-cpr-dark`}>{icon}</div>
        </div>
      )}
      <div>
        <div className="flex items-center">
          <div className="text-lg ml-2">{detail}</div>
          <div className="flex items-center ml-3 text-2xl font-medium drop-shadow">{amount}</div>
        </div>
        <div className="ml-2 text-sm">{extraDetail}</div>
      </div>
    </div>
  );
};
