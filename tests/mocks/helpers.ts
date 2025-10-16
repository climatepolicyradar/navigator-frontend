import router from "next-router-mock";

export const resetPage = () => {
  // clear router state -
  // we store query params in the router state so this resets everything
  router.reset();
  // clear the hash that controls and maintains slideout state
  window.location.hash = "";
};
