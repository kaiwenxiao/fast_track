<template>
  <div class="menu-content-wrapper update-card-wrapper">
    <router-link to="/account" class="back">
      <img src="~img/Icon ionic-ios-arrow-back@2x.png" alt="" />
      {{ $t('account.back') }}</router-link
    >
    <div class="content-title" v-html="$t('account.tab-update-card')"></div>
    <div class="desc">
      {{ $t('account.update-card-desc') }}
    </div>
    <div class="warming">
      <span class="icon-warming"></span>
      {{ $t('account.warn-desc') }}
    </div>
    <div class="form">
      <div class="card-no-warming" v-show="showCardNoWarning">
        <span></span>
        {{ cardNoWarningMsg }}
      </div>
      <div style="font-size: 14px; padding-bottom: 16px">{{ $t('basic.require-field-desc') }}</div>
      <div class="form-item">
        <div class="form-label">{{ $t('account.mastercard-card') }}</div>
        <div class="form-card clearfix">
          <div class="card-first6 fl">{{ first6 }}</div>
          <div class="form-input-last10-wrapper fl">
            <input
              class="form-input"
              type="text"
              v-model="last10"
              :class="{ 'form-input-error': last10Err }"
              maxlength="12"
              @input="formatCardNo"
            />
            <div class="error-msg" v-show="last10Err">{{ last10ErrMsg }}</div>
          </div>
        </div>
      </div>
      <div class="form-item-wrapper">
        <div class="form-item form-item-expiryDate">
          <div class="form-label">{{ $t('signup.expiry-date') }}</div>
          <input
            class="form-input"
            type="text"
            v-model.trim="expiryDate"
            :class="{ 'form-input-error': expiryDateErr }"
          />
          <div class="error-msg" v-show="expiryDateErr">{{ expiryDateErrMsg }}</div>
        </div>
        <div class="form-item form-item-cvc">
          <div class="form-label">{{ $t('signup.cvc') }}<img src="~img/img-cvc.svg" alt="" /></div>
          <input
            class="form-input"
            type="text"
            v-model.trim="cvc"
            :class="{ 'form-input-error': cvcErr }"
            maxlength="4"
          />
          <div class="error-msg" v-show="cvcErr">{{ cvcErrMsg }}</div>
        </div>
      </div>
    </div>
    <div class="btn-update">
      <div @click="handleUpdateClick" v-if="!showLoading">{{ $t('account.update') }}</div>
      <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
    </div>

    <div class="desc-2">
      {{ $t('account.desc-2') }}
    </div>
    <div class="add-card-wrapper">
      <div class="title">{{ $t('account.have-another') }}</div>
      <div class="add-card-desc" v-html="$t('account.add-card-desc')"></div>
    </div>
    <van-popup class="succ-popup" round :close-on-click-overlay="false" v-model="showSuccPopup">
      <img src="~img/icon-successful-green.svg" alt="" />
      <div class="title">{{ $t('account.update-succ') }}</div>
      <div class="desc">
        {{ $t('account.succ-popup-desc1', { updatedDpidLast4, updatedLast4 }) }}
      </div>
      <div class="desc">
        {{ isPoland ? $t('account.succ-popup-desc2-poland') : $t('account.succ-popup-desc2') }}
      </div>
      <div class="btn-done" @click="clickPopupDone">{{ $t('account.done') }}</div>
    </van-popup>
  </div>
</template>

