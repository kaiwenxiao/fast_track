<!--
 * @Author: 黄荣基
 * @Date: 2021-01-05 17:24:58
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-03-09 15:25:00
-->
<template>
  <div class="footerSubmit">
    <a class="submitBtn">
      <a class="btnText">{{ text }}</a>
    </a>
  </div>
</template>
<script>
  export default {
    props: {
      text: String,
    },
  };
</script>
<style lang="scss" scoped>
  .footerSubmit {
    padding-bottom: 20px;
    padding-top: 20px;
    float: right;
    box-sizing: border-box;
    clear: both;
    .submitBtn {
      width: 250px;
      height: 46px;
      border-radius: 6px;
      background: #ff8c00;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        @include btnHoverEffect();
      }
      .btnText {
        font-size: 20px;
        color: #ffffff;
        @extend .ff-bold;
      }
    }
  }
  @media screen and (max-width: 1024px) {
    .footerSubmit {
      padding: 20px 18px;
      background-color: #f0ede7;
      position: unset;
      float: unset !important;
      .submitBtn {
        width: 100%;
        height: 46px;
        border-radius: 6px;
        background: #ff8c00;
        &:hover {
          @include btnHoverEffect();
        }
        .btnText {
          font-size: 20px;
          color: #ffffff;
          @extend .ff-bold;
        }
      }
    }
  }
</style>
