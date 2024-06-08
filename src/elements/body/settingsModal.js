const { html } = require('uhtml');

module.exports = (app) => {
	return html`<dialog id="settingsModal" class="modal" style="display:none;">
		<div class="modal-background" onclick="this.parentElement.style.display='none';"></div>
		<div class="modal-content">
			<a class="close-button" onclick="this.parentElement.parentElement.style.display='none';">&times;&#xFE0E;</a>
			<section>
				<form class="split two">
					<div>
						<h2>General Settings</h2>
						<label>Use IPA Auto-Fill
							<input id="settingsUseIPA" type="checkbox" checked><br />
							<small>Check this to use character combinations to input International Phonetic Alphabet characters into
								Pronunciation fields.</small>
						</label>

						<label>Use Hotkeys
							<input id="settingsUseHotkeys" type="checkbox" checked><br />
							<small>Check this to enable keyboard combinations to perform different helpful actions.</small>
						</label>

						<label>Show Advanced Fields By Default
							<input id="settingsShowAdvanced" type="checkbox"><br />
							<small>Check this to make the advanced fields show on word forms without needing to click the "Show Advanced Fields" button.</small>
						</label>
		
						<label>Default Theme <small>(the theme new dictionaries will use)</small>
							<select id="settingsDefaultTheme">
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

						<h4>Templates for Details Fields</h4>
						<p>Templates created here are saved only to your local browser.</p>
						<label>Saved Templates <a id="createTemplateButton" class="label-button">Create New Template</a>
							<select id="savedDetailsTemplates" class="template-select">
							</select>
						</label>
						<div id="templateFields" style="display:none;">
							<label>Template Name
								<input id="templateNameField"><br />
								<small>If you have chosen a template above, this will overwrite the chosen template.</small>
							</label>
							<label>Template<a class="label-button maximize-button">Maximize</a><br>
								<textarea id="templateTextarea" placeholder="**Era:** 

**Dialect:** 

etc."></textarea>
							</label>
							<a id="saveTemplateButton" class="button">Save Template</a>
							<a id="deleteTemplateButton" class="red button">Delete Template</a>
						</div>
					</div>
					<div>
						<div id="accountActions"></div>
						<div id="accountSettings"></div>
					</div>
				</form>
			</section>
			<footer>
				<a class="button" id="settingsSave">Save</a>
				<a class="button" id="settingsSaveAndClose">Save &amp; Close</a>
				<a class="red button" onclick="this.parentElement.parentElement.parentElement.style.display='none';">Close Without Saving</a>
			</footer>
		</div>
	</dialog>`;
};
