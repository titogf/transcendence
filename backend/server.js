const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const fastifyMultipart = require('@fastify/multipart');
const fastify = require("fastify")({
  logger: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
  },
});
require('dotenv').config();

const authRoutes = require('./routes/auth');

fastify.register(require('@fastify/cors'), {
  origin: [
    'https://localhost:5173',
    'https://127.0.0.1:5173'
  ],
  credentials: true
});

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

fastify.register(fastifyMultipart);

fastify.post('/upload-avatar', async function (req, reply) {
  const data = await req.file();

  if (!data || data.mimetype !== 'image/png') {
    return reply.code(400).send({ error: 'Only PNG images are allowed' });
  }

  const avatarsDir = path.join(__dirname, 'frontend/public/avatars');

  await fse.ensureDir(avatarsDir);

  const files = await fs.promises.readdir(avatarsDir);
  const numbers = files
    .map(f => parseInt(path.parse(f).name))
    .filter(n => !isNaN(n));
  const nextIndex = numbers.length ? Math.max(...numbers) + 1 : 0;
  const filename = `${nextIndex}.png`;

  const filePath = path.join(avatarsDir, filename);
  await fs.promises.writeFile(filePath, await data.toBuffer());

  return reply.send({ success: true, filename });
});

fastify.register(authRoutes, { prefix: '/auth' });

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log(`🚀 Servidor en https://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
