const getDomain = () => {
  if (process.env.NODE_ENV === "development") {
    return "localhost";
  }
  const { origin } = window.location;
  const domain = origin.split(".").slice(-2).join(".");
  return domain;
};

export default getDomain;
