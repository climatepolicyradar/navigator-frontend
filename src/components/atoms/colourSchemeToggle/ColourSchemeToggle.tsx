import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { COLOUR_SCHEME_STORAGE_KEY } from "@/constants/colourScheme";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";
import { joinTailwindClasses } from "@/utils/tailwind";

type TProps = {
  className?: string;
};

const noopSubscribe = () => () => {};

const isDarkModeEnabled = () => getFeatureFlags(getAllCookies())["dark-mode"];

// Initial `dark` class is set in _document.tsx
const subscribeToColourScheme = (callback: () => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

const getIsDark = () => document.documentElement.classList.contains("dark");

const setColourScheme = (isDark: boolean) => {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem(COLOUR_SCHEME_STORAGE_KEY, isDark ? "dark" : "light");
};

export const ColourSchemeToggle = ({ className }: TProps) => {
  const enabled = useSyncExternalStore(noopSubscribe, isDarkModeEnabled, () => false);
  const isDark = useSyncExternalStore(subscribeToColourScheme, getIsDark, () => false);

  const allClasses = joinTailwindClasses("p-2 rounded-md text-text-brand hover:bg-bg-flat", className);

  if (!enabled) return null;

  return (
    <BaseToggle className={allClasses} pressed={isDark} onPressedChange={setColourScheme} aria-label="Dark mode">
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </BaseToggle>
  );
};
