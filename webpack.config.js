'use strict';
require('dotenv').config();

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssUrlRelativePlugin = require('css-url-relative-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProdBuild = process.env.NODE_ENV === 'production';
const enableBundleAnalyzerPlugin = process.argv[2] === 'bundleAnalyzer';

const uglifyOptions = {
	ecma: 5,
	minimize: isProdBuild,
	mangle: isProdBuild,
	output: {
		comments: false
	},
	sourceMap: true,
	compress: {
		sequences: true,
		dead_code: true,
		conditionals: true,
		booleans: true,
		unused: true,
		if_return: true,
		join_vars: true,
		loops: true,
		passes: 3
	}
};

const config = {
	mode: !isProdBuild ? 'development' : 'production',
	entry: {
		apps: path.join(__dirname, 'client/index.js'),
		category: path.join(__dirname, 'client/apps/categoryNavigation/index.js'),
		ui: path.join(__dirname, 'public/js/ui.js'),
		site: path.join(__dirname, 'public/styles/site.scss')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		chunkFilename: '[name].bundle.js',
		sourceMapFilename: '[file].map',
		filename: '[name].bundle.js'
	},
	externals: {
		jquery: 'jQuery'
	},
	devtool: !isProdBuild ? 'inline-source-map' : false,
	resolve: {
		extensions: ['.js', '.jsx', '.scss']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					plugins: [
						'transform-decorators-legacy',
						...(isProdBuild ? ['transform-react-remove-prop-types'] : [])
					],
					presets: [
						[
							'env',
							{
								targets: {
									browsers: ['>0.25%', 'not ie 11', 'not op_mini all']
								}
							}
						],
						'react',
						'es2015',
						'stage-2'
					]
				}
			},
			{
				test: [/.css$|.scss$/],
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: !isProdBuild,
						},
					},
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							includePaths: ['/public/styles/site.scss']
						}
					},
					'postcss-loader'
				]
			},
			// less-loader for ant-design library on-demand loading
			{
				test: /\.less$/,
				use: [
					'style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{
						loader: 'less-loader',
						options: { javascriptEnabled: true }
					}
				]
			},
			{
				test: /\.(ttc|woff|woff2|eot|ttf)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: '[name].[ext]',
							fallback: 'file-loader',
							outputPath: 'fonts'
						}
					}
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
							name: '[name].[ext]',
							fallback: 'file-loader',
							outputPath: 'images'
						}
					}
				]
			},
			{
				loader: 'image-webpack-loader',
				options: {
					mozjpeg: {
						progressive: true,
						quality: 65
					},
					pngquant: {
						quality: '65-90',
						speed: 4
					},
					gifsicle: {
						interlaced: false
					},
					webp: {
						quality: 75
					}
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'windows.jQuery': 'jquery'
		}),
		new MiniCssExtractPlugin({
			//TODO: filename: !isProdBuild ? 'styles.css' : 'styles-[hash].css'
			filename: '[name].css',
			chunkFilename: '[name].css',
		}),
		new webpack.HashedModuleIdsPlugin(),
		new CssUrlRelativePlugin(),
		new SpritesmithPlugin({
			src: {
				cwd: path.resolve(__dirname, './public/images/icons'),
				glob: '*.png'
			},
			target: {
				image: path.resolve(
					__dirname,
					'./public/spritesmith-generated/sprite.png'
				),
				css: [
					[
						path.resolve(
							__dirname,
							'./public/spritesmith-generated/sprite.scss'
						),
						{ format: 'function_based_template' }
					]
				]
			},
			spritesmithOptions: {
				padding: 2
			},
			apiOptions: {
				cssImageRef: path.resolve(
					__dirname,
					'./public/spritesmith-generated/sprite.png'
				)
			},
			customTemplates: {
				function_based_template: function(data) {
					const shared = '.ico { display: inline-block; background-image: url(I); background-size: Dpx Hpx; }'
						.replace('I', data.sprites[0].image)
						.replace('D', data.sprites[0].total_width)
						.replace('H', data.sprites[0].total_height);

					const perSprite = data.sprites
						.map(function(sprite) {
							const responsiveCSS = height => {
								return `zoom: calc(40/${height});
									@include MQ(S){
										zoom: calc(36/${height});
									};
									@include MQ(XS){
										zoom: calc(28/${height});
									}`;
							};
							return '.ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; Z }'
								.replace('N', sprite.name)
								.replace('W', sprite.width)
								.replace('H', sprite.height)
								.replace('X', sprite.offset_x)
								.replace('Y', sprite.offset_y)
								.replace('Z', responsiveCSS(sprite.height));
						})
						.join('\n');

					return shared + '\n' + perSprite;
				}
			}
		})
	]
};

if (isProdBuild) {
	Object.assign(config, {
		optimization: {
			'minimizer': [
				new TerserPlugin({
					test: /\.js(\?.*)?$/i,
					parallel: true,
					sourceMap: true
				})
			]
		}
	});
	config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
	config.plugins.push(
		new UglifyJSPlugin({
			parallel: true,
			uglifyOptions
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
			DEBUG: false
		}),
		new webpack.optimize.ModuleConcatenationPlugin()
	);
} else {
	if(enableBundleAnalyzerPlugin) {
		config.plugins.push(
			new BundleAnalyzerPlugin()
		);
	}
}

module.exports = config;