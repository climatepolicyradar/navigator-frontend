import { joinTailwindClasses } from "@/utils/tailwind";

const Fingerprint = ({ className = "" }: { className?: string }) => (
  <svg width="150" height="150" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_5_92)">
      <path
        d="M620 0C1172.28 0 1620 447.715 1620 1000C1620 1552.28 1172.28 2000 620 2000C67.7153 2000 -380 1552.28 -380 1000C-380 447.715 67.7153 0 620 0ZM620 110C128.467 110 -270 508.467 -270 1000C-270 1491.53 128.467 1890 620 1890C1111.53 1890 1510 1491.53 1510 1000C1510 508.467 1111.53 110 620 110Z"
        fill="#218cf6"
      />
      <path
        d="M620 240C1039.74 240 1380 580.264 1380 1000C1380 1419.74 1039.74 1760 620 1760C200.264 1760 -140 1419.74 -140 1000C-140 580.264 200.264 240 620 240ZM620 360C266.538 360 -20 646.538 -20 1000C-20 1353.46 266.538 1640 620 1640C973.462 1640 1260 1353.46 1260 1000C1260 646.538 973.462 360 620 360Z"
        fill="#218cf6"
      />
      <path
        d="M620 490C901.665 490 1130 718.335 1130 1000C1130 1281.67 901.665 1510 620 1510C338.335 1510 110 1281.67 110 1000C110 718.335 338.335 490 620 490ZM620 610C404.609 610 230 784.609 230 1000C230 1215.39 404.609 1390 620 1390C835.391 1390 1010 1215.39 1010 1000C1010 784.609 835.391 610 620 610Z"
        fill="#218cf6"
      />
      <path
        d="M620 740C763.594 740 880 856.406 880 1000C880 1143.59 763.594 1260 620 1260C476.406 1260 360 1143.59 360 1000C360 856.406 476.406 740 620 740ZM620 860C542.68 860 480 922.68 480 1000C480 1077.32 542.68 1140 620 1140C697.32 1140 760 1077.32 760 1000C760 922.68 697.32 860 620 860Z"
        fill="#218cf6"
      />
    </g>
    <defs>
      <clipPath id="clip0_5_92">
        <rect width="1000" height="1000" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

interface ClippyProps {
  eyes: "left" | "right";
  positionClasses: string;
}

export const Clippy = ({ eyes, positionClasses }: ClippyProps) => {
  const containerClasses = joinTailwindClasses("relative transition duration-500 ease-in", positionClasses);

  const eyeClasses = joinTailwindClasses(
    "block absolute z-1 w-full leading-20 top-[10%] text-center text-[100px] cursor-default",
    eyes === "right" && "-scale-x-[1]"
  );

  return (
    <div className={containerClasses}>
      <span className={eyeClasses}>👀</span>
      <Fingerprint className="drop-shadow-[5px_5px_15px_rgba(0,0,0,0.4)]" />
    </div>
  );
};
