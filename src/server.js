const HyperExpress = require('hyper-express');
require('dotenv').config();

const server = new HyperExpress.Server();
server.files = {};

server.use((req, res, next) => {
	req.hasFile = typeof server.files[req.path] !== 'undefined';
	res.sendFile = (setFile = () => {}) => {
		if (!req.hasFile) {
			server.files[req.path] = setFile();
		}
		return res.send(server.files[req.path]);
	};

	next();
});

server.use('/', require('./routes/assets'));
server.use('/', require('./routes/web'));

const port = process.env.APP_PORT ?? 8080;
server.listen(port)
	.then(socket => console.log(`Web server started on http://localhost:${port}`))
	.catch(error => console.error('Failed to start web server: ', error));

return server;

