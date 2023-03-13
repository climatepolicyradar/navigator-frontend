export const removeCookiePolicy = () => {
  cy.get('[data-cy="cookie-consent"]').invoke("remove");
};

export const clickCookiePolicy = () => {
  cy.get('[data-cy="cookie-consent-reject"]').click();
};
