import { ExternalLink } from "@/components/ExternalLink";

export const Feedback = () => {
  return (
    <div data-cy="feedback" className="bg-cclw-light rounded-3xl p-4">
      <div className="font-medium text-lg">Feedback</div>
      <ul className="list-disc pl-4">
        <li className="mb-2">
          To report a problem, email us at <ExternalLink url="mailto:support@climatepolicyradar.org">support@climatepolicyradar.org</ExternalLink>
        </li>
        <li className="mb-2">
          Spotted missing or inaccurate data? <ExternalLink url="https://form.jotform.com/233294135296359">Let us know</ExternalLink>
        </li>
      </ul>
    </div>
  );
};
