/**
 * Mock backend — the carrier / business the signed-in user belongs to.
 *
 * Backend side of the mockup. The frontend reaches this through
 * `lib/api/home.ts`, never directly.
 */
export type Company = {
  id: string;
  name: string;
  /** Monogram used as a logo placeholder until a real logo asset exists. */
  monogram: string;
};

export const company: Company = {
  id: "org-transformer",
  name: "Transformer Logistics",
  monogram: "TL",
};
