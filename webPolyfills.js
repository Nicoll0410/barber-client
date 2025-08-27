// webPolyfills.js
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Polyfill global para require - SIN requires internos
  if (typeof global.require === 'undefined') {
    global.require = (moduleName) => {
      const mappings = {
        'react-native': {
          Platform: { OS: 'web' },
          StyleSheet: { create: (styles) => styles },
          View: ({ children }) => children,
          Text: ({ children }) => children,
          Alert: { alert: () => {} },
          AppState: { addEventListener: () => ({ remove: () => {} }) },
          Linking: { addEventListener: () => ({ remove: () => {} }), getInitialURL: () => Promise.resolve(null) },
          LogBox: { ignoreLogs: () => {} },
          useRef: (initialValue) => ({ current: initialValue }),
          useEffect: (callback, deps) => {},
          useState: (initialValue) => [initialValue, () => {}],
          useCallback: (callback, deps) => callback,
          useMemo: (factory, deps) => factory(),
        },
        'react-native-vector-icons': {
          Ionicons: () => null,
          MaterialIcons: () => null,
          MaterialCommunityIcons: () => null,
          FontAwesome: () => null,
          createIconSet: () => () => null,
        },
        'react-native-gesture-handler': {
          GestureHandlerRootView: ({ children }) => children,
          Swipeable: ({ children }) => children,
          GestureHandlerButton: ({ children }) => children,
          DrawerLayout: () => null,
          State: {},
          Directions: {},
          gestureHandlerRootHOC: (Component) => Component,
        },
        'expo-notifications': {
          setNotificationHandler: () => {},
          addNotificationReceivedListener: () => ({ remove: () => {} }),
          addNotificationResponseReceivedListener: () => ({ remove: () => {} }),
          getExpoPushTokenAsync: () => Promise.resolve({ data: 'mock-token-web' }),
          getPermissionsAsync: () => Promise.resolve({ status: 'granted' }),
          requestPermissionsAsync: () => Promise.resolve({ status: 'granted' }),
          dismissAllNotificationsAsync: () => Promise.resolve(),
          dismissNotificationAsync: () => Promise.resolve(),
          scheduleNotificationAsync: () => Promise.resolve(),
          getAllScheduledNotificationsAsync: () => Promise.resolve([]),
          getBadgeCountAsync: () => Promise.resolve(0),
          setBadgeCountAsync: () => Promise.resolve(),
        },
        'expo-device': {
          isDevice: false,
          modelName: 'Web Browser',
          osName: 'Web',
          osVersion: 'n/a',
          deviceType: 2,
          supportedCpuArchitectures: [],
          totalMemory: 0,
          brand: null,
          manufacturer: null,
          osBuildId: null,
          osInternalBuildId: null,
          designName: null,
          productName: null,
          deviceYearClass: null,
          maxMemory: null,
          totalDiskCapacity: null,
          deviceName: 'Web Browser',
        },
        'react-native-blob-util': {
          fs: {
            dirs: {
              DocumentDir: '/',
              CacheDir: '/cache',
              DCIMDir: '/dcim',
              DownloadDir: '/download',
              MainBundleDir: '/bundle',
              MovieDir: '/movies',
              MusicDir: '/music',
              PictureDir: '/pictures',
              RingtoneDir: '/ringtones',
            },
            exists: () => Promise.resolve(false),
            writeFile: () => Promise.resolve(),
            readFile: () => Promise.resolve(''),
            unlink: () => Promise.resolve(),
            mkdir: () => Promise.resolve(),
            stat: () => Promise.resolve({ size: 0 }),
          },
          config: () => ({
            fetch: () => Promise.resolve({ text: () => Promise.resolve('') }),
          }),
        },
        '@react-native-community/datetimepicker': () => null,
        'react-native-modal-datetime-picker': () => null,
        'react-native-paper-dates': {
          useFrameSize: () => ({ width: 1024, height: 768 }),
          DatePickerModal: () => null,
          TimePickerModal: () => null,
          en: {},
          es: {},
          registerTranslation: () => {},
        },
        'react-native-reanimated': {
          default: {
            Value: () => ({ value: 0 }),
            SpringUtils: {},
            Timing: {},
            Spring: {},
            Easing: {},
            Clock: () => ({}),
            clockRunning: () => false,
            startClock: () => {},
            stopClock: () => {},
            set: () => {},
            cond: () => {},
            eq: () => {},
            add: () => {},
            sub: () => {},
            multiply: () => {},
            divide: () => {},
            greaterThan: () => {},
            lessThan: () => {},
            greaterOrEq: () => {},
            lessOrEq: () => {},
            neq: () => {},
            and: () => {},
            or: () => {},
            not: () => {},
            onChange: () => {},
            call: () => {},
            block: () => {},
            event: () => {},
            abs: () => {},
            acc: () => {},
            color: () => {},
            diff: () => {},
            diffClamp: () => {},
            interpolate: () => {},
            max: () => {},
            min: () => {},
            proc: () => {},
            round: () => {},
            sin: () => {},
            cos: () => {},
            createAnimatedComponent: (Component) => Component,
          },
        },
        'react-native-screens': {
          enableScreens: () => {},
          screensEnabled: () => false,
          NativeScreen: () => null,
          ScreenContainer: () => null,
          Screen: () => null,
          ScreenStack: () => null,
          ScreenStackHeaderConfig: () => null,
          ScreenStackHeaderSubview: () => null,
          ScreenStackHeaderRightView: () => null,
          ScreenStackHeaderLeftView: () => null,
          ScreenStackHeaderCenterView: () => null,
          ScreenStackHeaderBackButtonImage: () => null,
          ScreenStackHeaderSearchBarView: () => null,
        },
      };

      return mappings[moduleName] || {};
    };
  }

  // Mock específico para useFrameSize
  if (typeof window !== 'undefined') {
    window.useFrameSize = () => ({ width: window.innerWidth, height: window.innerHeight });
    
    // Mock para webpack require
    if (!window.__webpack_require__) {
      window.__webpack_require__ = (id) => {
        if (id.includes('useFrameSize') || id.includes('react-native-paper-dates')) {
          return { 
            useFrameSize: () => ({ width: window.innerWidth, height: window.innerHeight }),
            default: { useFrameSize: () => ({ width: window.innerWidth, height: window.innerHeight }) }
          };
        }
        return {};
      };
    }

    // Mock para módulos comunes de Node.js
    if (typeof global.process === 'undefined') {
      global.process = {
        env: { NODE_ENV: 'development' },
        version: '',
        nextTick: (callback) => setTimeout(callback, 0),
        cwd: () => '/',
        platform: 'web',
        browser: true,
      };
    }

    // Mock para Buffer
    if (typeof global.Buffer === 'undefined') {
      global.Buffer = {
        from: () => ({ toString: () => '' }),
        alloc: () => ({}),
      };
    }
  }

  // Configuración adicional para Expo en web
  if (typeof document !== 'undefined') {
    // Asegurar que el favicon se carga correctamente
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);

    // Prevenir errores de manifest
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);
  }
}