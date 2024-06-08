const { html } = require('uhtml');

module.exports = (app) => {
	const loading = app?.state?.loading ?? true;
	const words = app?.state?.words ?? [];
	const search = app?.state?.searchTerm?.trim() ?? null;

	return html`<section id="entries">
		${!words.length || search !== null
			? html`<article class="entry">
				<header>
					<h4 class="word">
						${loading ? 'Loading Words' : (
							!search.length ? 'No Words Found' : 'No Search Results'
						)}
					</h4>
				</header>
				<dl>
					<dt class="definition">
						${loading ? 'Please Wait...' : (
							!search.length
								? 'Either this dictionary has not yet been started, or something prevented words from downloading.'
								: 'Edit your search or filter to show words.'
						)}
					</dt>
				</dl>
			</article>`
			: words.map(word => `put require('wordEntry') here!`)
		}
	</section>`;
};
