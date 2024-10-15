interface LogoProps {
  fixed?: boolean;
}

const ClimatePolicyRadarLogoWhite = ({ fixed = false }: LogoProps) => {
  return (
    <svg width="240" height="468" viewBox="0 0 240 386" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.1">
        <path
          d="M240 403V433C107.452 433 0 325.548 0 193C0 60.4517 107.452 -47 240 -47V-17C124.02 -17 30 77.0202 30 193C30 308.98 124.02 403 240 403Z"
          fill="white"
        />
        <path
          d="M60 193C60 93.5887 140.589 13 240 13V43C157.157 43 90 110.157 90 193C90 275.843 157.157 343 240 343V373C140.589 373 60 292.411 60 193Z"
          fill="white"
        />
        <path
          d="M240 73C173.726 73 120 126.726 120 193C120 259.274 173.726 313 240 313V283C190.294 283 150 242.706 150 193C150 143.294 190.294 103 240 103V73Z"
          fill="white"
        />
        <path
          d="M180 193C180 159.863 206.863 133 240 133V163C223.431 163 210 176.431 210 193C210 209.569 223.431 223 240 223V253C206.863 253 180 226.137 180 193Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

export default ClimatePolicyRadarLogoWhite;
