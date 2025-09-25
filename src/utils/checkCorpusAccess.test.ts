import { isCorpusIdAllowed } from "./checkCorpusAccess";

describe("iscorpusIdAllowed", () => {
  const litigationCorpusId = "Academic.corpus.Litigation.n0000";
  const validTokenWithLitigationCorpus =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2NvcnBvcmFfaWRzIjpbIkFjYWRlbWljLmNvcnB1cy5MaXRpZ2F0aW9uLm4wMDAwIiwiQ0NMVy5jb3JwdXMuaTAwMDAwMDAxLm4wMDAwIiwiQ1BSLmNvcnB1cy5Hb2xkc3RhbmRhcmQubjAwMDAiLCJDUFIuY29ycHVzLmkwMDAwMDAwMS5uMDAwMCIsIkNQUi5jb3JwdXMuaTAwMDAwMDAyLm4wMDAwIiwiQ1BSLmNvcnB1cy5pMDAwMDA1ODkubjAwMDAiLCJDUFIuY29ycHVzLmkwMDAwMDU5MS5uMDAwMCIsIkNQUi5jb3JwdXMuaTAwMDAwNTkyLm4wMDAwIiwiTUNGLmNvcnB1cy5BRi5HdWlkYW5jZSIsIk1DRi5jb3JwdXMuQUYubjAwMDAiLCJNQ0YuY29ycHVzLkNJRi5HdWlkYW5jZSIsIk1DRi5jb3JwdXMuQ0lGLm4wMDAwIiwiTUNGLmNvcnB1cy5HQ0YuR3VpZGFuY2UiLCJNQ0YuY29ycHVzLkdDRi5uMDAwMCIsIk1DRi5jb3JwdXMuR0VGLkd1aWRhbmNlIiwiTUNGLmNvcnB1cy5HRUYubjAwMDAiLCJPRVAuY29ycHVzLmkwMDAwMDAwMS5uMDAwMCIsIlVORkNDQy5jb3JwdXMuaTAwMDAwMDAxLm4wMDAwIl0sInN1YiI6IkNDQyIsImF1ZCI6ImxvY2FsaG9zdCIsImlzcyI6IkNsaW1hdGUgUG9saWN5IFJhZGFyIiwiZXhwIjoyMDY5MzA2ODgzLjAsImlhdCI6MTc1Mzc3NDA4M30.oqQ4vND7eW_bhnX5QAR9rLvRwxxbBlgudIZ5ibTDU88";
  const validTokenWithoutLitigationCorpus =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGxvd2VkX2NvcnBvcmFfaWRzIjpbIk1DRi5jb3JwdXMuQUYuR3VpZGFuY2UiLCJNQ0YuY29ycHVzLkFGLm4wMDAwIiwiTUNGLmNvcnB1cy5DSUYuR3VpZGFuY2UiLCJNQ0YuY29ycHVzLkNJRi5uMDAwMCIsIk1DRi5jb3JwdXMuR0NGLkd1aWRhbmNlIiwiTUNGLmNvcnB1cy5HQ0YubjAwMDAiLCJNQ0YuY29ycHVzLkdFRi5HdWlkYW5jZSIsIk1DRi5jb3JwdXMuR0VGLm4wMDAwIl0sInN1YiI6Ik1DRiIsImF1ZCI6ImNsaW1hdGVwcm9qZWN0ZXhwbG9yZXIub3JnIiwiaXNzIjoiQ2xpbWF0ZSBQb2xpY3kgUmFkYXIiLCJleHAiOjIwNjQ1ODQ4OTYuMCwiaWF0IjoxNzQ5MDUyMDk2fQ.9-slli1XQEkkMgZ03z902rjNThuGaXzbKAbRe6d3jic";
  const invalidToken = "unhappy.token";

  const testCases = [
    { token: validTokenWithLitigationCorpus, isValid: true },
    { token: validTokenWithoutLitigationCorpus, isValid: false },
    /** on error - we want to be more open than restrictive */
    { token: invalidToken, isValid: true },
  ];

  test.each(testCases)("$token is $isValid", ({ token, isValid }) => {
    expect(isCorpusIdAllowed(token, litigationCorpusId)).toBe(isValid);
  });
});
