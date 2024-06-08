// const overrides = require('require-overrides');
// overrides.set('uhtml', 'uhtml-ssr'); // Replace instances of `uhtml` with `uhtml-ssr` so Node can return strings from the generated html
// const { render } = require('uhtml-ssr');
const fs = require('node:fs');
const path = require('node:path');

module.exports = (fastify, options, done) => {
	console.log(path.resolve('./public'));
	fastify.register(require('@fastify/static'), {
		root: path.resolve('./public'),
	});
	
	fastify.get('/', (request, reply) => {
		reply.sendFile('index.html');
	});

	done();
};