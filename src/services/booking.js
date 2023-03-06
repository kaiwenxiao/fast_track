/*
 * Author: 黄荣基
 * Date: 2020-12-15 18:17:32
 * LastEditors: 黄荣基
 * LastEditTime: 2021-01-19 17:27:34
 */
import request from '@/utils/request';
import qs from 'qs';

const serverUrl = process.env.VUE_APP_BASE_API,
  booking = {
    // 获取机场列表
    getAirport() {
      return request({
        url: `${serverUrl}/v1/transport/cip-airports`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },
    // 获取国家地区列表
    getAreas() {
      return request({
        url: `${serverUrl}/v1/area/findAreas`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    // 查询cip数据
    getCipAirports(params) {
      return request({
        url: `${serverUrl}/v1/cip/getByAirportCodeAndTerminal`,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      });
    },

    // 获取机场浏览记录
    recentlyView(data) {
      return request({
        url: `${serverUrl}/v1/transport/recently-view`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // booking-step1(附近机场)
    transportNearby(data) {
      return request({
        url: `${serverUrl}/v1/transport/near-by`,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data),
      });
    },

    // booking-step2(Personal Details 添加乘客信息)
    savePassengers(data) {
      return request({
        url: `${serverUrl}/v1/order/savePassengers`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
    },

    // booking-step3(Review Booking 订单预览)
    reviewBooking(params) {
      return request({
        url: `${serverUrl}/v1/order/preview`,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      });
    },

    // booking-step3(Payment Details 1.支付预览)
    payPreview(params) {
      return request({
        url: `${serverUrl}/v1/pay/preview`,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      });
    },

    // booking-step3(Payment Details 2.订单确认(输入密码))
    payCheck(data) {
      return request({
        url: `${serverUrl}/v1/pay/check`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
    },

    // booking-step3(Payment Details 3.支付扣款)
    payConfirm(data) {
      return request({
        url: `${serverUrl}/v1/pay/confirm`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
    },

    // 根据机场查询用户权益
    equityGetBySiteCode(params) {
      return request({
        url: `${serverUrl}/v1/equity/get-by-site-code`,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      });
    },
  };

export default booking;
