import { useState, useEffect } from "react";
import { hasMcfAccess } from "@/utils/checkCorpusAccess";
import { config } from "../config";

export const useMcfData = () => {
  const [showMcf, setShowMcf] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setShowMcf(hasMcfAccess(config.appToken));
    };
    checkAccess();
  }, []);

  return showMcf;
};
