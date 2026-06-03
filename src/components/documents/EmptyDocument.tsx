import { BookOpen } from "lucide-react";

import { ExternalLink } from "@/components/ExternalLink";

export const EmptyDocument = () => (
  <div className="ml-4 mt-4 text-center text-gray-700">
    <div className="mb-2 flex justify-center">
      <BookOpen width="24" height="24" />
    </div>
    <p className="mb-2">Document Preview</p>
    <p className="mb-2 text-sm">You’ll soon be able to view the full-text of the document here, along with any English translation.</p>
    <p className="text-sm">
      <ExternalLink className="underline text-blue-600 hover:text-blue-800" url="https://form.jotform.com/233293886694373">
        Sign up here
      </ExternalLink>{" "}
      to be notified when it’s available.
    </p>
  </div>
);
