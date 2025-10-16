import Link from "next/link";

import { Icon } from "@/components/atoms/icon/Icon";

interface IProps {
  unavailableConcepts: string[];
  familySlug: string;
}

export const UnavailableConcepts = ({ unavailableConcepts, familySlug }: IProps) => (
  <div className="border-gray-300 flex flex-col gap-4 flex-1 mt-4 pt-10 border-t text-center text-gray-700 px-4">
    <div className="text-blue-800 flex justify-center items-center">
      <div className="rounded-full bg-blue-50 p-6 mb-2">
        <Icon name="findInDoc" width="48" height="48" />
      </div>
    </div>
    <p className="text-xl font-medium">Topic not in Document</p>
    <p>
      Some topics from your search are not be present in this document but might be present in{" "}
      <Link
        href={`/document/${familySlug}?${unavailableConcepts.map((concept) => `cfn=${concept}`).join("&")}`}
        className="text-blue-600  hover:underline"
      >
        other documents in this entry
      </Link>
      .
    </p>
    <p>
      The following {unavailableConcepts.length > 1 ? "topics are" : "topic is"} not present in this document:
      <p className="font-medium">{unavailableConcepts.join(", ")}</p>
    </p>
  </div>
);
