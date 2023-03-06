import request from '@/utils/request';
import qs from 'qs';

const serverUrl = process.env.VUE_APP_BASE_API,
  paymentServerUrl = process.env.VUE_APP_PAYMENT_BASE_API,
  env = process.env.NODE_ENV,
  login = {
    // 根据卡号获取master token
    getMasterToken(data) {
      return request({
        url:
          env === 'production'
            ? `${paymentServerUrl}/master/token/retrieve`
            : `${paymentServerUrl}/master/token/mock/retrieve`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // Register - MasterCard Verify
    masterCardVerify(data) {
      return request({
        url: `${serverUrl}/v1/account/register/card/verification`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // Register - Email Verify
    emailVerify(data) {
      return request({
        url: `${serverUrl}/v1/account/register/email/verification`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // Register
    register(data) {
      return request({
        url: `${serverUrl}/v1/account/register`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // 登录
    login(data) {
      return request({
        url: `${serverUrl}/v1/account/login`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // [reset pwd] 1. RestPassowrd Captcha Email Send
    resetPwdEmailVerify(data) {
      return request({
        url: `${serverUrl}/v1/account/password/captcha/email`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // [reset pwd] 2. ResetPassword Captcha Verify
    resetPwdCaptchaVerify(data) {
      return request({
        url: `${serverUrl}/v1/account/password/captcha/verification`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // [reset pwd] 3. ResetPassword
    resetPwd(data) {
      return request({
        url: `${serverUrl}/v1/account/password/reset`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },
  };

export default login;
