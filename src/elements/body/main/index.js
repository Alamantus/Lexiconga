const { html } = require('uhtml');
const wordEntries = require('./wordEntries');

module.exports = (app) => {
	return html`<main>
		<aside id="sideColumn">
      <div id="mobileWordFormShow">+</div>
			${require('./wordForm')(app)}
		</aside>

		<section id="mainColumn">
      {{announcements}}

			<!-- This should be its own element too -->
      <section id="detailsSection">
        <h1 id="dictionaryName">Dictionary Name</h1>
        <nav>
          <ul>
            <li>Description</li>
						<li>Details</li>
						<li>Stats</li>
						<li id="editDictionaryButton">Edit</li>
          </ul>
        </nav>
        <article id="detailsPanel" style="display:none;">
          <p>The dictionary details</p>
        </article>
      </section>

			${wordEntries(app)}
      
      <!-- <section class="pagination"></section> -->
    </section>
	</main>`;
};
