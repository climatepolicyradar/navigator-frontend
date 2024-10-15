import { InputListContainer } from "./InputListContainer";

type TProps = {
  label: string;
  name: string;
  value: string | number;
  handleSubmit(updatedDate: number, name: string): void;
  handleChange(value: number): void;
};

export const DateRangeInput = ({ label, name, value, handleSubmit, handleChange }: TProps) => {
  const onBlur = () => {
    handleSubmit(Number(value), name);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(Number(value), name);
    }
  };

  return (
    <InputListContainer>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        type="number"
        className="w-full"
      />
    </InputListContainer>
  );
};
