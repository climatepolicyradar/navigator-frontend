export const joinTailwindClasses = (...parts: (string | false | undefined)[]) =>
  parts
    .map((part) => (part || "").trim())
    .filter((part) => part)
    .join(" ");
