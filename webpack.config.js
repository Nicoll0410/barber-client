const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Solución para errores de módulos ES
  config.module = {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  };

  // Configuración de resoluciones y aliases para React Native Web
  config.resolve = {
    ...config.resolve,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      
      // Aliases para módulos específicos de React Native
      '../Utilities/Platform': 'react-native-web/dist/exports/Platform',
      './Platform': 'react-native-web/dist/exports/Platform',
      'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
      
      // Alias para PlatformColorValueTypes
      './PlatformColorValueTypes': 'react-native-web/dist/exports/StyleSheet/PlatformColorValueTypes',
      'react-native/Libraries/StyleSheet/PlatformColorValueTypes': 'react-native-web/dist/exports/StyleSheet/PlatformColorValueTypes',
      
      // Alias para legacySendAccessibilityEvent
      '../Components/AccessibilityInfo/legacySendAccessibilityEvent': 'react-native-web/dist/exports/AccessibilityInfo/legacySendAccessibilityEvent',
      './legacySendAccessibilityEvent': 'react-native-web/dist/exports/AccessibilityInfo/legacySendAccessibilityEvent',
      
      // Aliases comunes adicionales
      'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo': 'react-native-web/dist/exports/AccessibilityInfo',
      'react-native/Libraries/Image/Image': 'react-native-web/dist/exports/Image',
      'react-native/Libraries/Components/View/View': 'react-native-web/dist/exports/View',
      'react-native/Libraries/Components/Text/Text': 'react-native-web/dist/exports/Text',
      'react-native/Libraries/ReactPrivate/ReactPrivate': 'react-native-web/dist/exports/ReactPrivate',
      
      // Alias para AsyncStorage
      '@react-native-async-storage/async-storage': path.resolve(
        __dirname,
        'node_modules',
        '@react-native-async-storage',
        'async-storage',
        'lib',
        'module',
        'AsyncStorage.js'
      ),
    },
  };

  return config;
};