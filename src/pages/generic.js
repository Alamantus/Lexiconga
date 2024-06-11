const marked = require('marked');
const overrides = require('require-overrides');
overrides.set('uhtml', 'uhtml-ssr'); // Replace instances of `uhtml` with `uhtml-ssr` so Node can return strings from the generated html
const { render } = require('uhtml-ssr');

module.exports = (title, description, content) => `<!DOCTYPE html>
<html lang="en">
${render(String, require('../elements/head')(title, description))}
<body class="defaultTheme">
${render(String, require('../elements/body/header')())}
<main>
<article>
${marked.parse(content)}
</article>
</main>
${render(String, require('../elements/body/footer')())}
</body>
</html>`;
