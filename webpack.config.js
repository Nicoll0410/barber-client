const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        'react-native-calendars',
        'react-native-paper',
        'react-native-paper-dates',
        'react-native-chart-kit',
        '@react-native-picker'
      ]
    }
  }, argv);

  // Polyfills para Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    vm: require.resolve('vm-browserify'),
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

  // ALIAS CRÍTICO para useFrameSize - AGREGA ESTO
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-paper-dates/lib/module/hooks/useFrameSize': path.resolve(__dirname, 'mockUseFrameSize.js'),
  };

  return config;
};