const fastify = require('fastify')({ logger: true });
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

fastify.register(require('@fastify/cors'), {
  origin: [
    'https://localhost:5173',
    'https://127.0.0.1:5173'
  ],
  credentials: true
});

fastify.register(authRoutes, { prefix: '/auth' });

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log(`🚀 Servidor en http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
