万事达欧洲 Fast Track H5+website

## Project setup

use yarn

```
yarn
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build_prod
```

### Run your tests(测试环境)

```
yarn build_test
```

### Lints and fixes files

```
yarn lint
```

测试环境域名：https://mastercardeurope-dev.dragonpass.com/

### 自定义组件

- Cell  单元格
- ModelBox  模态框
- Popup  弹出层

#### 用法：

##### 1、Cell  单元格

###### Props：

| 参数     | 说明       | 类型   |
| -------- | ---------- | ------ |
| cellText | 单元格内容 | String |

例：

```
<Cell cellText="General" @click.native="gotoGeneral" />
```

注：点击事件需加上native才生效

##### 2、ModelBox   模态框

###### Props：

| 参数    | 说明           | 类型   |
| ------- | -------------- | ------ |
| content | 模态框文字内容 | String |
| btn1    | 按钮1文案      | String |
| btn2    | 按钮2文案      | String |

注：content内容部分支持插槽

###### Events：

| 事件    | 说明         | 返回参数类型 |
| ------- | ------------ | ------------ |
| close   | 关闭模态框   |              |
| confirm | 确认、下一步 |              |

例：

```vue
      <ModelBox
        v-show="ShowModel2"
        content="Is your query urgent?"
        btn1="No"
        btn2="Yes"
        @close="gotoCallUs2"
        @confirm="gotoCallUs1"
      />
```

##### 3、Popup  弹出层

###### Props：

| 参数   | 说明       | 类型   |
| ------ | ---------- | ------ |
| title  | 弹出层标题 | String |
| icon   | 关闭图标   | String |
| height | 弹出层高度 | String |

注：内容部分支持插槽

###### Events：

| 事件  | 说明       | 返回参数类型 |
| ----- | ---------- | ------------ |
| close | 关闭弹出层 |              |

例：

```vue
<Popup :icon="icon" title="Visit Time" @close="showPopup = false" height="60%">
   <button class="btn" @click="gotoTU">Terms of Use</button>
</Popup>

<script>
import Popup from '@/components/Popup.vue';
import iconClose from '@/assets/images/btn-close@2x.png';
export default {
  components: {
    Popup,
  },
  name: 'Home',
  data() {
    return {
      icon: iconClose,
    }
  }
}
```







### 目录

```bash
├─.editorconfig
├─.env.development
├─.env.production
├─.eslintrc.js
├─.gitignore
├─.prettierrc.js
├─babel.config.js
├─commitlint.config.js // commit 日志规范
├─package.json
├─postcss.config.js
├─README.md
├─vue.config.js
├─yarn.lock
├─src
| ├─App.vue // 根组件
| ├─i18n.js // 多语言
| ├─main.js // 入口文件
| ├─rem.js
| ├─views // 页面
| | ├─About.vue
| | └Home.vue
| ├─utils
| | ├─index.js
| | └request.js // axios 请求封装
| ├─store
| | └index.js
| ├─services // 请求 Api
| | ├─index.js
| | └user.js
| ├─router
| | └index.js
| ├─mixins
| | └emitter.js
| ├─lang // 多语言配置
| | ├─en.json
| | └zh.json
| ├─components // 组件
| | ├─HelloI18n.vue
| | └HelloWorld.vue
| ├─assets // 静态资源
| | ├─logo.png
| | ├─css
| | | └styles.css
├─public
| ├─favicon.ico
| └index.html
```
