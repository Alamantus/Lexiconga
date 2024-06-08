const { html } = require('uhtml');

module.exports = (app) => {
	return html`<form id="wordForm">
		<label>Word<span class="red">*</span><br>
			<input id="wordName" maxlength="200">
		</label>
		<label>Pronunciation<a class="label-button ipa-table-button">IPA Chart</a><br>
			<input id="wordPronunciation" class="ipa-field" maxlength="200"><br>
			<a class="label-help-button ipa-field-help-button">Field Help</a>
		</label>
		<label>Part of Speech<br>
			<select id="wordPartOfSpeech" class="part-of-speech-select"></select>
		</label>
		<label>Definition<span class="red">*</span><br>
			<input id="wordDefinition" maxlength="2500" placeholder="Equivalent words">
		</label>
		<label>Details<span class="red">*</span><a class="label-button maximize-button">Maximize</a><br>
			<textarea id="wordDetails" placeholder="Markdown formatting allowed"></textarea>
		</label>
		<label>
			<a id="expandAdvancedForm" class="small button expand-advanced-form">Show Advanced Fields</a>
		</label>
		<div id="advancedForm" class="advanced-word-form" style="display:none;">
			<label>Details Field Templates
				<select id="templateSelect" class="template-select">
				</select>
				<small>Choose one to fill the details field. (Note: Will erase anything currently there.)</small>
			</label>
			<label>Etymology / Root Words<br>
				<input id="wordEtymology" maxlength="2500" placeholder="comma,separated,root,words">
			</label>
			<label>Related Words<br>
				<input id="wordRelated" maxlength="2500" placeholder="comma,separated,related,words">
			</label>
			<label>Principal Parts<a href="https://en.wikipedia.org/wiki/Principal_parts" target="_blank" class="label-button">What's This?</a><br>
				<input id="wordPrincipalParts" maxlength="2500" placeholder="comma,separated,principal,parts">
			</label>
		</div>
		<div id="wordErrorMessage"></div>
		<a class="button" id="addWordButton">Add Word</a>
	</form>`;
};
