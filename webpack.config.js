const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Ofuscación y optimización solo en producción
  if (env.mode === 'production') {
    config.optimization = {
      ...config.optimization,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: {
              keep_classnames: true,
              keep_fnames: true
            },
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info']
            },
            output: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    };

    // Plugins adicionales para seguridad
    config.plugins.push(
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'https://barber-server-6kuo.onrender.com'),
        'process.env.REACT_APP_SOCKET_URL': JSON.stringify(process.env.REACT_APP_SOCKET_URL || 'https://barber-server-6kuo.onrender.com')
      })
    );
  }

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-reanimated$': 'react-native-reanimated/src/Animated',
  };

  // Configuración de fallbacks para compatibilidad
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    util: require.resolve('util'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),
    fs: false,
    net: false,
    tls: false,
    zlib: false,
    child_process: false,
  };

  return config;
};