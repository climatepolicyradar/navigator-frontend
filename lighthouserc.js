module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/", "http://localhost:3000/search"],
      startServerCommand: "npm run start",
    },
    upload: {
      target: "lhci",
      serverBaseUrl: "http://ec2-54-217-16-2.eu-west-1.compute.amazonaws.com:9001/",
      token: "b68259a3-808c-4c71-84c0-ae91a43e0d9d",
    },
  },
};
