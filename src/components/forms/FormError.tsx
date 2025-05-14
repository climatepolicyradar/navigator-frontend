interface IProps {
  message: string;
}

export const FormError = ({ message }: IProps) => {
  return <div className="error text-red-600">{message}</div>;
};
