const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const { getExpoBabelLoader } = require('@expo/webpack-config/utils')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@kingstinct', '..'],
      },
    },
    argv,
  )

  config.resolve.alias = { ...config.resolve.alias, '@kingstinct/react$': '../src' }
  console.log('plugins', JSON.stringify(config.resolve.plugins))

  const loader = getExpoBabelLoader(config)
  loader.use.options.configFile = './babel.config.web.js'
  console.log('FOUND WEBPACK CONFIG', config)
  return config
}
