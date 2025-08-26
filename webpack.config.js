const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Polyfills para Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    vm: require.resolve('vm-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    util: require.resolve('util')
  };

  return config;
};
