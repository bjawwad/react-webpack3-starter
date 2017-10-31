const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const DEBUG = process.env.NODE_ENV !== "production";

// ROOT APP...
const APP_DIR = path.resolve(__dirname, "./app");

// DIST APP...
const DIST_DIR = path.resolve(APP_DIR, "./dist");
const DIST_STYLE_DIR = path.resolve(DIST_DIR, "./style");
const DIST_JS_BUNDLE_FILE = "js/bundle.js";
const DIST_CSS_BUNDLE_FILE = "bundle.css";
const DIST_CSS_BUNDLE_PATH = `style/${DIST_CSS_BUNDLE_FILE}`;
const DIST_CSS_BUNDLE_REGIX = /\.bundle\.css$/g

// SOURCE APP...
const SRC_DIR = path.resolve(APP_DIR, "./src");
const SRC_APP_JS = path.resolve(SRC_DIR, "./index.js");

// DEVELOPMENT PLUGINS...

const developmentPlugins = [
    new ExtractTextPlugin({
        filename: DIST_CSS_BUNDLE_PATH,
        disable: false,
        allChunks: true
    })
];

// PRODUCTION PLUGINS...
const productionPlugins = [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: false
    }),
    new ExtractTextPlugin({
        filename: DIST_CSS_BUNDLE_PATH,
        disable: false,
        allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: DIST_CSS_BUNDLE_REGIX,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: {
            discardComments: { removeAll: true }
        },
        canPrint: true
    })

];

const config = {
    // ENTRY...
    entry: SRC_APP_JS,

    // OUTPUT...
    output: {
        path: DIST_DIR,
        publicPath: "/dist/",
        filename: DIST_JS_BUNDLE_FILE,
        sourceMapFilename: 'sourcemaps/[file].map'
    },

    // RESOLVE...
    resolve: {
        modules: ['node_modules', APP_DIR],
        extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
        descriptionFiles: ['package.json']
    },

    // DEVTOOL AND OTHER CONFIGS...
    devtool: DEBUG ? "source-map" : "",
    context: __dirname,
    target: "web",
    cache: false,
    watchOptions: {
        aggregateTimeout: 1000,
        poll: true
    },

    // DEV SERVER...
    devServer: {
        contentBase: APP_DIR,
        compress: true,
        inline: true,
        port: 3030
    },

    // MODULES...
    module: {
        rules: [
            // RULES FOR JS | JSX
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: [APP_DIR],
                exclude: /node_modules/,
                options: {
                    presets: ["es2015", "react", "stage-2"]
                }
            },

            // RULES FOR CSS | SCSS
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"],
                    publicPath: DIST_STYLE_DIR
                })
            }
        ]
    },

    // PLUGINS...
    plugins: DEBUG ? developmentPlugins : productionPlugins

};


module.exports = config;
