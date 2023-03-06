<template>
  <div class="step-wrapper">
    <div class="step-header">
      <div class="icon-back" @click="goback"></div>
      <div class="step-title">{{ $t('login.reset-password') }}</div>
    </div>
    <div class="step-desc">
      {{ $t('login.enter-detail-desc') }}
    </div>
    <div class="form">
      <div class="form-item">
        <div class="form-item-label">{{ $t('login.email*') }}</div>
        <input
          class="form-item-input"
          :class="{ 'form-input-error': emailErr }"
          type="text"
          v-model="email"
        />
        <div class="error-msg" v-show="emailErr">{{ emailErrMsg }}</div>
      </div>
    </div>
    <div class="btn">
      <div v-if="!showLoading" @click="sendCode">{{ $t('login.send-code') }}</div>
      <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
    </div>
    <van-popup round v-model="showAccountLockPopup" class="account-locked-popup">
      <div class="popup-title">{{ $t('login.account-locked') }}</div>
      <div class="popup-desc">
        {{ $t('login.account-locked-desc') }}
      </div>
      <div class="btn-ok" @click="showAccountLockPopup = false">{{ $t('login.ok') }}</div>
    </van-popup>
  </div>
</template>

<script>
  import { emailReg } from '@/utils/config';
  import { Popup } from 'vant';

  export default {
    data() {
      return {
        email: '',
        emailErr: false,
        emailErrMsg: '',
        showLoading: false,
        emailReg,
        showAccountLockPopup: false,
      };
    },

    methods: {
      goback() {
        this.$router.go(-1);
      },

      sendCode() {
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

        this.showLoading = true;
        this.$http.login
          .resetPwdEmailVerify({
            email: this.email,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              this.$router.push(`/reset-pwd/step-2?e=${encodeURIComponent(this.email)}`);
            } else if (res.state === '00' && res.errorCode === 'err_req_captcha_frequently') {
              // 验证码请求过于频繁
              this.$router.push(
                `/reset-pwd/error?type=codeFrequently&e=${encodeURIComponent(this.email)}`
              );
            } else if (res.state === '00' && res.errorCode === 'err_email_is_not_exist') {
              // 邮箱不存在
              this.emailErr = true;
              this.emailErrMsg = this.$t('error.email-invalid');
            } else if (res.state === '00' && res.errorCode === 'err_account_lock') {
              // 尝试错误次数过多，账号被锁定
              this.showAccountLockPopup = true;
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },
    },

    watch: {
      email(newVal) {
        if (newVal) {
          this.emailErr = false;
          this.emailErrMsg = '';
        }
      },
    },

    components: {
      [Popup.name]: Popup,
    },
  };
</script>

<style lang="scss" scoped></style>
