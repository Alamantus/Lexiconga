const marked = require('marked');
const overrides = require('require-overrides');
overrides.set('uhtml', 'uhtml-ssr'); // Replace instances of `uhtml` with `uhtml-ssr` so Node can return strings from the generated html
const { render } = require('uhtml-ssr');

module.exports = (pageContent) => `<!DOCTYPE html>
<html lang="en">
${render(String, require('../elements/head')(`Help | ${process.env.APP_NAME}`))}
<body class="defaultTheme">
${render(String, require('../elements/body/header')())}
<main>
<article>
${marked.parse(pageContent)}
</article>
</main>
${render(String, require('../elements/body/footer')())}
</body>
</html>`;
