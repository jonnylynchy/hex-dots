var svgoConfig = JSON.stringify({
	plugins: [
		{removeTitle: true},
		{convertColors: {shorthex: false}},
		{convertPathData: false}
	]
});

var path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: './dist',
		publicPath: '/',
        filename: 'app.bundle.js',
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'jshint-loader'
        }],
        loaders: [
			{
	            test: /\.js$/,
	            exclude: /node_modules/,
	            loader: 'babel-loader',
	            query: {
	                presets: ['es2015']
	            }
			},
			{
				test: /\.css$/,
				loader: 'style!css?sourceMap'
			},
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
			// {
	        // 	test: /\.svg$/,
	        //     loaders: [
	        //         'file-loader?name=[name].[ext]'
	        //     ]
	        // },
			{
			    test: /\.woff$/,
			    loader: 'file-loader',
			    query: {
			        name: 'font/[hash].[ext]',
			        limit: 5000,
			        mimetype: 'application/font-woff'
			    }
			}, {
			    test: /\.ttf$|\.eot$/,
			    loader: 'file-loader',
			    query: {
			        name: 'font/[hash].[ext]'
			    }
			},
			{
				test: /\.mp3$/,
				loader: 'file-loader',
				query: {
			        name: 'audio/[hash].[ext]'
			    }
			},
			{
			    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/font-woff"
			},
			{
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/font-woff"
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/octet-stream"
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: "file"
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=image/svg+xml"
			}
        ]
    },

    // more options in the optional jshint object
    jshint: {

        esversion: 6,

        // any jshint option http://www.jshint.com/docs/options/
        // i. e.
        camelcase: true,

        // jshint errors are displayed by default as warnings
        // set emitErrors to true to display them as errors
        emitErrors: false,

        // jshint to not interrupt the compilation
        // if you want any file with jshint errors to fail
        // set failOnHint to true
        failOnHint: false,

        // custom reporter function
        reporter: function(errors) {}
    }
}
