module.exports = {
  babel: {
    plugins: [
      'babel-plugin-styled-components',
      '@babel/plugin-proposal-numeric-separator',
    ],
  },
  webpack: {
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === 'production') {
        // remove console in production
        const TerserPlugin = webpackConfig.optimization.minimizer.find(
          (i) => i.constructor.name === 'TerserPlugin'
        )
        if (TerserPlugin) {
          TerserPlugin.options.terserOptions.compress.drop_console = false
        }
        // public path
        // webpackConfig.output.publicPath = '//assets.zjzsxhy.com/mad/'
      }

      webpackConfig.externals = {
        jquery: 'jQuery',
      }

      return webpackConfig
    },
  },
  devServer: {
    proxy: {
      '/gen/*': {
        target: 'https://mad.internal.nervina.cn/',
        changeOrigin: true,
        secure: false,
      },
      '/nfts/*': {
        target: 'https://mad.internal.nervina.cn/',
        changeOrigin: true,
        secure: false,
      },
      '/renderer/*': {
        target: 'https://mad.internal.nervina.cn/',
        changeOrigin: true,
        secure: false,
      },
      '/fix/*': {
        target: 'https://mad.internal.nervina.cn/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}
