// eslint-disable-next-line functional/immutable-data
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
          '@kingstinct/react/contexts/Snackbars': '../src/contexts/Snackbars',
          '@kingstinct/react': '../src/index',
          '@kingstinct/react/utils/getRandomID': '../src/utils/getRandomID',
          'react': './node_modules/react',
          'react-native': './node_modules/react-native-web',
        },
      },
    ],
  ],
}
