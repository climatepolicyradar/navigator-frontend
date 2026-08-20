import { documentTransformer } from "@/bff/transformers/documentTransformer";
import { testDocumentDataIn, testDocumentImportId } from "@/mocks/api/documentDataHandlers";
import { testFamilyImportId } from "@/mocks/api/familyDataHandlers";
import { TDataInDocument } from "@/schemas";

const transform = (document: TDataInDocument) => documentTransformer({ document, topicsData: undefined, vespaDocumentData: undefined }, []);

describe("documentTransformer", () => {
  it("returns transformed data for a published document with a parent family", () => {
    const { data, errors } = transform(testDocumentDataIn);

    expect(errors).toEqual([]);
    expect(data.document.import_id).toEqual(testDocumentImportId);
    expect(data.family.import_id).toEqual(testFamilyImportId);
  });

  it("returns null data for a document with a non-displayable status", () => {
    const unpublishedDocument: TDataInDocument = {
      ...testDocumentDataIn,
      attributes: { ...(testDocumentDataIn.attributes as object), status: "created" },
    };

    const { data } = transform(unpublishedDocument);

    expect(data).toBeNull();
  });

  it("returns null data for a document with no parent family", () => {
    const orphanDocument: TDataInDocument = { ...testDocumentDataIn, documents: [] };

    const { data } = transform(orphanDocument);

    expect(data).toBeNull();
  });
});
