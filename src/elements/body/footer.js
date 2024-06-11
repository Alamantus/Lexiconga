const { html } = require('uhtml');

module.exports = (app) => {
	return html`<footer id="bottom">
		<a href="https://liberapay.com/robbieantenesse" target="_blank" rel="noopener" class="small button">Support Lexiconga</a>
		<a href="https://www.tumblr.com/lexiconga" target="_blank" rel="noopener" class="small button">Blog</a>
		<a href="https://github.com/Alamantus/Lexiconga/issues" target="_blank" rel="noopener" class="small button">Issues</a>
		<a href="https://github.com/Alamantus/Lexiconga/releases" target="_blank" rel="noopener" class="small button">Updates</a>
		<span class="separator">|</span>
		<a class="button" href="/help.html">Help</a>
		<a class="button" href="/terms.html">Terms</a>
		<a class="button" href="/privacy.html">Privacy</a>
	</footer>`;
};
