type TProps = {
  labelText: string;
  extraClasses?: string;
};

export const Label = ({ labelText, extraClasses = "" }: TProps) => {
  return (
    <>
      <span className="bg-blue-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-sm">{labelText}</span>
    </>
  );
};
