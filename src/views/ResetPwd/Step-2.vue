<template>
  <div class="step-wrapper">
    <div class="step-header">
      <div class="icon-back" @click="goback"></div>
      <div class="step-title">{{ $t('login.enter-code') }}</div>
    </div>
    <div class="step-desc">
      {{ $t('login.sent-succ-code-desc', { email }) }}
    </div>
    <!-- <div class="step-desc" v-if="!canResendCode">
      You can request a new code after {{ countdown }} sec.
    </div> -->
    <div class="step-desc step-desc-bold">
      {{ $t('login.no-received-code') }}
    </div>
    <div class="step-desc">
      {{ $t('login.please-check') }}
      <span style="text-decoration: underline" @click="resendCode">{{ $t('login.resend') }}</span>
    </div>

    <div class="form">
      <div class="form-item">
        <div class="form-item-label">{{ $t('login.verification-code') }}*</div>
        <input
          class="form-item-input"
          :class="{ 'form-input-error': captchaErr }"
          type="text"
          v-model="captcha"
        />
        <div class="error-msg" v-show="captchaErr">{{ captchaErrMsg }}</div>
      </div>
    </div>
    <div class="btn btn-step-2">
      <div v-if="!showLoading" @click="handleContinue">{{ $t('basic.continue') }}</div>
      <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
    </div>

    <van-popup round v-model="showResendSucc">
      <div class="resend-code-succ">
        <div class="title">{{ $t('login.resend-verification-code') }}</div>
        <div class="succ-desc">{{ $t('login.succ-desc') }}</div>
        <div class="btn-ok" @click="showResendSucc = false">{{ $t('login.ok') }}</div>
      </div>
    </van-popup>

    <van-popup round v-model="showAccountLockPopup" class="account-locked-popup">
      <div class="popup-title">{{ $t('login.account-locked') }}</div>
      <div class="popup-desc">
        {{ accountLockMsg }}
      </div>

      <div class="btn-ok" @click="showAccountLockPopup = false">{{ $t('login.ok') }}</div>
    </van-popup>
  </div>
</template>

<script>
  import { Popup } from 'vant';
  import { getQueryString } from '@/utils';

  export default {
    data() {
      return {
        email: '',
        captcha: '',
        captchaErr: false,
        captchaErrMsg: '',
        showLoading: false,
        countdown: 59,
        timer: null,
        canResendCode: false,
        showResendSucc: false,
        showAccountLockPopup: false,
        accountLockMsg: '',
      };
    },

    mounted() {
      this.email = decodeURIComponent(getQueryString('e'));
      this.handleCountdown();
    },

    methods: {
      goback() {
        this.$router.go(-1);
      },

      handleCountdown() {
        this.timer = setInterval(() => {
          this.countdown -= 1;
          if (this.countdown === 0) {
            clearInterval(this.timer);
            this.canResendCode = true;
            this.countdown = 59;
          }
        }, 1000);
      },

      resendCode() {
        this.canResendCode = false;
        this.$http.login
          .resetPwdEmailVerify({
            email: this.email,
          })
          .then(res => {
            if (res.state === '11') {
              this.showResendSucc = true;
              this.handleCountdown();
            } else if (res.state === '00' && res.errorCode === 'err_req_captcha_frequently') {
              // 验证码请求过于频繁
              this.$router.push(
                `/reset-pwd/error?type=codeFrequently&e=${encodeURIComponent(this.email)}`
              );
            } else if (res.state === '00' && res.errorCode === 'err_email_is_not_exist') {
              // 邮箱不存在
              this.$router.push('/reset-pwd');
            } else if (res.state === '00' && res.errorCode === 'err_account_lock') {
              // 尝试错误次数过多，账号被锁定
              this.showAccountLockPopup = true;
              this.accountLockMsg = this.$t('login.account-locked-desc');
            }
          })
          .catch(() => {});
      },

      handleContinue() {
        if (!this.captcha) {
          this.captchaErr = true;
          this.captchaErrMsg = this.$t('error.field-empty-msg');
          return;
        }
        this.showLoading = true;
        this.$http.login
          .resetPwdCaptchaVerify({
            email: this.email,
            captcha: this.captcha,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              this.$router.push(
                `/reset-pwd/step-3?e=${encodeURIComponent(this.email)}&c=${this.captcha}`
              );
            } else if (res.state === '00' && res.errorCode === 'err_captcha_expiry') {
              // 验证码过期
              this.$router.push(
                `/reset-pwd/error?type=codeExpired&e=${encodeURIComponent(this.email)}`
              );
            } else if (res.state === '00' && res.errorCode === 'err_captcha_incorrect') {
              // 验证码有误
              this.captchaErr = true;
              this.captchaErrMsg = this.$t('login.code-not-recognised');
            } else if (res.state === '00' && res.errorCode === 'err_account_lock') {
              // 尝试错误次数过多，账号被锁定
              this.showAccountLockPopup = true;
              this.accountLockMsg = this.$t('error.reset-pwd-account-lock-desc');
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },
    },

    watch: {
      captcha(newVal) {
        if (newVal) {
          this.captchaErr = false;
          this.captchaErrMsg = '';
        }
      },
    },

    components: {
      [Popup.name]: Popup,
    },
  };
</script>

<style lang="scss" scoped>
  .resend-code-succ {
    width: 400px;
    padding: 42px 64px 52px;
    .title {
      line-height: 35px;
      font-size: 28px;
      @extend .ff-bold;
    }
    .succ-desc {
      line-height: 20px;
      font-size: 16px;
      @extend .ff-book;
      padding: 20px 0;
      text-align: center;
    }
    .btn-ok {
      @include confirmBtn(400px, 52px, 16px, 8px);
      margin: 32px auto 0;
    }
  }
  .reset-pwd-wrapper .content .step-wrapper .step-desc-bold {
    @extend .ff-bold;
    padding-top: 10px;
  }

  @media screen and (max-width: 1024px) {
    .resend-code-succ {
      width: 300px;
      padding: 40px 20px;
      box-sizing: border-box;
      .title {
        font-size: 22px;
      }
      .succ-desc {
        padding: 16px 0;
      }
      .btn-ok {
        width: 100%;
      }
    }
  }
</style>
