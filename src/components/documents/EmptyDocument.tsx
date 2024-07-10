import { ExternalLink } from "@components/ExternalLink";
import { BookOpenIcon } from "@components/svg/Icons";

export const EmptyDocument = () => (
  <div className="ml-4 text-center text-gray-600">
    <div className="mb-2 flex justify-center">
      <BookOpenIcon />
    </div>
    <p className="mb-2">Document Preview</p>
    <p className="mb-2 text-sm">You’ll soon be able to view the full-text of the document here, along with any English translation.</p>
    <p className="text-sm">
      <ExternalLink className="underline" url="https://form.jotform.com/233293886694373">
        Sign up here
      </ExternalLink>{" "}
      to be notified when it’s available.
    </p>
  </div>
);
