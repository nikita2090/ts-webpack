const path = require('path');
// const { CheckerPlugin } = require('awesome-typescript-loader');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
    const config = {};
    if (!isDev) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin(),
        ];
    }
    return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const babelOptions = (preset, plugin) => {
    const options = {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
    };
    if (preset) {
        options.presets.push(preset);
    }
    if (plugin) {
        options.plugins.push(plugin);
    }
    return options;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        bundle: ['@babel/polyfill', './index.ts'],
        analytics: './analytics.ts',
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'build'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },

    optimization: optimization(),

    devServer: {
        host: 'localhost',
        port: '3000',
        open: true,
        hot: isDev,
        contentBase: path.resolve(__dirname, 'build'),
    },
    devtool: isDev ? 'source-map' : false,

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions(),
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript'),
                },
            },
            {
                test: /\.scss?$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // new CheckerPlugin(),

        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: !isDev,
                removeComments: !isDev,
                removeRedundantAttributes: !isDev,
            },
        }),

        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),

        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'build'),
            }],
        }),
    ],
};
