<!--
 * @Author: 黄荣基
 * @Date: 2021-01-05 11:48:11
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-01-21 11:53:10
 * @Description: bookingDetails页面的detail部分组件
-->
<template>
  <div class="fifthBox">
    <div class="container">
      <div class="title">{{ $t('product.details') }}</div>
      <div class="priceTitle">{{ $t('product.price') }}</div>
      <div class="item box-row detail-item">
        <img :src="icnPassenger" class="adultIcon" />
        <div class="adultText">
          <div class="adultTitle">
            <p class="kind kind-passenger">{{ $t('product.passengers') }}</p>
            <p class="info">
              {{
                Number(freeEntry) > 0
                  ? $t('product.age-and-above', { age: freeEntry })
                  : $t('product.all-passengers')
              }}
            </p>
          </div>
          <div class="adultTitle adultPrice">
            <div class="kind">{{ currency }} {{ price.toFixed(2) }}</div>
            <div class="info">{{ $t('product.person') }}</div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="flex-justify detail-item">
        <div class="openTimeTitle">{{ $t('product.operating-hours') }}</div>
        <div class="openTime">{{ businessHour }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import icnPassenger from '@/assets/images/icn-passenger@2x.png';
  export default {
    props: {
      price: {
        type: Number,
        default: 0,
      },
      count: Number,
      freeEntry: String,
      businessHour: String,
      currency: String,
    },
    data() {
      return {
        icnPassenger,
      };
    },
  };
</script>
<style lang="scss" scoped>
  .fifthBox {
    background-color: #ffffff;
    width: 100%;
    margin: 16px 0;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    .container {
      padding: 0 16px;
      .title {
        @extend .ff-bold;
        font-size: 16px;
        color: #2d354c;
        padding: 16px 0;
        border-bottom: 1px solid #e3e3e3;
      }
      .priceTitle {
        font-size: 14px;
        color: #141413;
        @extend .ff-bold;
        padding: 12px 8px;
      }
      .item {
        padding: 0 0 24px;
        .adultIcon {
          height: 30px;
          width: 30px;
          margin-right: 5px;
        }
        .adultText {
          width: 100%;
          .adultTitle {
            float: left;
            font-size: 14px;
            color: #141413;
            .kind {
              @extend .ff-bold;
              padding: 6px 0;
              color: #2d354c;
            }
            .kind-passenger {
              color: #6e6e6e;
            }
            .info {
              font-size: 14px;
              color: #6e6e6e;
            }
          }
          .adultPrice {
            float: right;
            width: auto;
            font-size: 14px;
            color: #2d354c;
          }
        }
      }
      .detail-item {
        padding-right: 23px;
      }
      .openTimeTitle {
        font-size: 14px;
        color: #141413;
        @extend .ff-bold;
        padding: 16px 0 24px;
        width: 50%;
      }
      .openTime {
        font-size: 14px;
        color: #2d354c;
        @extend .ff-bold;
        padding: 16px 0 24px;
        text-align: right;
        width: 50%;
      }
    }
  }
</style>
