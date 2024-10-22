type TProps = {
  message: string;
};

export const FormError = ({ message }: TProps) => {
  return <div className="error text-red-600">{message}</div>;
};
