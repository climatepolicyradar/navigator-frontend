import { InputLearnMoreLink } from "./InputLearnMoreLink";

type TProps = {
  label?: string;
  checked: boolean;
  name?: string;
  additionalInfo?: string;
  learnMoreUrl?: string;
  learnMoreExternal?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
};

const Radio = ({ checked, onChange, onClick, name }: TProps) => {
  return <input type="radio" checked={checked || false} onChange={onChange} onClick={onClick ?? onClick} className="w-[24px] h-[24px]" name={name} />;
};

export const InputRadio = ({ label, checked, onChange, onClick, name, additionalInfo, learnMoreUrl, learnMoreExternal }: TProps) => {
  return (
    <>
      <label className={`flex gap-2 cursor-pointer ${checked ? "font-medium text-textDark" : ""}`}>
        <Radio checked={checked} onChange={onChange} onClick={onClick} name={name} />
        <span className="flex items-center">{label}</span>
      </label>
      <InputLearnMoreLink additionalInfo={additionalInfo} learnMoreUrl={learnMoreUrl} learnMoreExternal={learnMoreExternal} />
    </>
  );
};
