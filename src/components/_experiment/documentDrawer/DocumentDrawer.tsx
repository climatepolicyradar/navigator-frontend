import { LucideExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import { SearchDocument } from "@/api/search";
import { Drawer } from "@/components/atoms/drawer/Drawer";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import useConfig from "@/hooks/useConfig";
import { TFamilyPresentationalData } from "@/types";
import { getFamilyMetadata } from "@/utils/family-metadata/getFamilyMetadata";

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
  const { data: { languages = {} } = {} } = useConfig();
  const [familyData, setFamilyData] = useState<TFamilyPresentationalData | null>(null);
  const [fetchedId, setFetchedId] = useState<string | null>(null);

  const importId = document?.id as string | undefined;
  const isLoading = Boolean(importId && importId !== fetchedId);

  useEffect(() => {
    if (!importId) return;
    let cancelled = false;

    fetch(`/api/family/${importId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) {
          setFamilyData(data);
          setFetchedId(importId);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [importId]);

  const metadata = familyData ? getFamilyMetadata(familyData.family, familyData.familyTopics, familyData.countries, familyData.subdivisions) : [];

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={
        document ? (
          linkHref(document) ? (
            <span className="block pt-5">
              <a
                href={linkHref(document)!}
                className="text-3xl text-inky-blue underline-offset-5 hover:underline"
                dangerouslySetInnerHTML={{ __html: document.title }}
              />
            </span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: document.title }} />
          )
        ) : undefined
      }
      titleExtras={
        document && linkHref(document) ? (
          <a target="_blank" href={linkHref(document)!} className="text-neutral-500 hover:text-neutral-800 justify-end">
            <LucideExternalLink width={20} height={20} />
          </a>
        ) : undefined
      }
      wide
    >
      {isLoading && (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-inky-blue" />
        </div>
      )}
      {!isLoading && familyData && (
        <>
          {familyData.family.summary && (
            <TextBlock block="summary" title="Summary" context="drawer-summary">
              <div className="text-content" dangerouslySetInnerHTML={{ __html: familyData.family.summary.replace(/\r?\n/g, "<br/>") }} />
            </TextBlock>
          )}
          {metadata.length > 0 && <MetadataBlock block="metadata" title="About" metadata={metadata} />}
          <DocumentsBlock family={familyData.family} familyTopics={familyData.familyTopics} languages={languages} />
        </>
      )}
    </Drawer>
  );
}
