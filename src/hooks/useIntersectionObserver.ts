import _ from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface IArgs {
  rootMargin: string; // Margins to exclude parts of the screen from "currently visible"
  elementsQuery: string; // Which DOM elements to track on the page
  setActiveId: Dispatch<SetStateAction<string>>;
}

export const useIntersectionObserver = ({ rootMargin, elementsQuery, setActiveId }: IArgs) => {
  const elementEntriesRef = useRef<Record<string, IntersectionObserverEntry>>({}); // Using useRef prevents unnecessary rerenders

  useEffect(() => {
    const matchingElements: Element[] = Array.from(document.querySelectorAll(elementsQuery));

    // Called when elements become / are no longer visible
    const handleVisibilityChanges = (observerEntries: IntersectionObserverEntry[]) => {
      // Update the ref of which elements are currently visible
      elementEntriesRef.current = observerEntries.reduce((map, entry) => {
        map[entry.target.id] = entry;
        return map;
      }, elementEntriesRef.current);

      // Determine which elements are currently visible and preserve their DOM order
      const visibleElements: Element[] = [];
      matchingElements.forEach((element) => {
        const entry = elementEntriesRef.current[element.id];
        if (entry?.isIntersecting) visibleElements.push(element);
      });

      // The element highest up the page is active - set using the given useState setter
      if (visibleElements.length > 0) {
        setActiveId(visibleElements[0].id);
      }
    };

    const observer = new IntersectionObserver(handleVisibilityChanges, { rootMargin });

    // Watch for which elements are currently visible
    matchingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [elementsQuery, rootMargin, setActiveId]);
};
