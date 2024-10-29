type TProps = {
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckBox = ({ checked, onChange }: TProps) => {
  return <input type="checkbox" checked={checked || false} onChange={onChange} className="w-[24px] h-[24px]" />;
};

export const InputCheck = ({ label, checked, onChange }: TProps) => {
  return (
    <label className={`flex gap-2 cursor-pointer ${checked ? "font-medium text-textDark" : ""}`}>
      <CheckBox checked={checked} onChange={onChange} />
      <span className="flex items-center">{label}</span>
    </label>
  );
};
