import { Icon } from "@components/icon/Icon";

const LandingPageLinks = ({ handleLinkClick }) => {
  const terms = ["Adaptation strategy", "Energy prices", "Flood defence", "Just transition"];
  return (
    <section>
      <div className="md:flex text-white">
        <div className="md:mr-12">
          <Icon name="eye" />
        </div>
        <div>
          <div className="font-medium text-2xl">Try these searches</div>
          <ul className="text-lg mt-4">
            {terms.map((term) => (
              <li className="my-2" key={term}>
                <a
                  className="text-white hover:text-blue-200 hover:underline"
                  href="/"
                  onClick={(e) => {
                    handleLinkClick(e);
                  }}
                >
                  {term}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
export default LandingPageLinks;
