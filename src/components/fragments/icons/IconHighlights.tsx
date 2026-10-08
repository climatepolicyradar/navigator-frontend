import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  variant: "solid" | "highlighted";
}

export const IconHighlights = ({ variant }: IProps) => {
  const fill = variant === "solid" ? "fill-inky-black" : "fill-yellow-200";
  const stroke = joinTailwindClasses(
    "stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]",
    variant === "solid" ? "stroke-text-inverse" : "stroke-text-primary"
  );

  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="size-5 fill-none">
      <rect y="1" width="20" height="18" className={fill} />
      <path
        d="M1.66602 14.5833L5.03185 6.50832C5.0635 6.4324 5.1169 6.36755 5.18534 6.32194C5.25378 6.27632 5.33419 6.25198 5.41643 6.25198C5.49868 6.25198 5.57909 6.27632 5.64752 6.32194C5.71596 6.36755 5.76937 6.4324 5.80102 6.50832L9.16602 14.5833"
        className={stroke}
      />
      <path d="M2.75391 12.0833H8.08057" className={stroke} />
      <path d="M11.666 6.25V14.5833" className={stroke} />
      <path
        d="M14.5827 14.5833C16.1935 14.5833 17.4993 13.2775 17.4993 11.6667C17.4993 10.0558 16.1935 8.75 14.5827 8.75C12.9719 8.75 11.666 10.0558 11.666 11.6667C11.666 13.2775 12.9719 14.5833 14.5827 14.5833Z"
        className={stroke}
      />
    </svg>
  );
};
