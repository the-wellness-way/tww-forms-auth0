import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:8084',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, '../assets/js/index.js'),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/wp-content/plugins/tww-video/resources/dist/',
    clean: true
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
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../dist'),
    },
    hot: true,
    port: 8084,
    host: '0.0.0.0',
    proxy: [
        {
            context: '/',
            target: 'http://localhost:8081',
            secure: false,
            changeOrigin: true,
        },
    ],
    open: true,
    watchFiles: [path.resolve(__dirname, '../assets/js/**/*')],
    devMiddleware: {
      writeToDisk: true,
    },
    client: {
        overlay: {
            warnings: true,
            errors: true,
        },
        logging: 'info', // or 'verbose' for more detailed logs
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'source-map', // Enable source maps for better error tracking
  stats: {
    all: true,
    warnings: true,
    errors: true,
    errorDetails: true, // Show error details in the output
    logging: 'verbose', // Verbose logging
  },
};
