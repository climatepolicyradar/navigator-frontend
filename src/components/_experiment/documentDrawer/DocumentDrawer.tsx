import { LucideFileText } from "lucide-react";
import { useState } from "react";

import { SearchDocument } from "@/api/search";
import { Drawer } from "@/components/atoms/drawer/DrawerNew";

function linkHref(doc: SearchDocument): string | undefined {
  if (doc.attributes.deprecated_slug)
    if (doc.labels.find((label) => label.value.value === "Principal")) {
      return `/document/${doc.attributes.deprecated_slug}`;
    } else {
      return `/documents/${doc.attributes.deprecated_slug}`;
    }
}

type TDocumentDrawerProps = {
  document: SearchDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DocumentDrawer({ document, open, onOpenChange }: TDocumentDrawerProps) {
  const [nestedDocument, setNestedDocument] = useState<SearchDocument | null>(null);
  const [nestedDrawerOpen, setNestedDrawerOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setNestedDrawerOpen(false);
        onOpenChange(isOpen);
      }}
      title={
        document ? (
          linkHref(document) ? (
            <a href={linkHref(document)!} className="text-inky-blue hover:underline" dangerouslySetInnerHTML={{ __html: document.title }} />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: document.title }} />
          )
        ) : undefined
      }
    >
      {document && (
        <div className="flex flex-col gap-4">
          {document.description && <p className="text-sm highlights" dangerouslySetInnerHTML={{ __html: document.description }} />}
          {document.documents.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">
                Documents in this {document.labels.filter((label) => label.type === "category")[0].value.value} ({document.documents.length})
              </h4>
              <ul className="space-y-1">
                {document.documents.map((rel, i) => (
                  <li key={i}>
                    <button
                      className="text-left w-full text-sm flex items-start gap-2 py-1 hover:text-inky-blue hover:underline"
                      onClick={() => {
                        setNestedDocument(rel.value);
                        setNestedDrawerOpen(true);
                      }}
                    >
                      <LucideFileText width={14} height={14} className="shrink-0 mt-0.5" />
                      <span dangerouslySetInnerHTML={{ __html: rel.value.title }} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {document.labels.map((label, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs bg-neutral-100 rounded px-2 py-1">
                <span className="font-medium">{label.type}:</span> {label.value.value}
              </span>
            ))}
          </div>

          {/* Nested drawer lives inside the parent Popup so Base UI can track nesting */}
          <Drawer
            open={nestedDrawerOpen}
            onOpenChange={setNestedDrawerOpen}
            title={
              nestedDocument ? (
                linkHref(nestedDocument) ? (
                  <a
                    href={linkHref(nestedDocument)!}
                    className="text-inky-blue hover:underline"
                    dangerouslySetInnerHTML={{ __html: nestedDocument.title }}
                  />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: nestedDocument.title }} />
                )
              ) : undefined
            }
          >
            {nestedDocument && (
              <>
                {nestedDocument.description && (
                  <p className="text-sm text-neutral-700 mb-4" dangerouslySetInnerHTML={{ __html: nestedDocument.description }} />
                )}
                <div className="flex flex-wrap gap-1">
                  {nestedDocument.labels.map((label, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-neutral-100 rounded px-2 py-1">
                      <span className="font-medium">{label.type}:</span> {label.value.value}
                    </span>
                  ))}
                </div>
              </>
            )}
          </Drawer>
        </div>
      )}
    </Drawer>
  );
}
