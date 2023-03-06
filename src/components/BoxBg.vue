<!--
 * @Author: 黄荣基
 * @Date: 2021-01-05 17:54:46
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-03-09 15:03:51
-->
<template>
  <div class="box">
    <div class="content">
      <div class="box-row">
        <slot name="icon"></slot>
        <div class="title flexCenter">{{ title }}</div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      title: String,
    },
  };
</script>
<style lang="scss" scoped>
  .box {
    background-color: #ffffff;
    border-radius: 8px;
    text-align: left;
    margin-bottom: 16px;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
    .content {
      padding: 30px 60px;
      box-sizing: border-box;
      .title {
        font-size: 20px;
        @extend .ff-bold;
        color: #2d354c;
        padding: 6px 6px 6px 0;
      }
    }
    @media screen and (max-width: 1024px) {
      .content {
        padding: 10px 16px;
        .title {
          font-size: 16px;
        }
      }
    }
  }
</style>
