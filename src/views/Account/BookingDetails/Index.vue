<template>
  <div class="menu-content-wrapper booking-detail-wrapper">
    <img class="page-loading" src="~img/spin.gif" v-if="loading" />
    <div v-else>
      <router-link tag="div" to="/account/bookings" class="back">
        <img src="~img/Icon ionic-ios-arrow-back@2x.png" alt="" />
        {{ $t('account.back') }}
      </router-link>
      <div class="title">{{ $t('account.tab-booking-details') }}</div>
      <div class="detail" :class="{ 'border-bottom': !data.status }">
        <div class="detail-top clearfix">
          <div class="detail-top-l fl">
            <img :src="data.airportCover" alt="" />
            <div class="detail-item">
              <div class="label">{{ $t('account.booking-id') }}</div>
              <div class="value">{{ data.bookingId }}</div>
            </div>
          </div>
          <div class="total-wrapper fr">
            <div class="total-title-wrapper clearfix">
              <div class="total-title fl">{{ $t('account.total') }}</div>
              <div class="total-title-r fr">{{ data.orderAmount }}</div>
            </div>
            <div
              class="item clearfix"
              v-for="(item, index) in data.orderAmountDetails"
              :key="index"
            >
              <div class="fl">{{ item.title }}</div>
              <div class="fr">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-item">
            <div class="label">{{ $t('account.city-country') }}</div>
            <div class="value">{{ data.cityCountry }}</div>
          </div>
          <div class="detail-item">
            <div class="label">{{ $t('account.visit-date') }}</div>
            <div class="value">{{ data.serviceTime }}</div>
          </div>
          <div class="detail-item">
            <div class="label">{{ $t('account.operating-hours') }}</div>
            <div class="value">{{ data.operatingHour }}</div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-item">
            <div class="label">{{ $t('account.airport') }}</div>
            <div class="value">{{ data.airport }}</div>
          </div>
          <div class="detail-item">
            <div class="label">{{ $t('product.no-of-passengers') }}</div>
            <div class="value">
              {{ data.passengerCount }}
              {{ data.passengerCount > 1 ? $t('product.passengers') : $t('product.passenger') }}
            </div>
          </div>
          <div class="detail-item">
            <div class="label">{{ $t('account.email') }}</div>
            <div class="value">{{ data.emailAddress }}</div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-item">
            <div class="label">{{ $t('account.terminal') }}</div>
            <div class="value">{{ data.terminal }}</div>
          </div>
          <div class="detail-item">
            <div class="label">{{ $t('account.passenger-name') }}</div>
            <div class="value" v-for="(item, index) in data.passengerNames" :key="index">
              {{ item.title }}. {{ item.value }}
            </div>
          </div>
          <div class="detail-item">
            <div class="label">{{ $t('account.location') }}</div>
            <div class="value">{{ data.location }}</div>
          </div>
        </div>
      </div>
      <div class="detail-mobile">
        <div class="img" :style="{ backgroundImage: `url(${data.airportCover})` }" />
        <div class="total">
          <div class="total-title">
            <span>{{ $t('account.total') }}</span>
            <span>{{ data.orderAmount }}</span>
          </div>
          <div class="total-item" v-for="(item, index) in data.orderAmountDetails" :key="index">
            <span>{{ item.title }}</span>
            <span>{{ item.value }}</span>
          </div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('account.booking-id') }}</div>
          <div class="item-value">{{ data.bookingId }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('account.city-country') }}</div>
          <div class="item-value">{{ data.cityCountry }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('account.airport') }}</div>
          <div class="item-value">{{ data.airport }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('account.terminal') }}</div>
          <div class="item-value">{{ data.terminal }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('account.visit-date') }}</div>
          <div class="item-value">{{ data.serviceTime }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('product.no-of-passengers') }}</div>
          <div class="item-value">
            {{ data.passengerCount }}
            {{ data.passengerCount > 1 ? $t('product.passengers') : $t('product.passenger') }}
          </div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('account.passenger-name') }}</div>
          <div class="item-value" v-for="(item, index) in data.passengerNames" :key="index">
            {{ item.title }}. {{ item.value }}
          </div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('account.operating-hours') }}</div>
          <div class="item-value">{{ data.operatingHour }}</div>
        </div>
        <div class="detail-item">
          <div class="item-label">{{ $t('account.location') }}</div>
          <div class="item-value">{{ data.location }}</div>
        </div>
      </div>
      <div class="note-wrapper" v-if="data.importantNotes">
        <div class="note-title">{{ $t('account.important-notes') }}</div>
        <div class="desc">
          {{ data.importantNotes }}
        </div>
      </div>
      <div class="clearfix btn-wrapper" v-if="!data.status">
        <div class="btn fr" @click="showCancelPopup = true" v-if="data.allowCancel">
          {{ $t('account.cancel-booking') }}
        </div>
        <div class="btn fr" @click="resendEmailPopup = true">
          {{ $t('account.resend-confirmation') }}
        </div>
      </div>
    </div>
    <van-popup v-model="showCancelPopup" :close-on-click-overlay="false" class="cancel-popup">
      <div class="popup-title">{{ $t('account.are-you-sure') }}</div>
      <div class="btn">
        <div @click="cancelBooking" v-if="!showCancelLoading">{{ $t('account.yes') }}</div>
        <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
      </div>
      <div class="btn-no" @click="showCancelPopup = false">{{ $t('account.no') }}</div>
    </van-popup>

    <van-popup v-model="showCancelSucc" :close-on-click-overlay="false" class="cancel-succ">
      <img src="~img/icon-successful-green.svg" alt="" />
      <div class="succ-title">{{ $t('account.cancel-complete') }}</div>
      <div class="succ-desc">
        {{ $t('account.succ-desc') }}
      </div>
      <router-link to="/account/bookings" tag="div" class="btn-done">{{
        $t('account.done')
      }}</router-link>
    </van-popup>

    <van-popup v-model="resendEmailPopup" :close-on-click-overlay="false" class="resend-popup">
      <div class="resend-title">{{ $t('account.resend-confirmation') }}</div>
      <div class="resend-desc">
        {{ $t('account.resend-desc') }}
      </div>
      <div class="form-item">
        <div class="form-label">{{ $t('account.email-address') }}</div>
        <input
          class="form-input"
          type="text"
          :class="{ 'form-input-error': emailErr }"
          v-model.trim="email"
        />
        <div class="error-msg" v-show="emailErr">{{ emailErrMsg }}</div>
      </div>

      <div class="btn-resend">
        <div @click="handleResendClick" v-if="!showLoading">{{ $t('account.send') }}</div>
        <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
      </div>
      <div class="btn-cancel" @click="cancelResendEmail">{{ $t('account.cancel') }}</div>
    </van-popup>

    <van-popup v-model="resendSuccPopup" :close-on-click-overlay="false" class="resend-succ">
      <img src="~img/icon-successful-green.svg" alt="" />
      <div class="succ-title">{{ $t('account.succ') }}</div>
      <div class="desc">{{ $t('account.succ-desc1') }}</div>
      <div class="btn-done" @click="resendSuccPopup = false">{{ $t('account.done') }}</div>
    </van-popup>
  </div>
