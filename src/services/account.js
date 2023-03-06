import request from '@/utils/request';
import qs from 'qs';

const serverUrl = process.env.VUE_APP_BASE_API,
  account = {
    // 获取用户信息
    getAccountInfo(data) {
      return request({
        url: `${serverUrl}/v1/account/info/default`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // 查询当前会籍对应权益
    equityUseInfo() {
      return request({
        url: `${serverUrl}/v1/equity/use-info`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },

    // 设置/更新会籍卡名称
    updateCardName(data) {
      return request({
        url: `${serverUrl}/v1/membership/update-default-name`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // 会籍卡更新
    updateCard(data) {
      return request({
        url: `${serverUrl}/v1/membership/update`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // 会籍卡列表
    membershipList(data) {
      return request({
        url: `${serverUrl}/v1/membership/list`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // 会籍卡切换
    membershipSwitch(data) {
      return request({
        url: `${serverUrl}/v1/membership/switch`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // 会籍卡添加
    membershipAdd(data) {
      return request({
        url: `${serverUrl}/v1/membership/add`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // [booking] 订单列表
    bookingOrderHistory() {
      return request({
        url: `${serverUrl}/v1/order/history`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },

    // [booking] 订单详情
    bookingDetails(data) {
      return request({
        url: `${serverUrl}/v1/order/detail`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // CIP订单取消
    bookingCancel(data) {
      return request({
        url: `${serverUrl}/v1/order/cancel-cip-order`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // 重新发送下单成功邮件
    resendPaySuccEmail(data) {
      return request({
        url: `${serverUrl}/v1/order/resend-pay-success-email`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // Change Password
    passwordChange(data) {
      return request({
        url: `${serverUrl}/v1/account/password/change`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // Logout
    logout() {
      return request({
        url: `${serverUrl}/v1/account/logout`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },

    // 查询用户当前身份对应的项目是否上/下线, 当前会籍卡是否过期/取消状态
    programStatus(data) {
      return request({
        url: `${serverUrl}/v1/public/program-status`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
    },

    // 校验波兰大客户等级是否发生变更
    checkCardLevel(data) {
      return request({
        url: `${serverUrl}/v1/account/check-card-level`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
    },
  };

export default account;
