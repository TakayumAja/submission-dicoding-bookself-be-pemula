const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello Oi";
    },
  });

  await server.start();
  console.log(`Server running on %s`, server.info.uri);
};

init();
