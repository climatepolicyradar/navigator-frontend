interface IProps {
  size?: string;
}

const Loader = ({ size = "80px" }: IProps) => {
  return (
    <>
      <div className="flex items-start justify-center">
        <object className="radar" type="image/svg+xml" data="/images/radar-loader.svg" style={{ width: size }}></object>
      </div>
    </>
  );
};

export default Loader;
