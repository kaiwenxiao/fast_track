<!--
 * @Author: 黄荣基
 * @Date: 2021-01-05 14:41:49
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-01-05 14:57:43
-->
<template>
  <div class="inputBox">
    <div class="inputTitle">{{ titleText }}</div>
    <input class="inputCell" :value="value" maxlength="50" @input="input" />
  </div>
</template>
<script>
  export default {
    props: {
      titleText: String,
      value: '',
    },
    methods: {
      input() {
        this.$emit('handleInput', event.target.value);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .inputBox {
    padding-bottom: 10px;
    .inputTitle {
      font-size: 12px;
      @extend .ff-bold;
      color: #2d354c;
      padding: 10px 0;
    }
    .inputCell {
      height: 44px;
      width: 100%;
      border: 1px solid #bebebe;
      border-radius: 4px;
      text-indent: 12px;
    }
  }
</style>
