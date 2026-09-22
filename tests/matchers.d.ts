/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars -- the type parameters and empty body are required for the interface to merge with Vitest's */
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

/*
  Vitest 5 changed its assertion interfaces to `Matchers<R, T>` (R = matcher return type,
  T = received type) and custom matchers must now extend `Matchers` rather than `Assertion`.
  @testing-library/jest-dom v7 still augments the old single-parameter `Assertion<T>`, so the
  matchers registered in tests/setup.ts are invisible to tsc without this.
  Remove once jest-dom ships a Vitest 5 compatible augmentation.
  The type parameters must match Vitest's declaration exactly for the interfaces to merge.
*/
declare module "vitest" {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> extends TestingLibraryMatchers<unknown, R> {}
}
