import axios from 'axios';
import context from '../main';
import store from '../store';

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
const checkStatus = response => {
    const status = response.status || -1000; // -1000 自己定义，连接错误的status
    if ((status >= 200 && status < 300) || status === 304) {
      // 如果http状态码正常，则直接返回数据
      return response.data;
    }
    let errorInfo = '';
    switch (status) {
      case -1:
        errorInfo = '远程服务响应失败,请稍后重试';
        break;
      case 400:
        errorInfo = '400：错误请求';
        break;
      case 401:
        errorInfo = '401：访问令牌无效或已过期';
        break;
      case 403:
        errorInfo = '403：拒绝访问';
        break;
      case 404:
        errorInfo = '404：资源不存在';
        break;
      case 405:
        errorInfo = '405：请求方法未允许';
        break;
      case 408:
        errorInfo = '408：请求超时';
        break;
      case 500:
        errorInfo = '500：访问服务失败';
        break;
      case 501:
        errorInfo = '501：未实现';
        break;
      case 502:
        errorInfo = '502：无效网关';
        break;
      case 503:
        errorInfo = '503：服务不可用';
        break;
      default:
        errorInfo = '连接错误';
    }
    return {
      status,
      msg: errorInfo,
    };
  },
  // 创建axios实例
  instance = axios.create();

instance.defaults.baseURL = '';
instance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

instance.interceptors.request.use(
  config => {
    console.log(`request locale: ${context.$i18n.locale}`);
    config.headers.Authorization = sessionStorage.getItem('token');
    config.headers['Accept-Language'] = context.$i18n.locale;
    /* eslint-disable */
    sessionStorage.getItem('isLogin') &&
      sessionStorage.setItem('expiresIn', new Date().getTime() + 900 * 1000);
    /* eslint-disable */
    return config;
  },
  error => {
    Promise.error(error);
  }
);

instance.interceptors.response.use(
  response => {
    if (response.status === 200 && response.data.errorCode === 'err_auth_fail') {
      const type = sessionStorage.getItem('appType');
      if (type === 'web') {
        sessionStorage.removeItem('isLogin');
        store.commit('setState', {
          state: 'isLogin',
          values: false,
        });
        context.$router.push('/page-timeout');
      } else if (type === 'app') {
        sessionStorage.removeItem('isLogin');
        store.commit('setState', {
          state: 'isLogin',
          values: false,
        });
        window.appNative.setSendData({
          needLogin: '1',
        });
        window.appNative.handleSend();
      }
      // throw new Error('Authorization fail.');
      return false;
    }
    return Promise.resolve(checkStatus(response));
  },
  error => {
    console.log(error);
    const { response } = error;
    if (response) {
      const {
        data: { status },
      } = response;
      if (String(status).startsWith('5')) {
        context.$router.push('/server-error');
      }
    } else {
      // throw error;
    }
  }
);

export default instance;
