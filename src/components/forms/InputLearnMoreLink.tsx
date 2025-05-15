interface IProps {
  additionalInfo?: string;
  learnMoreUrl?: string;
  learnMoreExternal?: boolean;
}

export const InputLearnMoreLink = ({ additionalInfo, learnMoreUrl, learnMoreExternal }: IProps) => {
  if (!additionalInfo) return null;

  return (
    <p className="ml-[24px] pl-2 opacity-80">
      {additionalInfo}{" "}
      {learnMoreUrl && (
        <a href={learnMoreUrl} target={learnMoreExternal ? "_blank" : ""} className="text-textNormal italic underline" rel="noreferrer">
          Learn more
        </a>
      )}
    </p>
  );
};
