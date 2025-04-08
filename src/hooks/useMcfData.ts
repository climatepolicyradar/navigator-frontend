import { useState, useEffect } from "react";

import { getEnvFromServer } from "@/api/http-common";
import { hasMcfAccess } from "@/utils/checkCorpusAccess";

export const useMcfData = () => {
  const [showMcf, setShowMcf] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data } = await getEnvFromServer();
      setShowMcf(hasMcfAccess(data?.env?.app_token));
    };
    checkAccess();
  }, []);

  return showMcf;
};
