module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-modules-commonjs',
    [
      'module-resolver',
      {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
          '@kingstinct/react/contexts/Snackbar': '../src/contexts/Snackbar',
          '@kingstinct/react/components/SnackbarComponent': '../src/components/SnackbarComponent',
          '@kingstinct/react/components/SnackbarPresentationView': '../src/components/SnackbarPresentationView',
          '@kingstinct/react/hooks/useAddSnackbar': '../src/hooks/useAddSnackbar',
          '@kingstinct/react': '../src/index',
          'react': './node_modules/react',
          'react-native': './node_modules/react-native',
          'react-native-reanimated': './node_modules/react-native-reanimated',
          '@babel': './node_modules/@babel',
          '@egjs/hammerjs': './node_modules/@egjs/hammerjs',
          'fbjs': './node_modules/fbjs',
          'hoist-non-react-statics': './node_modules/hoist-non-react-statics',
          'invariant': './node_modules/invariant',
        },
      },
    ],
  ],
}
