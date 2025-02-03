'use strict';

const app = require('./app');
const { PORT } = require('./config');

if (process.env.NODE_ENV === 'production') {
	app.use((req, res, next) => {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect('https://' + req.headers.host + req.url);
		}
		next();
	});
}

app.listen(PORT, function () {
	console.log(`Started on http://localhost:${PORT}`);
});
