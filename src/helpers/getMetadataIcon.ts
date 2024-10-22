import { Globe, Building2, FileText, DollarSign, Building, Calendar, Scroll, Hourglass, Link, Layers } from "lucide-react";

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

export const getIcon = (iconName) => {
  return metadataIcons[iconName];
};
