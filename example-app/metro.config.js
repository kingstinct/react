const glob = require('glob-to-regexp')
const { getDefaultConfig } = require('metro-config')
const blacklist = require('metro-config/src/defaults/exclusionList')
const path = require('path')

function getBlacklist() {
  const rootDir = path.resolve(__dirname, '..')
  const currentDir = path.resolve(__dirname)
  const nodeModuleDirs = [
    glob(`${rootDir}/node_modules/*`),
    glob(`${rootDir}/e2e/*`),
    glob(`${currentDir}/node_modules/*/node_modules/fbjs/*`),
    glob(
      `${currentDir}/node_modules/react-native/node_modules/@babel/*`,
    ),
    glob(
      `${currentDir}/node_modules/*/node_modules/hoist-non-react-statics/*`,
    ),
  ]
  return blacklist(nodeModuleDirs)
}

const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues()

module.exports = {
  resolver: {
    blocklist: getBlacklist(),
    resolverMainFields: ['browser', 'react-native', 'main'],
    sourceExts: [
      ...defaultResolver.sourceExts,
      'cjs',
    ],
  },
  watchFolders: [path.resolve(__dirname, '..')],
  transformer: {
    getTransformOptions: () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
}
