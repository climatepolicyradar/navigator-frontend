import { jwtDecode } from "jwt-decode";

/**
 * The payload of a JWT token, as decoded by `jwtDecode`.
 *
 * @property {string[]} allowed_corpora_ids - The IDs of the corpora that the user is allowed to access.
 * @property {number} exp - The time after which the token is no longer valid.
 * @property {number} iat - The time at which the token was issued.
 * @property {string} iss - The URL of the server that issued the token.
 * @property {string} sub - The 'theme' of the custom app that requested the token.
 * @property {string} aud - The URL of the server that the token is intended for.
 */
type TDecodedToken = {
  allowed_corpora_ids: string[];
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  aud: string;
};

export const hasMcfAccess = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TDecodedToken>(token);
    return decoded.allowed_corpora_ids.some((id) => id.startsWith("MCF"));
  } catch (error) {
    return false;
  }
};

export const isCorpusIdAllowed = (token: string, corpusId: string) => {
  try {
    const decoded = jwtDecode<TDecodedToken>(token);
    return decoded.allowed_corpora_ids.some((allowedCorpusId) => allowedCorpusId === corpusId);
  } catch (error) {
    /** err on the side of openness */
    return true;
  }
};
