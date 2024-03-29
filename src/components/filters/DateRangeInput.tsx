interface DateRangeInputProps {
  label: string;
  name: string;
  value: string | number;
  max: number;
  min: number;
  handleSubmit(updatedDate: number, name: string): void;
  handleChange(value: number): void;
}
const DateRangeInput = ({ label, name, value, handleSubmit, handleChange }: DateRangeInputProps) => {
  const onBlur = () => {
    handleSubmit(Number(value), name);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(Number(value), name);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          type="number"
          className="border border-gray-300 mt-2 small outline-none placeholder:text-gray-600"
        />
      </div>
    </div>
  );
};
export default DateRangeInput;
