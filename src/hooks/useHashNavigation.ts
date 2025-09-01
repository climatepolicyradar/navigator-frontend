import { useEffect, useState } from "react";

import { SLIDEOUT_VALUES } from "@/constants/slideOutValues";
import { TSlideOutContent } from "@/context/SlideOutContext";

/**
 * Hook to manage hash-based navigation for slideouts.
 *
 * @returns {Object} Object containing currentSlideOut state and updateHash function.
 * @returns {string} returns.currentSlideOut - The current open slideout identifier.
 * @returns {Function} returns.updateHash - Function to update hash without triggering navigation.
 */
export const useHashNavigation = () => {
  const [currentSlideOut, setCurrentSlideOut] = useState<TSlideOutContent>("");

  // Utility function to update hash without triggering navigation for redirects.
  const updateHash = (hash: string | null) => {
    if (hash) {
      window.location.hash = hash;
    } else {
      // Remove hash if no slideout is open.
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  };

  // Handle URL hash changes for slideout navigation.
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol.
      // Slideout content can contain empty string, so we need to cast to readonly string[] to avoid type errors.
      if (hash && (SLIDEOUT_VALUES as readonly string[]).includes(hash)) {
        setCurrentSlideOut(hash as TSlideOutContent);
      } else if (!hash) {
        setCurrentSlideOut("");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update URL hash when slideout state changes.
  useEffect(() => {
    updateHash(currentSlideOut || null);
  }, [currentSlideOut]);

  return {
    currentSlideOut,
    setCurrentSlideOut,
    updateHash,
  };
};
