const fastify = require("fastify")({ logger: true });
const path = require("path");
const fastifyStatic = require("@fastify/static");

// dist = estilos generados
fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "dist"),
    prefix: "/dist/",
    decorateReply: false, // para evitar el conflicto con sendFile
});
  
// public = html + js
fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/",
});
  
fastify.get("/", (req, reply) => {
    return reply.sendFile("index.html");
});  

const start = async () => {
  try {
    await fastify.listen({ port: 5173 });
    console.log("🧑‍🎨 Frontend corriendo en http://localhost:5173");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
