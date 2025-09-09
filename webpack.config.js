const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-reanimated$': 'react-native-reanimated/src/Animated',
  };

  return config;
};