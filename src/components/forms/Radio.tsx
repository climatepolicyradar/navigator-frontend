type TProps = {
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Radio = ({ checked, onChange }: TProps) => {
  return <input type="radio" checked={checked || false} onChange={onChange} className="w-[24px] h-[24px]" />;
};

export const InputRadio = ({ label, checked, onChange }: TProps) => {
  return (
    <label className={`flex gap-2 items-center cursor-pointer ${checked ? "font-medium text-textDark" : ""}`}>
      <Radio checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
};
