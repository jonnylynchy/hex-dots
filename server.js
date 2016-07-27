var express = require('express'),
	app = express(),
	serveStatic = require('serve-static');

app.set('port', process.env.PORT || 3000);
app.disable('etag');
app.use(serveStatic('dist', {
	'index': ['index.html', 'default.htm']
}));

app.listen(app.get('port'));
