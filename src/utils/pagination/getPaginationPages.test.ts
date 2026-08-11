import { getPaginationPages, TPaginationItem } from "./getPaginationPages";

const getEllipsis = (): TPaginationItem => ({ type: "ellipsis" });
const getPage = (page: number): TPaginationItem => ({ type: "page", page });
const getPages = (startingPage: number, count: number) => new Array(count).fill(null).map((_, index) => getPage(index + startingPage));

describe("getPaginationPages", () => {
  describe("narrow", () => {
    it("renders 1/1 pages", () => {
      // [1]
      expect(getPaginationPages(1, 1)).toEqual([getPage(1)]);
    });

    it("renders 5/5 pages", () => {
      // [1] 2 3 4 5
      expect(getPaginationPages(5, 1)).toEqual(getPages(1, 5));
    });

    it("renders 5/8 pages when on the first page", () => {
      // [1] 2 3 . 8
      expect(getPaginationPages(8, 1)).toEqual([...getPages(1, 3), getEllipsis(), getPage(8)]);
    });

    it("renders 5/8 pages when on the second page", () => {
      // 1 [2] 3 . 8
      expect(getPaginationPages(8, 2)).toEqual([...getPages(1, 3), getEllipsis(), getPage(8)]);
    });

    it("renders 5/8 pages when on the middle page", () => {
      // 1 . [4] . 7
      expect(getPaginationPages(7, 4)).toEqual([getPage(1), getEllipsis(), getPage(4), getEllipsis(), getPage(7)]);
    });

    it("renders 5/8 pages when on the second-last page", () => {
      // 1 . 6 [7] 8
      expect(getPaginationPages(8, 7)).toEqual([getPage(1), getEllipsis(), ...getPages(6, 3)]);
    });

    it("renders 5/8 pages when on the last page", () => {
      // 1 . 6 7 [8]
      expect(getPaginationPages(8, 8)).toEqual([getPage(1), getEllipsis(), ...getPages(6, 3)]);
    });
  });

  describe("wide", () => {
    it("renders 11/11 pages", () => {
      // [1] 2 3 4 5 6 7 8 9 A B
      expect(getPaginationPages(11, 1, true)).toEqual(getPages(1, 11));
    });

    it("renders 11/15 pages when on the first page", () => {
      // [1] 2 3 4 5 6 7 8 9 . F
      expect(getPaginationPages(15, 1, true)).toEqual([...getPages(1, 9), getEllipsis(), getPage(15)]);
    });

    it("renders 11/15 pages when on the third page", () => {
      expect(getPaginationPages(15, 3, true)).toEqual([...getPages(1, 9), getEllipsis(), getPage(15)]);
      // 1 2 [3] 4 5 6 7 8 9 . F
    });

    it("renders 11/15 pages when on the middle minus 1 page", () => {
      // 1 . 4 5 6 [7] 8 9 A . F
      expect(getPaginationPages(15, 7, true)).toEqual([getPage(1), getEllipsis(), ...getPages(4, 7), getEllipsis(), getPage(15)]);
    });

    it("renders 11/15 pages when on the middle page", () => {
      // 1 . 5 6 7 [8] 9 A B . F
      expect(getPaginationPages(15, 8, true)).toEqual([getPage(1), getEllipsis(), ...getPages(5, 7), getEllipsis(), getPage(15)]);
    });

    it("renders 11/15 pages when on the middle plus 1 page", () => {
      // 1 . 6 7 8 [9] A B C . F
      expect(getPaginationPages(15, 9, true)).toEqual([getPage(1), getEllipsis(), ...getPages(6, 7), getEllipsis(), getPage(15)]);
    });

    it("renders 11/15 pages when on the fourth last page", () => {
      // 1 . 7 8 9 A [B] C D E F
      expect(getPaginationPages(15, 11, true)).toEqual([getPage(1), getEllipsis(), ...getPages(7, 9)]);
    });

    it("renders 11/15 pages when on the last page", () => {
      // 1 . 7 8 9 A B C D E [F]
      expect(getPaginationPages(15, 15, true)).toEqual([getPage(1), getEllipsis(), ...getPages(7, 9)]);
    });
  });
});
