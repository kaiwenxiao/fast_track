/*
 * Author: 黄荣基
 * Date: 2021-01-08 18:51:09
 * LastEditors: 黄荣基
 * LastEditTime: 2021-01-08 19:09:14
 */
import request from '@/utils/request';

const serverUrl = process.env.VUE_APP_BASE_API,
  order = {
    // 添加订单
    addGeneralInfos(data) {
      return request({
        url: `${serverUrl}/v1/order/addGeneralInfos`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      });
    },
  };

export default order;
