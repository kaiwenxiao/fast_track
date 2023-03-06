<!--
 * @Author: 黄荣基
 * @Date: 2020-12-17 14:07:25
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-01-06 15:04:28
-->
<template>
  <div class="modelWrapper">
    <div class="modelBox">
      <div class="modelContent">{{ content }}<slot></slot></div>
      <div class="modelSubmit">
        <div class="modelBtn1" @click="close">{{ btn1 }}</div>
        <div class="modelBtn2" @click="confirm">{{ btn2 }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      content: String,
      btn1: String,
      btn2: String,
    },
    methods: {
      close() {
        this.$emit('close');
      },
      confirm() {
        this.$emit('confirm');
      },
    },
  };
</script>
<style lang="scss" scoped>
  .modelWrapper {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    z-index: 999;
    .modelBox {
      position: absolute;
      width: 330px;
      height: 136px;
      top: 50%;
      left: 50%;
      border-radius: 10px;
      transform: translate(-50%, -50%);
      background-color: #fff;
      .modelContent {
        height: 82px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #2d354c;
        font-size: 16px;
        @extend .ff-bold;
      }
      .modelSubmit {
        display: flex;
        text-decoration: row;
        .modelBtn1 {
          width: 49%;
          height: 50px;
          border-radius: 0 0 0 10px;
          border: 2px solid #f79f1a;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #f79f1a;
          font-size: 16px;
          @extend .ff-bold;
        }
        .modelBtn2 {
          width: 50%;
          height: 54px;
          border-radius: 0 0 10px 0;
          background-color: #f79f1a;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          font-size: 16px;
          @extend .ff-bold;
        }
      }
    }
  }
</style>
