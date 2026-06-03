import { colors } from "@/mcf/constants/colors";

type TIcon = {
  color?: string;
  height?: string;
  width?: string;
};

const TwitterIcon = ({ color = "currentColor", height = "20", width = "24" }: TIcon) => (
  <svg viewBox="0 0 24 24" fill={color} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z" />
  </svg>
);

const FacebookIcon = ({ color = "currentColor", height = "20", width = "24" }: TIcon) => (
  <svg
    aria-label="Facebook Icon"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedInIcon = ({ color = "currentColor", height = "20", width = "24" }: TIcon) => (
  <svg
    aria-label="LinkedIn Icon"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ color = "currentColor", height = "20", width = "24" }: TIcon) => (
  <svg
    aria-label="Instagram Icon"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const iconColor = colors.mcf.iconColor;

export const multilateralClimateFundSocialMedia = {
  "Adaptation Fund": [
    { url: "https://twitter.com/adaptationfund", icon: <TwitterIcon color={iconColor} /> },
    { url: "https://www.facebook.com/adaptationfund", icon: <FacebookIcon color={iconColor} /> },
    {
      icon: <LinkedInIcon color={iconColor} />,
      url: "https://www.linkedin.com/company/adaptation-fund",
    },
    {
      url: "https://www.instagram.com/adaptationfund/?hl=en",
      icon: <InstagramIcon color={iconColor} />,
    },
  ],
  "Climate Investment Funds": [
    { url: "https://twitter.com/CIF_Action", icon: <TwitterIcon color={iconColor} /> },
    { url: "https://www.facebook.com/CIFaction/", icon: <FacebookIcon color={iconColor} /> },
    { url: "https://www.linkedin.com/company/cifaction", icon: <LinkedInIcon color={iconColor} /> },
    {
      url: "https://www.instagram.com/cif_action/",
      icon: <InstagramIcon color={iconColor} />,
    },
  ],
  "Green Climate Fund": [
    { url: "https://twitter.com/theGCF", icon: <TwitterIcon color={iconColor} /> },
    { url: "https://facebook.com/GCFOfficial", icon: <FacebookIcon color={iconColor} /> },
    {
      url: "https://www.linkedin.com/company/green-climate-fund/",
      icon: <LinkedInIcon color={iconColor} />,
    },
    {
      url: "https://www.instagram.com/greenclimatefund/",
      icon: <InstagramIcon color={iconColor} />,
    },
  ],
  "Global Environment Facility": [
    { url: "https://twitter.com/theGEF", icon: <TwitterIcon color={iconColor} /> },
    { url: "https://www.facebook.com/TheGEF1/", icon: <FacebookIcon color={iconColor} /> },
    {
      url: "https://www.linkedin.com/company/global-environment-facility",
      icon: <LinkedInIcon color={iconColor} />,
    },
    {
      url: "https://www.instagram.com/gef_global_environment/?hl=en",
      icon: <InstagramIcon color={iconColor} />,
    },
  ],
};
