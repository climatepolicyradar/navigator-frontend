module.exports = {
  ci: {
    assert: {
      preset: "lighthouse:recommended",
    },
    collect: {
      url: ["http://localhost:3000/"],
      startServerCommand: "npm run start",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
