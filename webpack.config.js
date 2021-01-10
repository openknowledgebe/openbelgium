const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, {mode}) => {
  console.log(mode);
  return {
    output: {
      filename: '[name].[hash].js'
    },
    devServer: {
      overlay: true,
      hot: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-srcsets-loader',
              options: {
                attrs: [':src', ':srcset']
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|svg|webp)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 1000,
              context: './src',
              name: '[path][name].[ext]',
              esModule: false // https://stackoverflow.com/questions/59070216/webpack-file-loader-outputs-object-module
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            mode === 'production'
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
            'css-loader',
            'resolve-url-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: [
                  require('postcss-import'),
                  postcssPresetEnv({stage: 0})
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'style.[contenthash].css'
      }),
      new OptimizeCSSAssetsPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
