const path = require('node:path');
const esbuild = require('esbuild');
const sass = require('sass');
const HyperExpress = require('hyper-express');
const router = new HyperExpress.Router();

router.get('/lexiconga.js', async (request, response) => {
	const filePath = path.join(process.cwd(), '/src/lexiconga.js');
	return response.type('text/javascript').sendFile(() => {
		const build = esbuild.buildSync({
			entryPoints: [filePath],
			sourcemap: false,
			write: false,
			bundle: true,
			minify: true,
			treeShaking: true,
			platform: 'browser',
			format: 'iife',
			target: 'es2015',
		});
		console.log(build);
		const file = build.outputFiles[0];
		return file.contents;
	});
});

router.get('styles.css', async (request, response) => {
	const filePath = path.join(process.cwd(), '/src/styles.scss');
	return response.type('text/css').sendFile(() => {
		const compiledSass = sass.compile(filePath, { style: 'compressed' });
		return compiledSass.css;
	});
});

module.exports = router;

