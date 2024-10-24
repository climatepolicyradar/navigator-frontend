type TProps = {
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
};

const Radio = ({ checked, onChange, onClick }: TProps) => {
  return <input type="radio" checked={checked || false} onChange={onChange} onClick={onClick ?? onClick} className="w-[24px] h-[24px]" />;
};

export const InputRadio = ({ label, checked, onChange, onClick }: TProps) => {
  return (
    <label className={`flex gap-2 cursor-pointer ${checked ? "font-medium text-textDark" : ""}`}>
      <Radio checked={checked} onChange={onChange} onClick={onClick} />
      <span className="flex items-center">{label}</span>
    </label>
  );
};
