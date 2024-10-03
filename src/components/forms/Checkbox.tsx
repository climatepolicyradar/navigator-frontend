const CheckBox = ({ checked, onChange }) => {
  return <input type="checkbox" checked={checked} onChange={onChange} className="w-[24px] h-[24px]" />;
};

export const InputCheck = ({ label, checked, onChange }) => {
  return (
    <label className={`flex gap-2 items-center cursor-pointer ${checked ? "font-medium text-textDark" : ""}`}>
      <CheckBox checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
};
