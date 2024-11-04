import { FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon } from "@components/svg/Icons";
import { colors } from "@mcf/constants/colors";

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