</template>

<script>
  import { getQueryString } from '@/utils';
  import { mapState } from 'vuex';
  import { emailReg } from '@/utils/config';
  import { Popup } from 'vant';

  export default {
    data() {
      return {
        orderNo: null,
        data: null,
        loading: true,
        showCancelPopup: false,
        showCancelSucc: false,
        resendEmailPopup: false,
        showLoading: false,
        showCancelLoading: false,
        email: '',
        emailErr: false,
        emailErrMsg: '',
        emailReg,
        resendSuccPopup: false,
      };
    },

    mounted() {
      const orderNo = getQueryString('orderNo');
      this.orderNo = orderNo;
      this.localeInit && this.fetchDetails();
    },

    methods: {
      fetchDetails() {
        this.$http.account
          .bookingDetails({
            orderNo: this.orderNo,
          })
          .then(res => {
            this.loading = false;
            if (res.state === '11') {
              this.data = res.data;
            }
          });
      },

      cancelResendEmail() {
        this.email = '';
        this.emailErr = false;
        this.emailErrMsg = '';
        this.resendEmailPopup = false;
      },

      handleResendClick() {
        if (!this.email) {
          this.emailErr = true;
          this.emailErrMsg = this.$t('error.field-empty-msg');
          return;
        }
        if (!this.emailReg.test(this.email)) {
          this.emailErr = true;
          this.emailErrMsg = this.$t('error.email-invalid');
          return;
        }
        this.resendPaySuccEmail();
      },

      cancelBooking() {
        if (this.showCancelLoading) {
          return;
        }
        this.showCancelLoading = true;
        this.$http.account
          .bookingCancel({
            orderNo: this.orderNo,
          })
          .then(res => {
            this.showCancelLoading = false;
            if (res.state === '11') {
              this.showCancelSucc = true;
            }
          });
      },

      resendPaySuccEmail() {
        if (this.showLoading) {
          return;
        }
        this.showLoading = true;
        this.$http.account
          .resendPaySuccEmail({
            orderNo: this.orderNo,
            email: this.email,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              this.resendEmailPopup = false;
              this.resendSuccPopup = true;
            }
          });
      },
    },

    computed: {
      ...mapState(['localeInit']),
    },

    watch: {
      email(newval) {
        if (newval) {
          this.emailErr = false;
          this.emailErrMsg = '';
        }
      },

      localeInit() {
        this.fetchDetails();
      },
    },

    components: {
      [Popup.name]: Popup,
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>
