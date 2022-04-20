const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  productionSourceMap:false,
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    proxy:{
      '/api':{
        target: 'http://39.98.123.211/',
      }
    }
  },
  configureWebpack: {
    resolve: {
      fallback: { path: require.resolve('path-browserify') }
    }
  }
})



