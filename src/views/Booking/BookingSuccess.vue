<template>
  <div class="bg">
    <Header :showBack="false" />
    <div class="banner">
      <div class="succ-wrapper">
        <!-- <img class="img-succ" src="@/assets/images/Group 16401@2x.png" /> -->
        <div class="succ-desc-wrapper">
          <img class="icon-succ" src="@/assets/images/icon-successful-210608.svg" alt="" />
          <div class="succ-title">{{ $t('product.book-success') }}</div>
          <div class="succ-desc">{{ $t('product.thank-book') }}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="next-wrapper">
        <div class="next-title">{{ $t('product.whay-next') }}</div>
        <div class="container">
          <div class="next-item">
            <img src="@/assets/images/icon-Booking-MC.svg" alt="" />
            <div v-html="$t('product.desc-1')"></div>
          </div>
          <div class="next-item">
            <img src="@/assets/images/icon-QRCode.svg" alt="" />
            <div>{{ $t('product.desc-2') }}</div>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <div class="btn btn-view" @click="gotoUpcoming">{{ $t('product.view-bookp') }}</div>
        <div class="btn btn-home" @click="gotoHome">{{ $t('product.bto-home') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue';

  export default {
    data() {
      return {
        type: null,
      };
    },

    mounted() {
      const type = sessionStorage.getItem('appType');
      this.type = type;
      sessionStorage.removeItem('selectAirport');
      sessionStorage.removeItem('visitDateEN');
      sessionStorage.removeItem('visitDateData');
      sessionStorage.removeItem('time');
      sessionStorage.removeItem('visitDateTimes');
      sessionStorage.removeItem('cipData');
      sessionStorage.removeItem('passengersText');
      sessionStorage.removeItem('personCount');
      sessionStorage.removeItem('guestData');
      sessionStorage.removeItem('timeDataColumns');
    },

    methods: {
      gotoUpcoming() {
        if (this.type === 'app') {
          window.appNative.setSendData({
            appModule: 'Bookings',
            returnHTML: 0,
          });
          window.appNative.handleSend();
        } else {
          this.$router.push('/account/bookings');
        }
      },
      gotoHome() {
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

    components: {
      Header,
    },
  };
</script>
<style lang="scss" scoped>
  @import './index.scss';
  .bg {
    min-height: 100vh;
    padding-bottom: 280px;
    box-sizing: border-box;
    text-align: center !important;
    .banner {
      overflow: hidden;
      .succ-wrapper {
        width: 100vw;
        // height: 720px;
        background: url('~img/Group 16401@2x.jpg') no-repeat;
        background-size: 100% 100%;
        @extend .ff-bold;
        .img-succ {
          width: 90%;
        }
        .succ-desc-wrapper {
          position: relative;
          width: 100%;
          top: 16%;
          left: 50%;
          transform: translateX(-50%);
          .icon-succ {
            width: 100px;
          }
          .succ-title {
            font-size: 32px;
            padding: 40px 0 32px;
            color: #f38b00;
          }
          .succ-desc {
            font-size: 20px;
            color: #fff;
          }
        }
      }
    }

    .content {
      padding: 0 22px 50px 22px;
      max-width: 1440px;
      margin: 0 auto;
      .next-wrapper {
        background-color: #f0ede7;
        width: 950px;
        height: 324px;
        border-radius: 20px;
        padding: 30px 120px;
        // margin: -200px auto 0;
        position: absolute;
        top: 600px;
        left: 50%;
        transform: translateX(-50%);
        .container {
          display: flex;
          align-items: justify;
          justify-content: space-between;
          .next-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 16px;
            @extend .ff-book;
            line-height: 20px;
            padding: 20px;
            img {
              width: 50px;
              height: 100%;
              padding: 20px;
            }
          }
        }
      }
      .btn {
        width: 300px;
        height: 52px;
        line-height: 52px;
        font-size: 20px;
        @extend .ff-bold;
        text-align: center;
        color: #ffffff;
        box-sizing: border-box;
        border-radius: 8px;
        background-color: #ff8c00;
        cursor: pointer;
      }
      .btn-home {
        line-height: 48px;
        font-size: 18px;
        margin-top: 20px;
        color: #ff671b;
        border: 2px solid #ff671b;
        background-image: none;
        background-color: transparent;
      }
      .btn-box {
        position: absolute;
        top: 520px;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .next-title {
      @extend .ff-bold;
      font-size: 32px;
      padding: 30px 0;
    }

    @media screen and (max-width: 750px) {
      .banner {
        margin: 0 auto;
        .succ-wrapper {
          background: url('~img/booking-succ-img.jpg') no-repeat;
          background-size: cover;
          width: 100%;
          padding: 70px 0 30px;
          .img-succ {
            width: 100%;
          }
          .succ-desc-wrapper {
            .icon-succ {
              width: 54px;
            }
            .succ-title {
              font-size: 28px;
              padding: 20px 0 14px;
            }
          }
        }
      }

      .content {
        position: relative;
        // top: -200px !important;
        .next-wrapper {
          text-align: left;
          position: unset;
          background-color: unset;
          width: 100%;
          height: 100%;
          transform: unset;
          padding: 30px 0 30px 0;
          .next-title {
            font-size: 16px;
            padding: 0;
          }
          .container {
            display: unset;
            .next-item {
              font-size: 14px;
              display: flex;
              flex-direction: row;
              padding: 20px 0;
              img {
                width: 35px;
                height: 100%;
                padding: 0 18px 0 0;
              }
            }
          }
        }
        .btn {
          width: 300px;
          height: 52px;
          line-height: 46px;
          font-size: 20px;
          text-align: center;
          color: #ffffff;
          box-sizing: border-box;
          border-radius: 8px;
          background-color: #ff8c00;
          cursor: pointer;
          width: 100%;
        }
        .btn-home {
          line-height: 42px;
          font-size: 18px;
          margin-top: 20px;
          color: #ff671b;
          border: 2px solid #ff671b;
          background-image: none;
          background-color: transparent;
        }
        .btn-box {
          position: unset;
          transform: unset;
        }
      }
    }
  }
  @media screen and (max-width: 450px) {
    .content {
      position: relative;
      top: 0 !important;
    }
  }
  @media screen and (max-width: 1024px) {
    .bg {
      padding-bottom: 0 !important;
      background-color: #f0ede7;
    }
  }
  @media screen and (min-width: 750px) {
    .banner {
      .succ-wrapper {
        height: 720px;
      }
    }
  }
</style>
