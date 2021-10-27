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
          TerserPlugin.options.terserOptions.compress.drop_console = true
        }
        // public path
        webpackConfig.output.publicPath =
          '//assets.zjzsxhy.com/digital_compound/'
      }

      webpackConfig.externals = {
        jquery: 'jQuery',
      }

      return webpackConfig
    },
  },
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/assets/*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}
