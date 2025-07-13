const fs = require("fs");
const path = require("path");

const fastify = require("fastify")({
  logger: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
  },
});

const fastifyStatic = require("@fastify/static");

fastify.addHook("onSend", async (request, reply, payload) => {
  reply.header("Cross-Origin-Opener-Policy", "unsafe-none");
  reply.header("Cross-Origin-Embedder-Policy", "unsafe-none");
  return payload;
});

// dist = estilos generados
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "dist"),
  prefix: "/dist/",
  decorateReply: false,
});

// public = html + js
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

// ruta principal
fastify.get("/", (req, reply) => {
  return reply.sendFile("index.html");
});

const start = async () => {
  try {
    await fastify.listen({ port: 5173, host: "0.0.0.0" });
    console.log("🧑‍🎨 Frontend corriendo en https://localhost:5173");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
