<!--
 * @Author: 黄荣基
 * @Date: 2020-12-22 14:23:34
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-03-10 15:56:35
 * @Description: bookingDetails页面的选择框组件
-->
<template>
  <div class="content">
    <div class="title">{{ title }}</div>
    <div class="listItem" @click="show">
      <div class="center">
        <img class="icon" :src="icon" />
        <div class="listItemTitle">{{ cellText }}</div>
      </div>
      <img class="arrow" src="@/assets/images/icon-right-arrow@2x.png" />
    </div>
    <slot></slot>
    <div class="ErrTextStyle" v-show="showErr">{{ ErrText }}</div>
  </div>
</template>
<script>
  export default {
    props: {
      cellText: String,
      icon: String,
      title: String,
      ErrText: String,
      showErr: Boolean,
    },

    methods: {
      show() {
        this.$emit('show');
      },
    },
  };
</script>
<style lang="scss" scoped>
  .content {
    padding: 16px 12px 13px 12px;
    box-sizing: border-box;
    .title {
      font-size: 16px;
      padding-bottom: 10px;
      color: #141413;
      @extend .ff-bold;
    }
    .listItem {
      display: flex;
      text-decoration: row;
      justify-content: space-between;
      align-items: justify;
      border: 1px solid #6e6e6e;
      border-radius: 4px;
      height: 44px;
      cursor: default;
      .center {
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          height: 31px;
          width: 31px;
          padding: 0 14px 0 12px;
        }
        .listItemTitle {
          color: #2d354c;
          font-size: 16px;
          @extend .ff-book;
        }
      }
    }

    .arrow {
      width: 20px;
      height: 20px;
      padding: 13px;
      transform: rotate(90deg);
    }
  }
  @media screen and (max-width: 1024px) {
    .content {
      .title {
        font-size: 12px;
      }
      .arrow {
        transform: none;
      }
      .listItem {
        border: unset;
        .center {
          .icon {
            width: 25px;
            height: 25px;
            padding: 0 10px 0 0;
          }
          .listItemTitle {
            font-size: 13px;
          }
        }
      }
    }
  }
</style>
