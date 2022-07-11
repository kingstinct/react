// eslint-disable-next-line @typescript-eslint/no-var-requires
const esbuild = require('esbuild')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { babelPlugin } = require('react-native-esbuild/src/plugins/babel')

const BITMAP_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
const VECTOR_IMAGE_EXTENSIONS = ['.svg']
const IMAGE_EXTENSIONS = BITMAP_IMAGE_EXTENSIONS.concat(
  VECTOR_IMAGE_EXTENSIONS,
)
const VIDEO_EXTENSIONS = ['.mp4']
const ASSET_EXTENSIONS = IMAGE_EXTENSIONS.concat(VIDEO_EXTENSIONS)
const SOURCE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.json']

const platform = 'ios'
const platforms = [platform, 'native', 'react-native']
const extensions = SOURCE_EXTENSIONS.concat(ASSET_EXTENSIONS)
const resolveExtensions = platforms
  .map((p) => extensions.map((e) => `.${p}${e}`))
  .concat(extensions)
  .flat()

const dev = false

const files = fs.readdirSync('./src').filter((filepath) => filepath.endsWith('.tsx') || filepath.endsWith('.ts'))

const outOfTreeReactNativeModuleName = 'react-native'
const resolveReactNativePath = (p) => (outOfTreeReactNativeModuleName
  ? require.resolve(path.join(outOfTreeReactNativeModuleName, p))
  : path.join('', p))

esbuild
  .build({
    bundle: true,
    define: {
      '__DEV__': dev,
      'global': 'window',
      'process.env.NODE_ENV': JSON.stringify(
        dev ? 'development' : 'production',
      ),
    },

    entryPoints: files.map((filename) => `src/${filename}`),

    // splitting: true,
    // treeShaking: true,
    format: 'cjs',

    /*    inject: [
      // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires
      ...require(resolveReactNativePath('rn-get-polyfills'))(),
      resolveReactNativePath('Libraries/Core/InitializeCore.js'),
    ], */

    minify: true,

    outdir: 'lib',
    plugins: [
      /* outOfTreeReactNativeModuleName &&
            outOfTreePlatformResolverPlugin({
              moduleName: outOfTreeReactNativeModuleName,
            }), */
      /* assetLoaderPlugin({
            extensions: ASSET_EXTENSIONS,
            scalableExtensions: BITMAP_IMAGE_EXTENSIONS,
            platform,
            rootdir: './',
            publicPath: './',
            outdir: './',
            dev,
          }), */
      babelPlugin({
        cache: dev,
        config: {
          babelrc: false,
          configFile: false,
          plugins: [
            '@babel/plugin-syntax-flow',
            '@babel/plugin-transform-flow-strip-types',
            '@babel/plugin-syntax-jsx',
          ],
        },
        // eslint-disable-next-line prefer-regex-literals
        filter: new RegExp(`node_modules/([^/]*react-native[^/]*)/.+\\.jsx?$`),
        loader: 'jsx',
      }),
    ].filter(Boolean),
    resolveExtensions,
    sourcemap: true,
    target: ['es6'],
  })
  .catch(() => process.exit(1))
