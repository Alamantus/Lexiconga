const path = require('path');
const sass = require('sass');
const overrides = require('require-overrides');
overrides.set('uhtml', 'uhtml-ssr'); // Replace instances of `uhtml` with `uhtml-ssr` so Node can return strings from the generated html
const { render } = require('uhtml-ssr');
const HyperExpress = require('hyper-express');
const router = new HyperExpress.Router();

router.get('/', async (request, response) => {
	return response.type('text/html').sendFile(() => {
		return require('../pages/index')();
	});
});

router.get('/help', async (request, response) => {
	return response.type('text/html').sendFile(() => {
		return require('../pages/help')();
	});
});

module.exports = router;

