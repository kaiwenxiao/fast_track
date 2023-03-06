<template>
  <div class="menu-content-wrapper add-card-wrapper">
    <router-link to="/account" class="back">
      <img src="~img/Icon ionic-ios-arrow-back@2x.png" alt="" />
      {{ $t('account.back') }}</router-link
    >
    <div class="content-title">{{ $t('account.tab-add-card') }}</div>
    <div class="desc">
      {{ $t('account.add-card-desc-1') }}
    </div>

    <div class="form">
      <div class="card-no-warming" v-show="showCardNoWarning">
        <span></span>
        <p v-html="cardNoWarningMsg" @click="handleLogin"></p>
      </div>
      <div style="font-size: 14px; padding-bottom: 16px">{{ $t('basic.require-field-desc') }}</div>
      <div class="form-item">
        <div class="form-label">{{ $t('signup.mc-card') }}</div>
        <input
          class="form-input"
          type="text"
          v-model.trim="cardNoVal"
          :class="{ 'form-input-error': cardNoErr }"
          maxlength="19"
          @input="handleFormatCardNo"
        />
        <div class="error-msg" v-show="cardNoErr">{{ cardNoErrMsg }}</div>
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
    <div class="btn-add">
      <div @click="handleAddClick" v-if="!showLoading">{{ $t('account.add') }}</div>
      <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
    </div>

    <div class="desc-2">{{ $t('signup.desc-1') }}</div>

    <van-popup v-model="showSuccPopup" class="add-card-succ-popup">
      <img class="icon-succ" src="~img/icon-successful-green.svg" alt="" />
      <div class="popup-title">{{ $t('account.add-card-succ') }}</div>
      <div class="popup-desc" v-html="$t('account.add-card-succ-desc')"></div>
      <div class="popup-desc popup-desc-2">{{ $t('account.popup-desc-2') }}</div>
      <div class="card-no">{{ dpidFormat }}</div>
      <div class="popup-desc">{{ $t('account.popup-desc-3') }}{{ last4 }}</div>
      <div class="btn" @click="handleDone">{{ $t('account.done') }}</div>
    </van-popup>
  </div>
</template>

<script>
  import { Popup } from 'vant';
  import { formatCardNo } from '@/utils/index';
  import { mapState, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        cardNoVal: '',
        cardNo: '',
        cardNoErr: false,
        cardNoErrMsg: '',
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
        dpidFormat: null,
        last4: null,
      };
    },

    mounted() {
      this.setStripePubKey();
    },

    methods: {
      handleFormatCardNo(e) {
        this.cardNoVal = e.target.value
          .replace(/\s/g, '')
          .replace(/[^\d]/g, '')
          .replace(/(\d{4})(?=\d)/g, '$1 ');
        this.cardNo = this.cardNoVal.replace(/\s+/g, '');
      },

      handleLogin(event) {
        if (event.target.className === 'login') {
          this.$loginModal.show();
        }
      },

      handleDone() {
        this.$router.push('/account');
      },

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

      handleAddClick() {
        if (!this.cardNo && !this.expiryDate && !this.cvc) {
          this.cardNoErr = true;
          this.expiryDateErr = true;
          this.cvcErr = true;
          this.cardNoErrMsg = this.$t('error.field-empty-msg');
          this.expiryDateErrMsg = this.$t('error.field-empty-msg');
          this.cvcErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.cardNo) {
          this.cardNoErr = true;
          this.cardNoErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (this.cardNo.length < 16) {
          this.cardNoErr = true;
          this.cardNoErrMsg = this.$t('error.card-no-length');
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
                this.cardNoErr = true;
                this.cardNoErrMsg = this.$t('error.card-not-eligible');
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
              this.addCard(res.data.token);
            } else {
              this.showLoading = false;
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },

      addCard(masterToken) {
        this.$http.account
          .membershipAdd({
            masterToken,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              this.showSuccPopup = true;
              this.dpidFormat = formatCardNo(res.data.dpid);
              this.last4 = res.data.last4;
              this.getLanguageOpts();
            } else if (res.state === '00' && res.errorCode === 'err_card_is_reg') {
              // 信用卡已被注册
              this.cardNoErr = true;
              this.showCardNoWarning = true;
              this.cardNoWarningMsg = this.$t('error.card-is-reg');
            } else if (res.state === '00' && res.errorCode === 'err_card_not_mastercard') {
              // 不是万事达的信用卡
              this.cardNoErr = true;
              this.cardNoErrMsg = this.$t('error.card-not-mastercard');
            } else if (res.state === '00' && res.errorCode === 'err_card_not_eligible') {
              // 信用卡不适用于本项目
              this.cardNoErr = true;
              this.showCardNoWarning = true;
              this.cardNoWarningMsg = this.$t('error.card-not-eligible');
            } else {
              res.note && this.$toast(res.note);
            }
          });
      },

      getLanguageOpts() {
        this.$http.common.languageList().then(res => {
          if (res?.state === '11') {
            this.setState({
              state: 'languageOpts',
              values: res.data,
            });
          }
        });
      },

      ...mapMutations(['setState']),
    },

    computed: {
      ...mapState(['userInfo']),
    },

    components: {
      [Popup.name]: Popup,
    },

    watch: {
      cardNo(newVal) {
        if (newVal) {
          this.cardNoErr = false;
          this.cardNoErrMsg = '';
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

<style lang="scss" scoped>
  @import './Index.scss';
</style>
