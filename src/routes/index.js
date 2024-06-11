// const overrides = require('require-overrides');
// overrides.set('uhtml', 'uhtml-ssr'); // Replace instances of `uhtml` with `uhtml-ssr` so Node can return strings from the generated html
// const { render } = require('uhtml-ssr');
const fs = require('node:fs');
const path = require('node:path');

module.exports = (fastify, options, done) => {
	fastify.decorate('files', {});
	fastify.decorate('getFile', (path, generateFile = () => undefined) => {
		if (typeof fastify.files[path] === 'undefined') {
			fastify.files[path] = generateFile();
		}
		return fastify.files[path];
	});
	fastify.decorateReply('sendFile', function (generateFile = () => undefined, path = undefined) {
		if (typeof path === 'undefined') {
			path = this.request.url;
		}
		const file = fastify.getFile(path, generateFile);

		let type = 'text/html';
		const fileExt = path.split('.').pop();
		switch (fileExt) {
			case 'js': {
				type = 'text/javascript';
				break;
			}
			case 'css': {
				type = 'text/css';
				break;
			}
		}
	
		return this.type(type).send(file);
	});

	fastify.register(require('./assets'))
		.register(require('./api'));
	
	done();
};