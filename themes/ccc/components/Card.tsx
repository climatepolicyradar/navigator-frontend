interface IProps {
  children: React.ReactNode;
  extraClasses?: string;
  heading: string;
  img?: string;
  imgAlt?: string;
  type?: string;
}

export const Card = ({ heading, type, img, extraClasses, children }: IProps) => {
  return (
    <div className={`h-full ${extraClasses}`}>
      <div className="block relative border border-gray-300 rounded-xl h-full shadow p-4">
        <div className="min-h-[180px] h-full">
          {img && (
            <div
              className="w-full h-[120px] overflow-hidden rounded-xl mb-2"
              style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat" }}
            />
          )}
          {type && (
            <div className="pb-2">
              <span className="bg-blue-50 py-2 px-3 text-blue-900 text-xs rounded-xl inline-block">{type}</span>
            </div>
          )}
          <div className="pb-2 basis-full text-base font-medium group-hover:underline">{heading}</div>
          {children}
        </div>
      </div>
    </div>
  );
};
