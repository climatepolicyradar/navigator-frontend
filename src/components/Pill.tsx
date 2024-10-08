interface PillProps {
  text: string;
}

const Pill = ({ text }: PillProps) => {
  return <span className="bg-blue-500 uppercase text-xs font-medium py-2 px-4 text-white rounded-2xl">{text}</span>;
};
export default Pill;
