if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const fastify = require('fastify')();

fastify.decorate('isProd', process.env.NODE_ENV === 'production');

fastify.register(require('@fastify/helmet'))
	// .register(require('@fastify/mysql'), {
	// 	connectionString: 'mysql://root@localhost/mysql',
	// })
	.register(require('@fastify/jwt'), {
		secret: process.env.JWT_SECRET,
	})
	// .register(require('@fastify/websocket'))
	.register(require('./routes'))
;

const port = process.env.APP_PORT ?? 8080;
fastify.listen({ port }, err => {
  if (err) throw err;
  console.log(`server listening on http://localhost:${fastify.server.address().port}`);
});
