<!--
 * @Author: 黄荣基
 * @Date: 2021-03-01 11:20:55
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-03-09 14:54:06
-->
<template>
  <div>
    <div class="bar">
      <div class="content box-row">
        <div class="flexCenter">
          <span class="icon flexCenter" :class="{ activeIcon: isActive1 }">1</span>
          <span class="title" :class="{ activeTitle: isActive1 }">{{
            $t('product.booking-step')
          }}</span>
          <span style="padding: 0 10px">
            <div class="line" :class="{ activeLine: isActive2 }"></div>
          </span>
        </div>
        <div class="flexCenter">
          <span class="icon flexCenter" :class="{ activeIcon: isActive2 }">2</span>
          <span class="title" :class="{ activeTitle: isActive2 }">{{
            $t('product.personal-details')
          }}</span>
          <span style="padding: 0 10px">
            <div class="line" :class="{ activeLine: isActive3 }"></div>
          </span>
        </div>
        <div class="flexCenter">
          <span class="icon flexCenter" :class="{ activeIcon: isActive3 }">3</span>
          <span class="title" :class="{ activeTitle: isActive3 }">{{
            $t('product.review-booking')
          }}</span>
          <span style="padding: 0 10px">
            <div class="line" :class="{ activeLine: isActive4 }"></div>
          </span>
        </div>
        <div class="flexCenter">
          <span class="icon flexCenter" :class="{ activeIcon: isActive4 }">4</span>
          <span class="title" :class="{ activeTitle: isActive4 }">{{
            $t('product.payment-datails')
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      index: String,
    },
    data() {
      return {
        isActive1: false,
        isActive2: false,
        isActive3: false,
        isActive4: false,
        appType: false,
      };
    },
    mounted() {
      switch (this.index) {
        case '1':
          this.isActive1 = true;
          break;

        case '2':
          this.isActive1 = true;
          this.isActive2 = true;
          break;

        case '3':
          this.isActive1 = true;
          this.isActive2 = true;
          this.isActive3 = true;
          break;

        case '4':
          this.isActive1 = true;
          this.isActive2 = true;
          this.isActive3 = true;
          this.isActive4 = true;
          break;

        default:
          break;
      }
      if (this.props === 1) {
        this.isActive1 = true;
      }
    },
  };
</script>
<style lang="scss" scoped>
  .webBar {
    max-width: 1140px;
    padding: 0 20px;
    margin: 0 auto;
  }
  .bar {
    width: 100%;
    background-color: #f0ede7;
    margin: 0 auto;
    border-radius: 10px;
    box-sizing: border-box;
    .content {
      width: 100%;
      padding: 20px;
      justify-content: center;
      box-sizing: border-box;
      .icon {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background-color: #c3c0b8;
        font-size: 20px;
        color: #ffffff;
        font-weight: bold;
        // margin-right: 24px;
      }
      .activeIcon {
        background-color: #8db92e;
      }
      .activeTitle {
        @extend .ff-bold;
        color: #141413 !important;
      }
      .activeLine {
        border-top: 3px solid #8db92e !important;
      }
      .title {
        flex: 1;
        padding-left: 24px;
        font-size: 20px;
        @extend .ff-bold;
        color: #b5b1ab;
      }
      .line {
        width: 50px;
        border-top: 3px solid #d6d0c9;
        font-weight: bold;
      }
    }
  }
</style>
