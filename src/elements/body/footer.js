const { html } = require('uhtml');

module.exports = (app) => {
	return html`<footer id="bottom">
		<a href="${process.env.SUPPORT_LINK}" target="_blank" rel="noopener" class="small button">Support ${process.env.APP_NAME}</a>
		<a href="https://blog.${process.env.APP_DOMAIN}" target="_blank" rel="noopener" class="small button">Blog</a>
		<a href="${process.env.REPOSITORY_LINK}/issues" target="_blank" rel="noopener" class="small button">Issues</a>
		<a href="${process.env.REPOSITORY_LINK}/releases" target="_blank" rel="noopener" class="small button">Updates</a>
		<span class="separator">|</span>
		<a class="button" href="/help">Help</a>
		<a class="button" href="/terms">Terms</a>
		<a class="button" href="/privacy">Privacy</a>
	</footer>`;
};
