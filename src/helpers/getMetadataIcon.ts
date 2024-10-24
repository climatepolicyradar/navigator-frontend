// import { Globe, Building2, FileText, DollarSign, Building, Calendar, Scroll, Hourglass, Link, Layers } from "lucide-react";

import {
  LuBuilding as Building,
  LuGlobe as Globe,
  LuBuilding2 as Building2,
  LuFileText as FileText,
  LuDollarSign as DollarSign,
  LuCalendar as Calendar,
  LuScroll as Scroll,
  LuHourglass as Hourglass,
  LuLink as Link,
  LuLayers as Layers,
} from "react-icons/lu";

const metadataIcons = {
  Calendar,
  FileText,
  Globe,
  Building,
  Building2,
  DollarSign,
  Scroll,
  Hourglass,
  Link,
  Layers,
};

export const getIcon = (iconName: string) => {
  return metadataIcons[iconName];
};
