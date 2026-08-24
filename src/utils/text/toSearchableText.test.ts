import { toSearchableText } from "./toSearchableText";

describe("toSearchableText: ", () => {
  it("should return an empty string when given an empty string", () => {
    expect(toSearchableText("")).toBe("");
  });

  it("should lowercase the text", () => {
    expect(toSearchableText("HELLO World")).toBe("hello world");
  });

  it("should leave plain ascii text unchanged other than case", () => {
    expect(toSearchableText("Climate Policy Radar")).toBe("climate policy radar");
  });

  it("should remove accents from characters", () => {
    expect(toSearchableText("café")).toBe("cafe");
  });

  it("should remove accents from characters composed of a base letter plus a combining diacritic", () => {
    // "e" (U+0065) followed by a combining acute accent (U+0301), rather than the precomposed "é" (U+00E9)
    expect(toSearchableText("café")).toBe("cafe");
  });

  it("should remove multiple diacritics from a string", () => {
    expect(toSearchableText("Éléphant à Zürich")).toBe("elephant a zurich");
  });

  it("should replace non-decomposable characters that can't be normalized away", () => {
    expect(toSearchableText("Seyðisfjörður")).toBe("seydisfjordur");
    expect(toSearchableText("Øslo")).toBe("oslo");
    expect(toSearchableText("Straße")).toBe("strasse");
  });
});
