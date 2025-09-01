const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  webpack: (config, { isServer }) => {
    if (!isServer) {
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
    }
    
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      'react-native-reanimated$': 'react-native-reanimated/src/Animated',
    };

    return config;
  },
  images: {
    unoptimized: true
  },
  experimental: {
    esmExternals: true,
  }
});