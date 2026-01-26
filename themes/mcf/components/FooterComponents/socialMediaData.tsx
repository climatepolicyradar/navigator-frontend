import { Icon } from "@/components/atoms/icon/Icon";
import { colors } from "@/mcf/constants/colors";

const iconColor = colors.mcf.iconColor;

export const multilateralClimateFundSocialMedia = {
  "Adaptation Fund": [
    { url: "https://twitter.com/adaptationfund", icon: <Icon name="twitter" color={iconColor} /> },
    { url: "https://www.facebook.com/adaptationfund", icon: <Icon name="facebook" color={iconColor} /> },
    {
      icon: <Icon name="linkedIn" color={iconColor} />,
      url: "https://www.linkedin.com/company/adaptation-fund",
    },
    {
      url: "https://www.instagram.com/adaptationfund/?hl=en",
      icon: <Icon name="instagram" color={iconColor} />,
    },
  ],
  "Climate Investment Funds": [
    { url: "https://twitter.com/CIF_Action", icon: <Icon name="twitter" color={iconColor} /> },
    { url: "https://www.facebook.com/CIFaction/", icon: <Icon name="facebook" color={iconColor} /> },
    { url: "https://www.linkedin.com/company/cifaction", icon: <Icon name="linkedIn" color={iconColor} /> },
    {
      url: "https://www.instagram.com/cif_action/",
      icon: <Icon name="instagram" color={iconColor} />,
    },
  ],
  "Green Climate Fund": [
    { url: "https://twitter.com/theGCF", icon: <Icon name="twitter" color={iconColor} /> },
    { url: "https://facebook.com/GCFOfficial", icon: <Icon name="facebook" color={iconColor} /> },
    {
      url: "https://www.linkedin.com/company/green-climate-fund/",
      icon: <Icon name="linkedIn" color={iconColor} />,
    },
    {
      url: "https://www.instagram.com/greenclimatefund/",
      icon: <Icon name="instagram" color={iconColor} />,
    },
  ],
  "Global Environment Facility": [
    { url: "https://twitter.com/theGEF", icon: <Icon name="twitter" color={iconColor} /> },
    { url: "https://www.facebook.com/TheGEF1/", icon: <Icon name="facebook" color={iconColor} /> },
    {
      url: "https://www.linkedin.com/company/global-environment-facility",
      icon: <Icon name="linkedIn" color={iconColor} />,
    },
    {
      url: "https://www.instagram.com/gef_global_environment/?hl=en",
      icon: <Icon name="instagram" color={iconColor} />,
    },
  ],
};
