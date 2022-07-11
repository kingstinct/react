/* eslint-disable functional/immutable-data */
// eslint-disable-next-line func-names
module.exports = function (api) {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
    // plugins: process.env.NODE_ENV === 'test' ? [] : ['module:react-native-dotenv', 'react-native-reanimated/plugin'],
  }
}
