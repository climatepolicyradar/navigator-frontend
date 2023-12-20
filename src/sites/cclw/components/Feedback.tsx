import { ExternalLink } from "@components/ExternalLink";

export const Feedback = () => {
  return (
    <div data-cy="feedback" className="bg-[#414469] rounded-3xl p-4">
      <div className="font-bold text-lg">Feedback</div>
      <ul className="list-disc pl-4">
        <li className="mb-2">
          To report a problem email us at <ExternalLink url="mailto:support@climatepolicyradar.org">support@climatepolicyradar.org</ExternalLink>
        </li>
        <li className="mb-2">
          Spotted missing or inaccurate data?{" "}
          <ExternalLink url="https://docs.google.com/forms/d/e/1FAIpQLScNy6pZTInQKdxNDaZPKyPGgbfRktstzgVDjGBCeTnLVzl3Pg/viewform">
            Let us know
          </ExternalLink>
        </li>
      </ul>
    </div>
  );
};
