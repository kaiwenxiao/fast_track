import request from '@/utils/request';

const serverUrl = process.env.VUE_APP_BASE_API,
  common = {
    // 获取stripe pubkey
    getStripePubkey() {
      return request({
        url: `${serverUrl}/v1/public/basic-info`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },

    // 机场列表
    airportList() {
      return request({
        url: `${serverUrl}/v1/transport/cip-airports`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },

    // 刷新Token
    refreshToken() {
      return request({
        url: `${serverUrl}/v1/account/refresh-token`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },

    // 语种列表
    languageList() {
      return request({
        url: `${serverUrl}/v2/more/language`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
  };

export default common;
