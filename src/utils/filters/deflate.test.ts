import { TSearchQueryGroup } from "@/types";

import { deflateFilters, inflateFilters } from "./deflate";

const subdivisionFilters: TSearchQueryGroup = {
  op: "or",
  filters: Array.from({ length: 60 }, (_, i) => ({
    field: "labels.value.id",
    op: "contains",
    value: `subdivision::US-${i}`,
  })),
};

describe("deflateFilters / inflateFilters", () => {
  it("round-trips through raw inflate", () => {
    expect(JSON.parse(inflateFilters(deflateFilters(subdivisionFilters)))).toEqual(subdivisionFilters);
  });

  it("produces unpadded base64url", () => {
    expect(deflateFilters(subdivisionFilters)).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("is much shorter than the JSON it encodes", () => {
    const encoded = deflateFilters(subdivisionFilters);
    expect(encoded.length).toBeLessThan(JSON.stringify(subdivisionFilters).length / 5);
  });

  it("is compatible with the platform's deflate-raw stream", async () => {
    const stream = new Response(JSON.stringify(subdivisionFilters)).body!.pipeThrough(new CompressionStream("deflate-raw"));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    const encoded = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    expect(JSON.parse(inflateFilters(encoded))).toEqual(subdivisionFilters);
  });
});
