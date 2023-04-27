const getDomain = () => {
  if (process.env.NODE_ENV === "development") {
    return "localhost";
  }
  const { hostname } = window.location;
  const domain = hostname.split(".").slice(-2).join(".");
  return domain;
};

export default getDomain;
