import Link from "next/link";

import { DocumentsIcon, DocumentMagnifyIcon, Translation, ExternalLinkIcon } from "@components/svg/Icons";

const heroLinkClasses = "text-white hover:text-white flex items-center gap-1";

const INSTRUCTIONS = [
  {
    content: (
      <ul>
        <li>
          <Link href="/search?c=Policies" className={heroLinkClasses}>
            3923 policies <ExternalLinkIcon height="16" width="16" />
          </Link>
        </li>
        <li>
          <Link href="?c=UNFCCC" className={heroLinkClasses}>
            240 UNFCCC submissions <ExternalLinkIcon height="16" width="16" />
          </Link>
        </li>
      </ul>
    ),
    icon: <DocumentsIcon height="24" width="24" />,
    cy: "feature-documents",
  },
  {
    content: <p>See exact matches and related phrases highlighted in the text</p>,
    icon: <DocumentMagnifyIcon height="24" width="24" />,
    cy: "feature-highlights",
  },
  {
    content: <p>Access English translations of document passages</p>,
    icon: <Translation height="24" width="24" />,
    cy: "feature-translations",
  },
];

const Instructions = () => {
  return (
    <div className="max-w-[820px] mx-auto relative">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
        {INSTRUCTIONS.map((instruction, index) => (
          <div key={index} className="p-4 flex gap-4 items-center bg-cclw-light" data-cy={instruction.cy}>
            <div className="flex items-center justify-center">{instruction.icon}</div>
            <div>{instruction.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Instructions;
