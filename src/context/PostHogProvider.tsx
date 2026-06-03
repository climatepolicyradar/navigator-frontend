type TPostHogProviderProps = {
  children: React.ReactNode;
};

// See PostHogInit for the actual PostHog initialisation and page view tracking logic.
export function PostHogProvider({ children }: TPostHogProviderProps) {
  return <>{children}</>;
}

/** @see: https://posthog.com/docs/product-analytics/best-practices#2-implement-a-naming-convention */
type Category = "search";
type Object = "results";
type Action = "fetch";

export function posthogEventName(category: Category, object: Object, action: Action) {
  return `${category}:${object}_${action}`;
}
