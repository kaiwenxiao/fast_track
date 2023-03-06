/*
 * Description:.stylelintrc配置
 * Author: zhanghj
 * Date: 2020-12-15 15:44:59
 * LastEditors: 黄荣基
 * LastEditTime: 2020-12-16 11:20:38
 */
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  rules: {
    // at-rule-no-unknown: 屏蔽一些scss等语法检查
    'at-rule-no-unknown': [true, { ignoreAtRules: ['mixin', 'extend', 'content'] }],
  },
};
