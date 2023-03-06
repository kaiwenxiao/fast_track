<!--
 * @Author: 黄荣基
 * @Date: 2020-12-22 14:23:34
 * @LastEditors: 黄荣基
 * @LastEditTime: 2020-12-24 17:21:53
-->
<template>
  <div class="listItem">
    <div class="listItemTitle">{{ cellText }}</div>
    <img class="arrow" src="@/assets/images/icon-right-arrow@2x.png" />
  </div>
</template>
<script>
  export default {
    props: {
      cellText: String,
    },
  };
</script>
<style lang="scss" scoped>
  .listItem {
    display: flex;
    text-decoration: row;
    justify-content: space-between;
    align-items: justify;
    padding: 20px 0 10px 0;
    border-bottom: 1px solid #dedee6;
    .arrow {
      width: 20px;
      height: 20px;
    }
    .listItemTitle {
      color: #2d354c;
      font-size: 16px;
    }
  }
</style>
