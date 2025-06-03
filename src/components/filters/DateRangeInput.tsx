import { InputListContainer } from "./InputListContainer";

interface IProps {
  label: string;
  name: string;
  value: string;
  handleSubmit(): void;
  handleChange(value: string): void;
}

export const DateRangeInput = ({ label, name, value, handleSubmit, handleChange }: IProps) => {
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <InputListContainer>
      <label>{label}</label>
      <input name={name} value={value} onChange={(e) => handleChange(e.target.value)} onKeyDown={onKeyDown} type="text" className="w-full" />
    </InputListContainer>
  );
};
