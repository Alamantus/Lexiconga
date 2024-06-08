const { html } = require('uhtml');

module.exports = (app) => {
	const themeName = app?.state?.currentTheme ?? 'defaultTheme';
	
	return html`<body class="${themeName}">
		${require('./header')(app)}
		${require('./main')(app)}
		${require('./footer')(app)}
		${require('./settingsModal')(app)}
		${require('./dictionaryModal')(app)}
	</body>`;
};
