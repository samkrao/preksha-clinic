const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DEV, DEBUG } = process.env;
const CopyWebpackPlugin=require("copy-webpack-plugin");
const BUILD_DIR = path.resolve(__dirname, 'build');
const SRC_DIR = path.resolve(__dirname, 'src');
var JavaScriptObfuscator = require('webpack-obfuscator');
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const scopedcssplug = require('craco-plugin-scoped-css');
    
process.env.BABEL_ENV = DEV ? 'development' : 'production';
process.env.NODE_ENV = DEV ? 'development' : 'production';
module.exports = {
  mode: DEV ? 'development' : 'production',
  entry: "/src/index.js", // main js
  /*output: {
    path: path.resolve(__dirname, "dist"), // output folder
    publicPath: "/",
  },*/
  output: {
    //path: path.join(__dirname, '/dist'),
    path: BUILD_DIR,
    filename: 'bundle.js',
    clean: true,
    //publicPath: "/",
 },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        // Process . less
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            // less-loader
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  // Replace the variable of antd and remove the @ symbol.
                  // https://ant.design/docs/react/customize-theme-cn
                  modifyVars: {
                    'primary-color': '#1DA57A',
                    'border-color-base': '#d9d9d9', // Border Color
                    'text-color': '#d9d9d9'
                  },
                  javascriptEnabled: true, // Support js
                },
              },
            },
          ],
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: !!DEV,
              },
            },
            { loader: 'scoped-css-loader' },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !!DEV,
              },
            },
            {loader: 'postcss-loader'}
          ],
        },
        {
          test: /\.png/,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(csv|tsv)$/i,
          use: ['csv-loader'],
        },
        {
          test: /\.xml$/i,
          use: ['xml-loader'],
        },
      ],
    
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
      new HtmlMinimizerPlugin(),
    ],
    minimize: !DEV,
    splitChunks: {
      minSize: 500000,
      cacheGroups: {
        vendors: false,
      },
    },
  }, 
  resolve: {
    modules: ['node_modules'],
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.less', '.scss'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
      {from: 'src/js', to: 'scripts'},
      {from: 'src/img', to: 'images'},
      {from: 'src/css',to:'css'}
    ],
    
    options:{
      concurrency: 100,
    },
  }),
  new JavaScriptObfuscator({
    rotateStringArray: true
  }, ['bundle.js','scripst/custom.js']),
  ],
};
