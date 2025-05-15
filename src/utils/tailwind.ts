export const joinTailwindClasses = (...parts: (string | undefined)[]) =>
  parts
    .map((part) => (part || "").trim())
    .filter((part) => part)
    .join(" ");
