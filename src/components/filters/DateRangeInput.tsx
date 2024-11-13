import { InputListContainer } from "./InputListContainer";

type TProps = {
  label: string;
  name: string;
  value: string;
  handleSubmit(updatedDate: string, name: string): void;
  handleChange(value: string): void;
};

export const DateRangeInput = ({ label, name, value, handleSubmit, handleChange }: TProps) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(value, name);
    }
  };

  return (
    <InputListContainer>
      <label>{label}</label>
      <input name={name} value={value} onChange={(e) => handleChange(e.target.value)} onKeyDown={onKeyDown} type="text" className="w-full" />
    </InputListContainer>
  );
};
