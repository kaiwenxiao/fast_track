<!--
 * @Author: 黄荣基
 * @Date: 2021-01-05 16:19:24
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-01-12 17:37:48
-->
<template>
  <div class="emailBox">
    <div class="inputTitle">{{ $t('product.email-address') }}</div>
    <input class="email" maxlength="50" type="text" :value="value" />
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        default: '',
      },
    },
  };
</script>
<style lang="scss" scoped>
  .emailBox {
    padding-bottom: 10px;
    .inputTitle {
      font-size: 12px;
      @extend .ff-bold;
      color: #2d354c;
      padding: 10px 0;
    }
    .email {
      height: 44px;
      width: 100%;
      text-indent: 12px;
      border-radius: 4px;
      border: 1px solid #bebebe;
    }
  }
</style>
