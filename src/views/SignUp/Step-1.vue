<template>
  <div class="form-wrapper">
    <div class="form-desc">
      {{ $t('signup.top-desc') }}
      <div style="font-size: 14px; padding-top: 16px">{{ $t('basic.require-field-desc') }}</div>
    </div>

    <div class="cardNo-warning" v-show="showCardNoWarning">
      <div class="icon-warning"></div>
      <div v-html="cardNoWarningMsg" @click="handleLogin"></div>
    </div>

    <div class="form-item">
      <div class="form-label">{{ $t('signup.mc-card') }}</div>
      <input
        type="text"
        class="form-input"
        :class="{ 'form-input-error': cardNoErr }"
        v-model.trim="cardNoVal"
        maxlength="19"
        @input="handleFormatCardNo"
      />
      <div class="error-msg" v-show="cardNoErr">{{ cardNoErrMsg }}</div>
    </div>

    <div class="form-item form-item-row clearfix">
      <div class="form-item-expiry-date">
        <div class="form-label">{{ $t('signup.expiry-date') }}</div>
        <input
          type="text"
          class="form-input"
          :class="{ 'form-input-error': expiryDateErr }"
          v-model.trim="expiryDate"
        />
        <div class="error-msg" v-show="expiryDateErr">{{ expiryDateErrMsg }}</div>
      </div>
      <div class="form-item-cvc">
        <div class="form-label">
          {{ $t('signup.cvc') }}
          <img src="~img/img-cvc.svg" alt="" />
        </div>
        <input
          type="text"
          class="form-input"
          :class="{ 'form-input-error': cvcErr }"
          v-model.trim="cvc"
          maxlength="4"
        />
        <div class="error-msg" v-show="cvcErr">{{ cvcErrMsg }}</div>
      </div>
    </div>

    <div class="btn-verify">
      <div @click="handleVerify" v-if="!showLoading">{{ $t('signup.btn-verify') }}</div>
      <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
    </div>

    <div class="bottom-desc">
      {{ $t('signup.desc-1') }}
    </div>
  </div>
</template>

<script>
  import ProgressBar from '@/views/Booking/components/ProgressBar.vue';

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
        stripe: null,
        showCardNoWarning: false,
        cardNoWarningMsg: '',
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

      handleVerify() {
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
          })
          .then(res => {
            if (res.state === '11') {
              this.masterCardVerify(res.data.token);
            } else {
              this.showLoading = false;
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },

      masterCardVerify(masterToken) {
        sessionStorage.setItem('regMasterToken', masterToken);
        this.$http.login
          .masterCardVerify({
            masterToken,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              this.$router.push('/sign-up/step-2');
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
          })
          .catch(() => {
            this.showLoading = false;
          });
      },
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

    components: {
      ProgressBar,
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
  .cardNo-warning {
    position: relative;
    line-height: 22px;
    font-size: 14px;
    padding-left: 38px;
    color: #d22a2f;
    margin-top: -16px;
    margin-bottom: 16px;
    .icon-warning {
      position: absolute;
      width: 29px;
      height: 29px;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      background: url('~img/icn-error@2x.png') no-repeat;
      background-size: contain;
    }
  }
</style>
