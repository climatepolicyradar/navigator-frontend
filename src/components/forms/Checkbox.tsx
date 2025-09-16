import { InputLearnMoreLink } from "./InputLearnMoreLink";

interface IProps {
  label?: string;
  checked: boolean;
  name?: string;
  additionalInfo?: string;
  learnMoreUrl?: string;
  learnMoreExternal?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBox = ({ checked, onChange, name }: IProps) => {
  return <input type="checkbox" checked={checked || false} onChange={onChange} className="w-[20px] h-[20px]" name={name} />;
};

export const InputCheck = ({ label, checked, onChange, name, additionalInfo, learnMoreUrl, learnMoreExternal, className }: IProps) => {
  return (
    <>
      <label className={`flex gap-2 cursor-pointer ${checked ? "font-medium text-textDark" : ""} ${className}`}>
        <CheckBox checked={checked} onChange={onChange} name={name} />
        <span className="flex items-center">{label}</span>
      </label>
      <InputLearnMoreLink additionalInfo={additionalInfo} learnMoreUrl={learnMoreUrl} learnMoreExternal={learnMoreExternal} />
    </>
  );
};
