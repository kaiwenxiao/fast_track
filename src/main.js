import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n/index';
import http from './services';
import loginModal from '@/components/LoginModal/Index.js';
import { Toast } from 'vant'; // Locale - vant国际化
import '@/assets/css/styles.css';
import '@/assets/css/main.scss';
import '@vant/touch-emulator'; // vant适配桌面端
import './registerServiceWorker'

Vue.use(loginModal).use(Toast);

// 定义全局变量
Vue.prototype.$http = http;
Vue.config.productionTip = false;

const vue = new Vue({
  router,
  store,
  i18n,
  render: h => {
    return h(App);
  },
});
vue.$mount('#app');

export default vue;
