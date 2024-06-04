type TProps = { heading: string; type?: string; img?: string; imgAlt?: string; children: React.ReactNode };

export const Card = ({ heading, type, img, children }: TProps) => {
  return (
    <div className="h-full">
      <div className="block relative border border-grey-100 rounded-xl h-full shadow p-4">
        <div className="min-h-[180px] h-full">
          {img && (
            <div
              className="w-full h-[120px] overflow-hidden rounded-xl"
              style={{ backgroundImage: `url(${img}`, backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat" }}
            />
          )}
          {type && (
            <div className="px-4 py-2 pb-0">
              <span className="bg-blue-50 py-2 px-3 text-blue-900 text-xs font-medium rounded-xl inline-block">{type}</span>
            </div>
          )}
          <div className="px-4 py-2 basis-full text-base font-medium">{heading}</div>
          {children}
        </div>
      </div>
    </div>
  );
};
