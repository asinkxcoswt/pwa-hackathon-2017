const debug = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const path = require("path");
const OfflinePlugin = require('offline-plugin');

const offline = new OfflinePlugin({
    publicPath: '/js',
    caches: {
        main: [
            '*.css',
            '*.js',
        ],
        additional: [
            ':externals:'
        ],
        optional: [
            ':rest:'
        ]
    },
    externals: [
        '/',
        '/index.html'
    ],
    ServiceWorker: {
        output: './sw.js',
        navigateFallbackURL: '/'
    },
});

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./public/js/app.jsx",
    output: {
        path: __dirname + "/public/js",
        filename: "app.min.js"
    },
    plugins: debug ? [
        offline,
    ] : [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
            offline
        ],
    module: {
        loaders: [
            {
                loader: "babel-loader",

                // Skip any files outside of your project's `src` directory
                include: [
                    path.resolve(__dirname, "public/js"),
                ],

                // Only run `.js` and `.jsx` files through Babel
                test: /\.jsx?$/,

                // Options to configure babel with
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0', 'react'],
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
            }
        ]
    }
};