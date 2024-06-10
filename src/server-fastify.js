require('dotenv').config();

const fastify = require('fastify')()
	.register(require('@fastify/helmet'))
	// .register(require('@fastify/mysql'), {
	// 	connectionString: 'mysql://root@localhost/mysql',
	// })
	.register(require('@fastify/jwt'), {
		secret: process.env.JWT_SECRET,
	})
	.register(require('@fastify/websocket'))
	.register(require('./routes/routes'));

fastify.listen({ port: 3000 }, err => {
  if (err) throw err;
  console.log(`server listening on http://localhost:${fastify.server.address().port}`);
});
