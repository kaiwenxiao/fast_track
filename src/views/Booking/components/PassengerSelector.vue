<template>
  <div class="selector">
    <div class="passenger-wrapper">
      <!-- <img class="icon-passenger" src="@/assets/images/icon-people@2x.png" /> -->
      <div class="passenger-desc-wrapper">
        <p class="passenger-desc-title">{{ $t('product.passengers') }}</p>
        <p class="passenger-desc">
          {{
            Number(freeEntry) > 0
              ? $t('product.age-and-above', { age: freeEntry })
              : $t('product.all-passengers')
          }}
        </p>
      </div>
      <div class="price-wrapper">
        <div class="price">{{ currency }}{{ price.toFixed(2) }}</div>
        <div class="price-desc">{{ $t('product.person') }}</div>
      </div>

      <van-stepper
        class="passenger-picker flexRight"
        v-model="count"
        theme="round"
        button-size="25"
        disable-input
        min="1"
        :max="maxAllowPreBookingCount"
        color="#F38B00"
      />
    </div>
    <div class="note">
      <div class="noteTitle">{{ $t('account.note') }}</div>
      <div class="noteContent">
        {{
          Number(freeEntry) > 0
            ? $t('product.ticket-free-age-desc-1', { age: freeEntry })
            : $t('product.ticket-free-age-desc-2')
        }}
      </div>
    </div>
    <div class="maxInfo">
      {{ $t('product.passengers-maximum', { max: maxAllowPreBookingCount }) }}
    </div>

    <div class="totalFooter">
      <div class="totalText total-title">{{ $t('product.total') }}</div>
      <div class="totalText">{{ currency }} {{ (price * count).toFixed(2) }}</div>
      <div class="btn-confirm flexRight" @click="confirm">{{ $t('product.done') }}</div>
    </div>
  </div>
</template>
<script>
  import { Stepper } from 'vant';

  export default {
    props: {
      maxAllowPreBookingCount: Number,
      price: {
        type: Number,
        default: 0,
      },
      currency: String,
      freeEntry: String,
    },
    data() {
      return {
        count: 1,
      };
    },
    methods: {
      confirm() {
        this.$emit('confirm', this.count);
      },
    },

    components: {
      [Stepper.name]: Stepper,
    },
  };
</script>
<style lang="scss" scoped>
  .selector {
    padding: 30px 22px 22px 57px;
    .passenger-wrapper {
      display: flex;
      .icon-passenger {
        height: 20px;
        width: 20px;
        margin-right: 10px;
      }
      .passenger-desc-wrapper {
        font-size: 12px;
        color: #2d354c;
        .passenger-desc-title {
          line-height: 18px;
          font-size: 14px;
          @extend .ff-bold;
        }
        .passenger-desc {
          line-height: 14px;
          color: #959cb9;
        }
      }
      .price-wrapper {
        font-size: 14px;
        color: #2d354c;
        margin-left: 24px;
        .price {
          line-height: 18px;
          @extend .ff-bold;
        }
        .price-desc {
          line-height: 14px;
          font-size: 12px;
          color: #959cb9;
        }
      }
    }
  }
  .note {
    padding: 24px 0;
    .noteTitle {
      font-size: 14px;
      padding-bottom: 8px;
      color: #2d354c;
    }
    .noteContent {
      font-size: 12px;
      color: #2d354c;
      line-height: 1.5;
    }
  }
  .totalFooter {
    display: flex;
    @extend .ff-bold;
    align-items: center;
    .totalText {
      font-size: 18px;
      color: #2d354c;
    }
    .total-title {
      margin-right: 36px;
    }
  }
  .btn-confirm {
    width: 90px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    background-color: #f38b00;
    border-radius: 4px;
    cursor: pointer;
  }
  .maxInfo {
    font-size: 14px;
    color: #2d354c;
    padding: 8px 0 20px;
    @extend .ff-bold;
  }

  @media screen and (max-width: 1024px) {
    .selector {
      padding: 22px;
    }
  }
</style>
