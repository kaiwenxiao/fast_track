const plugins = [[
  'import',
  {
    libraryName: 'vant',
    libraryDirectory: 'es',
    style: true,
  },
  'vant',
]];
// https://forum.vuejs.org/t/remove-console-logs-from-production-buils/39327
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'local') {
  plugins.push('transform-remove-console');
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins,
};
