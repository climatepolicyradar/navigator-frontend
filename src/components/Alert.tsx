interface IProps {
  message: string | React.ReactNode;
  icon?: React.ReactNode;
}

export const Alert = ({ message, icon }: IProps) => {
  return (
    <div className="flex">
      <div className="w-[6px] h-full bg-blue-400 rounded-l-lg"></div>
      <div className="bg-white p-2 border border-gray-300 border-l-0 rounded-r-lg flex items-center" role="alert">
        <div className="mr-2 text-blue-400">{icon ? icon : null}</div>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
