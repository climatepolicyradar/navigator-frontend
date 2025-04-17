module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/"],
      startServerCommand: "npm run prod",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
