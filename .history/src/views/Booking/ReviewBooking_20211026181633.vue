<!--
 * @Author: 黄荣基
 * @Date: 2021-01-05 17:46:11
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-03-10 16:09:51
-->
<template>
  <div class="bg">
    <div v-if="orderInfo">
      <!-- nav部分 -->
      <Header :navTitle="$t('account.fast-track')" @goBack="goBack" />
      <div class="bread-crumb" v-show="appType">
        <router-link to="/">{{ $t('product.home') }}</router-link>
        <span>&gt;</span>
        <router-link to="/airport">{{ $t('home.select-airport') }}</router-link>
        <span>&gt;</span>{{ $t('product.book') }}
        <h1 class="mainTitle">{{ $t('product.book') }}</h1>
      </div>
      <ProgressBarWeb index="3" class="webBar" />
      <ProgressBar
        :thisStep="$t('product.review-booking')"
        :nextStep="$t('product.next-pay-detail')"
        rate="75"
        :circleText="$t('product.3-of-4')"
        class="h5Bar"
      />
      <div class="mainContent">
        <div class="to-back" v-show="appType">
          <div class="click" @click="goStep2">
            <div class="iconBack"></div>
            <span class="text"> {{ $t('basic.page-back') }}</span>
          </div>
        </div>
        <div class="bg-warrppe">
          <div class="container-title">{{ $t('product.review-booking') }}</div>
          <div class="part-box">
            <div class="part1">
              <div class="item">
                <div class="itemTitle">{{ $t('product.city') }}</div>
                <div class="itemName">{{ orderInfo.city }}, {{ orderInfo.country }}</div>
              </div>
              <div class="item">
                <div class="itemTitle">{{ $t('product.airports') }}</div>
                <div class="itemName">{{ orderInfo.airportName }}</div>
              </div>
              <div class="item">
                <div class="itemTitle">{{ $t('product.terminal') }}</div>
                <div class="itemName">{{ orderInfo.terminal }}</div>
              </div>
              <div class="item">
                <div class="itemTitle">{{ $t('product.visit-date-time') }}</div>
                <div class="itemName">
                  {{ orderInfo.visitDateFomat }}, {{ orderInfo.visitTime }}
                </div>
              </div>
              <div class="item">
                <div class="itemTitle">{{ $t('product.no-of-passengers') }}</div>
                <div class="itemName">
                  {{ orderInfo.personCount }}
                  <span v-show="this.$i18n.locale !== 'ru-RU'">
                    {{
                      orderInfo.personCount > 1 ? $t('product.passengers') : $t('product.passenger')
                    }}
                  </span>
                </div>
              </div>
            </div>

            <div class="part2">
              <div class="item">
                <div class="itemTitle">{{ $t('product.passenger-name') }}</div>
                <div class="itemName" v-for="(item, index) in orderInfo.passengers" :key="index">
                  <span v-if="orderInfo.passengers.length > 1">{{ index + 1 }}. </span>
                  {{ item.firstName }} {{ item.lastName }}
                </div>
              </div>
              <div class="item">
                <div class="itemTitle">{{ $t('product.contact-number1') }}</div>
                <div class="itemName">
                  +{{ orderInfo.leaderPassengerInfo[0].phonePrefix }}
                  {{ orderInfo.leaderPassengerInfo[0].phone }}
                </div>
              </div>
              <div class="item">
                <div class="itemTitle">{{ $t('product.email-address1') }}</div>
                <div class="itemName">{{ orderInfo.leaderPassengerInfo[0].email }}</div>
              </div>
            </div>

            <div class="part3">
              <div class="item">
                <div class="itemTitle">{{ $t('product.operating-hours') }}</div>
                <div class="itemName">{{ orderInfo.businessHour }}</div>
              </div>
              <div class="item">
                <div class="itemTitle">{{ $t('product.location') }}</div>
                <div class="itemName">{{ orderInfo.location }}</div>
              </div>
              <div class="item" v-if="orderInfo.note">
                <div class="itemTitle">{{ $t('product.notes') }}</div>
                <div class="itemName">{{ orderInfo.note }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Continue按钮部分 -->
      <div class="btn-continue">
        <SubmitBtn :text="$t('basic.continue')" @click.native="handleContinue" />
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue';
  import BoxBg from '@/components/BoxBg.vue';
  import ProgressBar from '@/views/Booking/components/ProgressBar.vue';
  import ProgressBarWeb from '@/views/Booking/components/ProgressBarWeb.vue';
  import { formatDateEN } from '@/utils/index';
  import SubmitBtn from '@/views/Booking/components/SubmitBtn.vue';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        orderInfo: null,
        loadingSpin: require('@/assets/images/spin.gif'),
        appType: false,
      };
    },

    components: {
      Header,
      BoxBg,
      ProgressBar,
      ProgressBarWeb,
      SubmitBtn,
    },

    mounted() {
      const appType = sessionStorage.getItem('appType');
      if (appType === 'web') {
        this.appType = true;
        if (this.localeInit) {
          this.reviewBooking();
        }
      }
      if (appType === 'app') {
        this.reviewBooking();
      }
    },

    methods: {
      goStep2() {
        this.$router.push('/personaldetails');
      },
      reviewBooking() {
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          icon: this.loadingSpin,
          className: 'loading-spin',
        });
        const orderNo = sessionStorage.getItem('orderNo');
        this.$http.booking
          .reviewBooking({ orderNo })
          .then(res => {
            this.$toast.clear();
            const { data, state } = res;
            if (state === '11') {
              const leaderPassengerInfo = data.passengers.filter(item => {
                return item.isLeaderPassenger === 1;
              });
              data.leaderPassengerInfo = leaderPassengerInfo;
              data.visitDateFomat = formatDateEN(new Date(data.visitDate));
              this.orderInfo = data;
            } else {
              res.note && this.$toast(res.note);
            }
          })
          .catch(() => {
            this.$toast.clear();
          });
      },

      goBack() {
        this.goStep2();
      },

      handleContinue() {
        this.$router.push({ path: '/paymentdetails' });
      },
    },

    computed: {
      ...mapState(['localeInit']),
    },

    watch: {
      localeInit() {
        this.reviewBooking();
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  @import './index.scss';

  .bg {
    .mainContent {
      margin: 24px auto 32px;
      // width: 92%;
      .bg-warrppe {
        @include cardBox(0, 0, 0, 0);
        text-align: left;
        padding: 40px;
        color: #2d354c;
        box-sizing: border-box;
        .container-title {
          font-size: 20px;
          @extend .ff-bold;
          padding-bottom: 8px;
        }
        .part1 {
          padding-right: 5%;
          width: 20%;
        }
        .part-box {
          display: flex;
          flex-flow: wrap;
          .part2 {
            padding: 0 8%;
          }
          .part3 {
            padding-left: 10%;
            width: 20%;
          }
        }
        .item {
          padding: 8px 0;
          flex: 20px;
          .itemTitle {
            font-size: 18px;
            @extend .ff-bold;
            color: #141413;
            padding: 5px 0;
          }
          .itemName {
            line-height: 20px;
            font-size: 16px;
            color: #141413;
            padding: 5px 0;
          }
          @media screen and (max-width: 1024px) {
            .itemTitle {
              font-size: 14px;
              padding: 3px 0;
            }
            .itemName {
              font-size: 14px;
              padding: 3px 0;
            }
          }
        }
      }
      .book-btn-wrapper {
        display: flex;
        height: 88px;
        justify-content: center;
        align-items: center;
        background-color: #f0ede7;
        .book-btn {
          @include confirmBtn();
          width: 80%;
        }
      }
    }
    @media screen and (max-width: 1024px) {
      .mainContent {
        margin: 0;
        .bg-warrppe {
          padding: 16px !important;
          .container-title {
            font-size: 16px;
          }
          .part-box {
            display: unset;
            .part1 {
              padding: 0;
              width: 100%;
            }
            .part2 {
              padding: 0;
            }
            .part3 {
              padding: 0;
              width: unset;
            }
          }
        }
      }
    }
  }
</style>
