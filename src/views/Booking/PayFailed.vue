<template>
  <div class="page-wrapper">
    <Header :showBack="false" />
    <div class="mainContent">
      <div class="bg">
        <img class="icon-failed" src="@/assets/images/icon-unsuccessful@2x.png" alt="" />
        <div>
          <div class="title" v-if="failType === 'payment'">
            {{ $t('product.payment-unsuccess') }}
          </div>
          <div class="title" v-if="failType === 'booking'">{{ $t('product.bpppk') }}</div>
          <div class="desc">
            <div v-if="failType === 'payment'">
              {{ $t('product.unsuccessful') }}
              <div>{{ $t('product.try-data-again') }}</div>
            </div>
            <div v-if="failType === 'booking'" v-html="$t('product.try-again-desc')">
              <!-- {{ $t('product.try-again-desc') }} -->
            </div>
          </div>
          <div class="btn-wrapper">
            <div class="btn btn-retry" @click="goBack">{{ $t('product.retry') }}</div>
            <div class="btn btn-home" @click="goPageHome">{{ $t('product.bto-home') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue';
  import { getQueryString } from '@/utils';

  export default {
    data() {
      return {
        type: null,
        failType: null,
      };
    },

    mounted() {
      const failType = getQueryString('failType'),
        type = sessionStorage.getItem('appType');
      this.type = type;
      this.failType = failType;
    },

    components: {
      Header,
    },

    methods: {
      goBack() {
        this.$router.push('/paymentdetails');
      },

      goPageHome() {
        if (this.type === 'app') {
          window.appNative.setSendData({
            appModule: 'Home',
            returnHTML: 0,
          });
          window.appNative.handleSend();
        } else {
          this.$router.push('/');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './index.scss';
  .page-wrapper {
    min-height: 100vh;
    padding-bottom: 20px;
    box-sizing: border-box;
    background-color: #f4f4f4;
    .mainContent {
      padding: 124px 20px 0;
      .bg {
        text-align: center !important;
        margin: 0 280px;
        padding: 100px 0;
        border-radius: 20px;
        box-shadow: 3px 3px 10px #00000033;
        .icon-failed {
          width: 80px;
          padding-bottom: 50px;
        }
        .title {
          font-size: 28px;
          @extend .ff-bold;
          padding: 20px 0;
          color: #5f5e5e;
        }
        .desc {
          line-height: 18px;
          font-size: 14px;
          padding-bottom: 30px;
          color: #060605;
          div {
            margin: 0 auto;
            width: 323px;
            &:nth-child(2) {
              padding-top: 18px;
            }
          }
        }
        .btn-wrapper {
          padding: 0 120px;
          .btn {
            width: 100%;
            height: 46px;
            line-height: 46px;
            font-size: 20px;
            @extend .ff-bold;
            text-align: center;
            color: #ffffff;
            box-sizing: border-box;
            border-radius: 4px;
            background: #ff8c00;
            cursor: pointer;
          }
          .btn-home {
            line-height: 42px;
            font-size: 18px;
            margin-top: 20px;
            color: #f38b00;
            border: 2px solid #f38b00;
            background-color: transparent;
          }
        }
      }

      @media screen and (max-width: 1024px) {
        .bg {
          margin: 0 !important;
          padding: 0 !important;
          border-radius: unset;
          box-shadow: unset;
          .icon-failed {
            width: 53px;
            padding-bottom: 0;
          }
          .btn-wrapper {
            padding: 0 !important;
          }
          .desc {
            div {
              width: auto;
            }
          }
        }
      }
    }
  }
</style>