<script>
  import { getQueryString } from '@/utils';
  import { Popup } from 'vant';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        first6: null,
        last10: '',
        last10Err: false,
        last10ErrMsg: '',
        expiryDate: '',
        expiryDateErr: false,
        expiryDateErrMsg: '',
        cvc: '',
        cvcErr: false,
        cvcErrMsg: '',
        showLoading: false,
        showCardNoWarning: false,
        cardNoWarningMsg: '',
        showSuccPopup: false,
        updatedLast4: null,
        updatedDpidLast4: null,
        isPoland: false,
      };
    },

    mounted() {
      this.setStripePubKey();
      const first6 = getQueryString('first6');
      this.first6 = `${first6.slice(0, 4)} ${first6.slice(4)}`;
    },

    methods: {
      setStripePubKey() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        if (script.readyState) {
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.$http.common.getStripePubkey().then(res => {
                Stripe.setPublishableKey(res.data.pubKey);
              });
            }
          };
        } else {
          // 其他浏览器
          script.onload = () => {
            this.$http.common.getStripePubkey().then(res => {
              Stripe.setPublishableKey(res.data.pubKey);
            });
          };
        }

        script.src = 'https://js.stripe.com/v2/';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.addEventListener('error', () => {
          console.log('stripe.js error---');
        });
      },

      formatCardNo(e) {
        this.last10 = e.target.value.replace(/^(\d{2})(\d{4})/g, '$1 $2 ');
      },

      handleUpdateClick() {
        if (!this.last10 && !this.expiryDate && !this.cvc) {
          this.last10Err = true;
          this.last10ErrMsg = this.$t('error.field-empty-msg');
          this.expiryDateErr = true;
          this.expiryDateErrMsg = this.$t('error.field-empty-msg');
          this.cvcErr = true;
          this.cvcErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.last10) {
          this.last10Err = true;
          this.last10ErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (this.last10.length < 12) {
          this.last10Err = true;
          this.last10ErrMsg = this.$t('error.card-no-length');
          return;
        }

        if (!this.expiryDate) {
          this.expiryDateErr = true;
          this.expiryDateErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.cvc) {
          this.cvcErr = true;
          this.cvcErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        /* eslint-disable */
        this.showLoading = true;
        const expiryMonth = this.expiryDate.substring(0, 2);
        const expiryYear = this.expiryDate.substring(3, 5);

        Stripe.card.createToken(
          {
            number: this.cardNo,
            exp_month: expiryMonth,
            exp_year: expiryYear,
            cvc: this.cvc,
          },
          (status, response) => {
            console.log(response);
            if (response.error) {
              this.showLoading = false;
              if (response.error.param === 'number') {
                this.last10Err = true;
                this.last10ErrMsg = this.$t('error.card-not-eligible');
              } else if (response.error.param === 'cvc') {
                this.cvcErr = true;
                this.cvcErrMsg = this.$t('error.cvc-incorrect');
              } else if (
                response.error.param === 'exp_month' ||
                response.error.param === 'exp_year'
              ) {
                this.expiryDateErr = true;
                this.expiryDateErrMsg = this.$t('error.expiry-date-incorrect');
              } else {
                this.$toast(response.error.message || this.$t('error.card-invalid'));
              }
            } else {
              const { id } = response;
              this.getMasterToken(id, expiryMonth, expiryYear);
            }
          }
        );
        /* eslint-disable */
      },

      getMasterToken(stripeToken, expiryMonth, expiryYear) {
        this.$http.login
          .getMasterToken({
            stripeToken,
            cardNo: this.cardNo,
            expiryYear,
            expiryMonth,
            channel: 'master-europe',
            userId: this.userInfo.userId,
          })
          .then(res => {
            if (res.state === '11') {
              this.updateSubmit(res.data.token);
            } else {
              this.showLoading = false;
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },

      updateSubmit(masterToken) {
        this.$http.account
          .updateCard({ masterToken })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              const {
                data: { last4, dpid, isPoland },
              } = res;
              this.updatedLast4 = last4;
              this.updatedDpidLast4 = dpid?.substr(-4);
              this.isPoland = isPoland;
              this.showSuccPopup = true;
            } else if (res.state === '00' && res.errorCode === 'err_card_is_reg') {
              // 信用卡已被注册
              this.last10Err = true;
              this.showCardNoWarning = true;
              this.cardNoWarningMsg = this.$t('error.update-card-is-reg');
            } else if (res.state === '00' && res.errorCode === 'err_card_not_eligible') {
              // 信用卡不适用于本项目
              this.last10Err = true;
              this.showCardNoWarning = true;
              this.cardNoWarningMsg = this.$t('error.card-not-eligible');
            } else {
              res.note && this.$toast(res.note);
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },

      clickPopupDone() {
        this.showSuccPopup = false;
        this.$router.push('/account');
      },
    },

    computed: {
      cardNo() {
        return `${this.first6}${this.last10}`.replace(/\s+/g, '');
      },
      ...mapState(['userInfo']),
    },

    components: {
      [Popup.name]: Popup,
    },

    watch: {
      last10(newVal) {
        if (newVal) {
          this.last10Err = false;
          this.last10ErrMsg = '';
          if (this.showCardNoWarning) {
            this.showCardNoWarning = false;
            this.cardNoWarningMsg = '';
          }
        }
      },

      expiryDate(newVal, oldVal) {
        if (newVal) {
          this.expiryDateErr = false;
          this.expiryDateErrMsg = '';

          if (!/^[0-9/]+$/.test(newVal)) {
            this.expiryDate = oldVal;
            return false;
          }

          if (newVal.length > oldVal.length && newVal.length === 2) {
            this.expiryDate = `${newVal}/`;
          }

          if (newVal.length > 5) {
            this.expiryDate = oldVal;
          }
        }
      },

      cvc(newVal) {
        if (newVal) {
          this.cvcErr = false;
          this.cvcErrMsg = '';
        }
      },
    },
  };
</script>

<style lang="scss">
  @import './Index.scss';
</style>
