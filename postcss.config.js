/*
 * @Author: zhanghj
 * @Date: 2020-08-13 15:24:50
 * @LastEditors: zhanghj
 * @LastEditTime: 2020-08-13 16:20:32
 * @Description: file content
 * @FilePath: \emaild:\vue-base-tpl\postcss.config.js
 */

module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8'
        // 'last 10 versions', // 所有主流浏览器最近10版本用
      ]
    }
    // 'postcss-pxtorem': {
    //   rootValue: 32,
    //   propList: ['*']
    // }
  }
};
