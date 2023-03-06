const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const IS_PROD = ['production'].includes(process.env.NODE_ENV)
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  assetsDir: 'static',
  productionSourceMap: false,
  filenameHashing: true,
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'zh',
      localeDir: 'lang',
      enableInSFC: true,
    },
  },
  devServer: {
    port: 9090,
    open: true,
    proxy: {
      '/api': {
        target: 'https://mastercardeurope-uat.dragonpass.com',
        // target: 'https://travelexperiences.dragonpass.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      },
      '/paymentApi': {
        target: 'https://paymentdev.dragonpass.com.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/paymentApi': '',
        },
      },
    },
  },
  chainWebpack: config => {
    plugins: [
      new HardSourceWebpackPlugin()
    ],
    // 修复HMR
    config.resolve.symlinks(true);
    config.plugins.delete('prefetch');
    config.output.filename('[name].[hash].js').end();
    config.output.chunkFilename('[name].[hash].js').end();
    config.plugin('compressionPlugin').use(
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.(js|css)(\?.*)?$/i,
        threshold: 10240, // 10.24kb
        deleteOriginalAssets: false,
      }),
    );
    if (['local', 'development'].includes(process.env.NODE_ENV)) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        fonts: path.resolve(__dirname, 'src/assets/fonts'),
        img: path.resolve(__dirname, 'src/assets/images'),
      },
    },
    output: {
      filename: 'static/js/[name].[hash].js',
      chunkFilename: 'static/js/[name].[hash].js',
    },
    // plugins: [
    //   new PrerenderSPAPlugin({
    //     // Required - The path to the webpack-outputted app to prerender.
    //     staticDir: path.join(__dirname, 'dist'),
    //     // Optional - The location of index.html
    //     indexPath: path.join(__dirname, 'dist', 'index.html'),
    //     routes: ['/', '/airport'],
    //     minify: {
    //       collapseBooleanAttributes: true,
    //       collapseWhitespace: true,
    //       decodeEntities: true,
    //       keepClosingSlash: true,
    //       sortAttributes: true,
    //     },
    //     renderer: new Renderer({
    //       headless: true,
    //     }),
    //   }),
    // ],
  },
  pwa: {
    workboxPluginMode: 'GenerateSW', // 也可以定义为‘InjectManifest’模式。但是需自己写SW.js文件进行配置
    workboxOptions: {
      importWorkboxFrom: 'cdn',
      skipWaiting: true, // 安装完SW不等待直接接管网站
      clientsClaim: true,
      navigateFallback: '/index.html',
      // 定义运行时缓存
      include: [

      ],
      runtimeCaching: [
        {
          urlPattern: /.*\.js.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'seed-js',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: /.*css.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'seed-css',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: /.*(png|svga).*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'seed-image',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        }
      ]
    }
  },

  css: {
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        prependData: `
          @import '@/assets/css/main.scss';
          @import '@/assets/css/variables.scss';
          `,
      },
    },
    extract: {
      filename: 'static/css/[name].[hash].css',
      chunkFilename: 'static/css/[name].[hash].css',
    },
  },
};
