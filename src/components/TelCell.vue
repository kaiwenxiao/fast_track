<!--
 * @Author: 黄荣基
 * @Date: 2021-01-05 16:17:00
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-01-05 16:17:50
-->
<template>
  <div class="telBox">
    <div class="inputTitle">{{ $t('product.contact-number') }}</div>
    <input class="code" maxlength="10" type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
    —
    <input class="telNum" maxlength="10" type="tel" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
  </div>
</template>
<script>
  export default {};
</script>
<style lang="scss" scoped>
  .telBox {
    padding-bottom: 10px;
    .inputTitle {
      font-size: 12px;
      @extend .ff-bold;
      color: #2d354c;
      padding: 10px 0;
    }
    .code {
      height: 44px;
      width: 31%;
      text-indent: 12px;
      border-radius: 4px;
      border: 1px solid #bebebe;
    }
    .telNum {
      height: 44px;
      width: 58%;
      text-indent: 12px;
      border-radius: 4px;
      border: 1px solid #bebebe;
    }
  }
</style>
