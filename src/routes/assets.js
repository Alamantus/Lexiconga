const path = require('node:path');
const esbuild = require('esbuild');
const sass = require('sass');
const { minifyHTMLLiterals, defaultShouldMinify } = require('minify-html-literals');

// require('require-overrides').set('uhtml', 'uhtml-ssr'); // Replace instances of `uhtml` with `uhtml-ssr` so Node can return strings from the generated html
// const { render } = require('uhtml-ssr');

module.exports = (fastify, options, done) => {

	fastify.get('/', async (request, reply) => {
		return reply.sendFile(() => require('../pages/index')(), 'index.html');
	});

	fastify.get('/index.html', async (request, reply) => {
		return reply.sendFile(() => require('../pages/index')(), 'index.html');
	});

	fastify.get('/offline.html', async (request, reply) => {
		return reply.sendFile(() => require('../pages/offline')(), 'index.html');
	});

	fastify.get('/help.html', async (request, reply) => {
		return reply.sendFile(() => require('../pages/help')());
	});

	fastify.get('/privacy.html', async (request, reply) => {
		return reply.sendFile(() => require('../pages/privacy')());
	});

	fastify.get('/terms.html', async (request, reply) => {
		return reply.sendFile(() => require('../pages/terms')());
	});
	
	fastify.get('/lexiconga.js', (request, reply) => {
		const { isProd } = fastify;
		const filePath = path.join(process.cwd(), '/src/lexiconga.js');

		reply.sendFile(() => {
			const build = esbuild.buildSync({
				entryPoints: [filePath],
				sourcemap: !isProd,
				write: false,
				bundle: true,
				minify: isProd,
				treeShaking: true,
				platform: 'browser',
				format: 'iife',
				target: 'es2015',
			});
			
			const { text } = build.outputFiles[0];
			
			if (isProd) {
				const final = minifyHTMLLiterals(text, {
					minifyOptions: {
						collapseWhitespace: true,
						conservativeCollapse: true,
						collapseInlineTagWhitespace: true,
						decodeEntities: true,
						removeAttributeQuotes: true,
						continueOnParseError: true,
						removeComments: true,
						removeEmptyAttributes: true,
						removeRedundantAttributes: true,
					},
					shouldMinify(template) {
						return (
							defaultShouldMinify(template) ||
							template.parts.some(part => {
								return part.text.includes('<!DOCTYPE html>');
							})
						);
					},
				});

				if (final && typeof final.code !== 'undefined') {
					return final.code;
				}
			}

			return text;
		});
	});

	fastify.get('/styles.css', (request, reply) => {
		const { isProd } = fastify;
		const filePath = path.join(process.cwd(), '/src/styles.scss');

		return reply.sendFile(() => {
			const compiledSass = sass.compile(filePath, {
				style: isProd ? 'compressed' : 'expanded',
				sourceMap: !isProd,
			});

			return compiledSass.css;
		});
	});

	done();
};
