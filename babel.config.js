const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  plugins: [
    ...prodPlugins
  ],
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
