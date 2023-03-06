<!--
 * @Author: 黄荣基
 * @Date: 2020-12-22 16:40:29
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-01-06 10:57:01
 * @Description: bookingDetails页面的进度条模块
-->
<template>
  <div class="top">
    <div class="tops">
      <div class="top-title">{{ thisStep }}</div>
      <div class="top-info">{{ nextStep }}</div>
    </div>
    <div class="top-circle flexRight">
      <van-circle
        v-model="currentRate"
        :rate="rate"
        layer-color="#d3cfc6"
        stroke-width="100"
        color="#8db92e"
        :text="circleText"
        size="80px"
      />
    </div>
  </div>
</template>
<script>
  import { Circle } from 'vant';

  export default {
    props: {
      thisStep: String,
      nextStep: String,
      rate: String,
      circleText: String,
    },
    data() {
      return {
        currentRate: 0,
      };
    },
    components: {
      [Circle.name]: Circle,
    },
  };
</script>
<style lang="scss" scoped>
  .top {
    height: 120px;
    background-color: #f0ede7;
    display: flex;
    flex-direction: row;
    position: relative;
    .tops {
      display: flex;
      flex-direction: column;
      .top-title {
        line-height: 23px;
        @extend .ff-bold;
        font-size: 18px;
        color: #141413;
      }
      .top-info {
        line-height: 18px;
        font-size: 14px;
        color: #141413;
        padding-top: 4px;
      }
    }
  }
</style>
