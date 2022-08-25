const { getDefaultConfig } = require('metro-config')

const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues()

module.exports = {
  resolver: {
    sourceExts: [
      ...defaultResolver.sourceExts,
      'cjs',
    ],
  },
}
