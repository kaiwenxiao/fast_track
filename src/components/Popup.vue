<!--
 * @Author: 黄荣基
 * @Date: 2020-12-24 15:42:43
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-01-18 11:03:22
-->
<template>
  <van-popup class="modelWrapper" v-model="show" position="bottom">
    <div class="modelBox" :style="{ height: height }">
      <div class="modelHeader">
        <img :src="icon" @click="close" class="iconClose" />
        <div class="modelTitle">
          <div>{{ title }}</div>
        </div>
      </div>
      <div class="line"></div>
      <slot></slot>
    </div>
  </van-popup>
</template>
<script>
  import { Popup } from 'vant';

  export default {
    data() {
      return {};
    },

    props: {
      title: String,
      icon: String,
      height: String,
      show: Boolean,
    },

    methods: {
      close() {
        this.$emit('close');
      },
    },

    components: {
      [Popup.name]: Popup,
    },
  };
</script>
<style lang="scss" scoped>
  .modelWrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 100;
    overflow-x: hidden;
    .modelBox {
      position: absolute;
      width: 100%;
      bottom: 0;
      border-radius: 10px 10px 0 0;
      background-color: #fff;
      .modelHeader {
        display: flex;
        text-decoration: row;
        .iconClose {
          width: 40px;
          height: 40px;
        }
        .modelTitle {
          @extend .ff-bold;
          font-size: 16px;
          padding: 16px 0;
          width: 90%;
          color: #2d354c;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
