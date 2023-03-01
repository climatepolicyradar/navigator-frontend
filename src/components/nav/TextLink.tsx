import { LinkWithQuery } from "@components/LinkWithQuery";

const TextLink = ({ children, href = null, onClick = () => {}, target = "_self" }) => {
  return (
    <>
      {href ? (
        <LinkWithQuery
          href={href}
          target={target}
          className="text-blue-500 underline text-sm text-left mt-2 hover:text-indigo-600 transition duration-300"
        >
          {children}
        </LinkWithQuery>
      ) : (
        <button className="text-blue-500 underline text-sm text-left mt-2 hover:text-indigo-600 transition duration-300" onClick={onClick}>
          {children}
        </button>
      )}
    </>
  );
};
export default TextLink;
