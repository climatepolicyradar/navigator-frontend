import { ExternalLink } from "@/components/ExternalLink";
import { Heading } from "@/components/typography/Heading";
import { Label } from "@/components/labels/Label";
import { Quote } from "@/components/typography/Quote";

export const ConceptsHead = () => {
  return (
    <div className="mb-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Heading level={2} className="text-base font-medium text-neutral-800">
            Climate concepts
          </Heading>
          <Label>Beta</Label>
        </div>
        <Quote>
          <>
            This feature automatically detects climate concepts in documents. Accuracy is not 100%.{" "}
            <ExternalLink url="https://climatepolicyradar.org/concepts" className="text-gray-600 underline">
              Learn more
            </ExternalLink>
          </>
        </Quote>
      </div>
    </div>
  );
};
