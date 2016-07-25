var compression = require('compression'),
	express = require('express'),
	app = express(),
	serveStatic = require('serve-static');

app.set('port', process.env.PORT || 3000);

app.use(compression());
app.use(serveStatic('dist', {
	'index': ['index.html', 'default.htm'],
	setHeaders: setCustomCacheControl
}));
app.listen(app.get('port'));

function setCustomCacheControl (res, path) {
	console.log(serveStatic.mime.lookup(path));
	// if (serveStatic.mime.lookup(path) === 'text/html') {
	//   // Custom Cache-Control for HTML files
	//   res.setHeader('Cache-Control', 'public, max-age=0')
	// }
}
