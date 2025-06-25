export const joinTailwindClasses = (...parts: (string | 0 | false | undefined)[]) =>
  parts
    .map((part) => (part || "").trim())
    .filter((part) => part)
    .join(" ");
