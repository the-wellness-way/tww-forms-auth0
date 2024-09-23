import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, '../assets/js/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/wp-content/plugins/tww-forms/resources/dist/',
  },
  stats: {
    warnings: false,  // Suppress warnings
    errors: true,    // Suppress errors (be cautious)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4)$/, // Add more extensions if needed
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]', // Customize the output directory and filename
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(), // Cleans the dist folder before each build
  ],
};
