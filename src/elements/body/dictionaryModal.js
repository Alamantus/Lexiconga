const { html } = require('uhtml');

module.exports = (app) => {
	return html`<dialog id="editModal" class="modal" style="display:none;">
		<div class="modal-background" onclick="this.parentElement.style.display='none';"></div>
		<div class="modal-content">
			<a class="close-button" onclick="this.parentElement.parentElement.style.display='none';">&times;&#xFE0E;</a>
			<nav class="tabs">
				<ul>
					<li class="active">Description</li><li>Details</li><li>Settings</li><li>Actions</li>
				</ul>
			</nav>
			<section id="editDescriptionTab">
				<label>Name<br>
					<input id="editName" maxlength="50">
					<small>Won't update if left blank.</small>
				</label>
				<label>Specification<br>
					<input id="editSpecification" maxlength="50">
					<small>Won't update if left blank.</small>
				</label>
				<label>Description<a class="label-button maximize-button">Maximize</a><br>
					<textarea id="editDescription"></textarea>
				</label>
			</section>

			<section id="editDetailsTab" style="display:none;">
				<label>Parts of Speech <small>(Comma Separated List)</small><br>
					<input id="editPartsOfSpeech" maxlength="2500" placeholder="Noun,Adjective,Verb">
				</label>
				<label>Alphabetical Order <small>(Space Separated List)</small><br>
					<input id="editAlphabeticalOrder" placeholder="a A b B c C d D ...">
					<a class="label-help-button" onclick="alert('Include every letter and case! Any letters used in your words that are not specified will be sorted in the default order below your alphabetically custom-sorted words.\n\nLexiconga can only sort by single characters and will sort by the words AS ENTERED, not using orthographic translation.')">
						Field Info
					</a>&nbsp;
					<small>Leave blank for default (case-insensitive ASCII/Unicode sorting)</small>
				</label>
				<h2>Phonology</h2>
				<div class="split three">
					<div>
						<label>Consonants<br>
							<small>(Space separated list)</small><br>
							<input id="editConsonants" class="ipa-field" maxlength="100" placeholder="p b m n t ..."><br>
							<a class="label-help-button ipa-field-help-button">Field Help</a>
							<a class="label-button ipa-table-button">IPA Chart</a>
						</label>
					</div>
					<div>
						<label>Vowels<br>
							<small>(Space separated list)</small><br>
							<input id="editVowels" class="ipa-field" maxlength="100" placeholder="æ u e ɪ ..."><br>
							<a class="label-help-button ipa-field-help-button">Field Help</a>
							<a class="label-button ipa-table-button">IPA Chart</a>
						</label>
					</div>
					<div>
						<label>Polyphthongs&nbsp;/ Blends<br>
							<small>(Space separated list)</small><br>
							<input id="editBlends" class="ipa-field" maxlength="100" placeholder="ai ou ue ..."><br>
							<a class="label-help-button ipa-field-help-button">Field Help</a>
							<a class="label-button ipa-table-button">IPA Chart</a>
						</label>
					</div>
				</div>
				<label>Notes <small>(Markdown-enabled)</small><a class="label-button maximize-button">Maximize</a><br>
					<textarea id="editPhonologyNotes"></textarea>
				</label>
				<h2>Phonotactics</h2>
				<div class="split three">
					<div>
						<label>Onset<br>
							<small>(Comma separated list)</small><br>
							<input id="editOnset" maxlength="100" placeholder="Consonants,Vowels">
						</label>
					</div>
					<div>
						<label>Nucleus<br>
							<small>(Comma separated list)</small><br>
							<input id="editNucleus" maxlength="100" placeholder="Vowels,Blends">
						</label>
					</div>
					<div>
						<label>Coda<br>
							<small>(Comma separated list)</small><br>
							<input id="editCoda" maxlength="100" placeholder="Any">
						</label>
					</div>
				</div>
				<label>Notes <small>(Markdown-enabled)</small><a class="label-button maximize-button">Maximize</a><br>
					<textarea id="editPhonotacticsNotes"></textarea>
				</label>
				<h2>Orthography</h2>
				<label>Translations <small>(One translation per line)</small><a class="label-button maximize-button">Maximize</a><br>
					<textarea id="editTranslations" placeholder="ai=I
AA=ay
ou=ow"></textarea>
					<small>Use format: <code>sequence=replacement</code></small><br>
					<small>Translations occur in the order specified here, so try to avoid double translations!</small>
				</label>
				<label>Notes <small>(Markdown-enabled)</small><a class="label-button maximize-button">Maximize</a><br>
					<textarea id="editOrthography"></textarea>
				</label>
				<h2>Grammar</h2>
				<label>Notes <small>(Markdown-enabled)</small><a class="label-button maximize-button">Maximize</a><br>
					<textarea id="editGrammar"></textarea>
				</label>
			</section>

			<section id="editSettingsTab" style="display:none;">
				<label>Prevent Duplicate Words
					<input type="checkbox" id="editPreventDuplicates"><br>
					<small>Checking this box will prevent the creation of words with the exact same spelling.</small>
				</label>
				<label>Words are Case-Sensitive
					<input type="checkbox" id="editCaseSensitive"><br>
					<small>Checking this box will allow the creation of words with the exact same spelling if their capitalization is different.</small>
				</label>
				<label>Sort by Definition
					<input type="checkbox" id="editSortByDefinition"><br>
					<small>Checking this box will sort the words in alphabetical order based on the Definition instead of the Word.</small>
				</label>
				<label>Theme
					<select id="editTheme">
						<option value="default">Default</option>
						<option value="dark">Dark</option>
						<option value="light">Light</option>
						<option value="blue">Blue</option>
						<option value="green">Green</option>
						<option value="yellow">Yellow</option>
						<option value="red">Red</option>
						<option value="royal">Royal</option>
						<option value="mint">Mint</option>
						<option value="grape">Grape</option>
					</select>
				</label>
				<label>Custom Styling <small>(CSS Only)</small><a class="label-button maximize-button">Maximize</a><br>
					<textarea id="editCustomCSS" placeholder=".orthographic-translation {font-family: serif;}"></textarea>
				</label>
			</section>

			<section id="editActionsTab" style="display:none;">
				<h2>Import&nbsp;/ Export</h2>
				<div class="split two">
					<div>
						<p>
							<label class="button">Import JSON <input type="file" id="importDictionaryFile" accept="application/json, .dict"><br>
								<small>Import a previously-exported <code>JSON</code> file.</small>
							</label>
						</p>
						<p>
							<label class="button">Import Words <input type="file" id="importWordsCSV" accept="text/csv, .csv"><br>
								<small>Import a CSV file of words.</small>
							</label>
							<a class="small button" download="Lexiconga_import-template.csv" href="data:text/csv;charset=utf-8,%22word%22,%22pronunciation%22,%22part of speech%22,%22definition%22,%22explanation%22,%22etymology %28comma-separated%29%22,%22related words %28comma-separated%29%22,%22principal parts %28comma-separated%29%22%0A">Download an example file with the correct formatting</a>
						</p>
					</div>
					<div>
						<p>
							<a class="button" id="exportDictionaryButton">Export JSON</a><br>
							<small>Export your work as a <code>JSON</code> file to re-import later.</small>
						</p>
						<p>
							<a class="button" id="exportWordsButton">Export Words</a><br>
							<small>Export a CSV file of your words.</small>
						</p>
					</div>
				</div>
				<p>
					<a class="red button" id="deleteDictionaryButton">Delete Dictionary</a><br>
					<small>This will permanently delete your current dictionary, and it will not be possible to return it if you have not backed it up!</small>
				</p>
			</section>

			<footer>
				<a class="button" id="editSave">Save</a>
				<a class="button" id="editSaveAndClose">Save &amp; Close</a>
				<a class="red button" onclick="this.parentElement.parentElement.parentElement.style.display='none';">Close Without Saving</a>
			</footer>
		</div>
	</dialog>`;
};
