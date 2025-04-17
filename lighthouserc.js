module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/", "http://localhost:3000/search"],
      startServerCommand: "npm run start",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
