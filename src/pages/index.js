const overrides = require('require-overrides');
overrides.set('uhtml', 'uhtml-ssr'); // Replace instances of `uhtml` with `uhtml-ssr` so Node can return strings from the generated html
const { render } = require('uhtml-ssr');

module.exports = () => `<!DOCTYPE html>
<html lang="en">
${render(String, require('../elements/head')())}
${render(String, require('../elements/body')())}
</html>`;
