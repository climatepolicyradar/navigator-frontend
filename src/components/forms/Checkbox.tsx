import { InputLearnMoreLink } from "./InputLearnMoreLink";

interface IProps {
  label?: string;
  checked: boolean;
  name?: string;
  additionalInfo?: string;
  learnMoreUrl?: string;
  learnMoreExternal?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBox = ({ checked, onChange, name }: IProps) => {
  return <input type="checkbox" checked={checked || false} onChange={onChange} className="w-[16px] h-[16px]" name={name} />;
};

export const InputCheck = ({ label, checked, onChange, name, additionalInfo, learnMoreUrl, learnMoreExternal }: IProps) => {
  return (
    <>
      <label className={`flex gap-2 cursor-pointer ${checked ? "font-medium text-textDark" : ""}`}>
        <CheckBox checked={checked} onChange={onChange} name={name} />
        <span className="flex items-center">{label}</span>
      </label>
      <InputLearnMoreLink additionalInfo={additionalInfo} learnMoreUrl={learnMoreUrl} learnMoreExternal={learnMoreExternal} />
    </>
  );
};
