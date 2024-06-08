const { html } = require('uhtml');

module.exports = (app) => {
	return html`<div>
		<input id="openSearchModal" title="Open Search Panel" placeholder="🔍&#xFE0E; Search"> <span id="searchResults"></span>
		<dialog id="searchModal" class="modal" style="display:none;">
			<div class="modal-background" onclick="this.parentElement.style.display='none';"></div>
			<div class="modal-content">
				<a class="close-button" onclick="this.parentElement.parentElement.style.display='none';">&times;&#xFE0E;</a>
				<section>
					<label>Search Term
						<input id="searchBox" placeholder="Search term">
					</label>
					<a id="searchButton" class="small button">Search</a>
					<a id="clearSearchButton" class="small red button">Clear</a>
					<a class="small button" onclick="var options=document.getElementById('searchOptions').style;options.display=options.display=='block'?'none':'block';">
						Toggle Options
					</a>
				</section>
				<footer id="searchOptions" style="display:none;">
					<div class="split">
						<div class="quarter category">
							<h3>Search For</h3>
						</div>
						<div class="three-quarter options">
							<label>Case-Sensitive
								<input type="checkbox" id="searchCaseSensitive">
							</label>
							<label>Ignore Diacritics/Accents
								<input type="checkbox" id="searchIgnoreDiacritics">
							</label>
							<label>Exact Words
								<input type="checkbox" id="searchExactWords">
							</label>
							<label>Translations
								<input type="checkbox" id="searchOrthography">
							</label>
						</div>
					</div>
					<div class="split">
						<div class="quarter category">
							<h3>Include in Search</h3>
						</div>
						<div class="three-quarter options">
							<label>Word Name
								<input type="checkbox" checked id="searchIncludeName">
							</label>
							<label>Definition
								<input type="checkbox" checked id="searchIncludeDefinition">
							</label>
							<label>Details
								<input type="checkbox" checked id="searchIncludeDetails">
							</label>
						</div>
					</div>
					<div class="split">
						<div class="quarter category">
							<h3>Include Only</h3>
						</div>
						<div class="three-quarter options" id="searchPartsOfSpeech"></div>
					</div>
				</footer>
			</div>
		</dialog>
	</div>`;
};
