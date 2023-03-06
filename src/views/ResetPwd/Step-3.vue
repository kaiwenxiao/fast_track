<template>
  <div class="step-wrapper">
    <div class="step-header">
      <div class="icon-back" @click="goback"></div>
      <div class="step-title">{{ $t('login.set-new-psw') }}</div>
    </div>

    <div class="form">
      <div style="font-size: 14px; padding-bottom: 16px; margin-top: -10px">
        {{ $t('basic.require-field-desc') }}
      </div>
      <div class="form-item form-item-pwd">
        <div class="form-item-label">{{ $t('login.psw') }}*</div>
        <div class="form-input-pwd">
          <input
            :type="PasswordType"
            class="form-item-input"
            :class="{ 'form-input-error': passwordErr }"
            v-model.trim="password"
            maxlength="50"
          />
          <div class="toggle-show-pwd" @click="handleToggleShowPwd('Password')">
            {{ showPassword ? $t('login.hide') : $t('login.show') }}
          </div>
        </div>
        <div class="error-msg" v-show="passwordErr && passwordErrMsg">{{ passwordErrMsg }}</div>
        <div
          class="form-item-desc form-item-desc-pwd"
          :class="{ strong: pwdStrength === $t('signup.pwd-strength-strong') }"
          v-show="password.length > 0"
        >
          {{ $t('signup.pwd-strength') }}:
          <span>{{ pwdStrength }} </span>
        </div>
      </div>
      <div class="password-desc">
        <div class="password-desc-title">{{ $t('signup.pwd-rules-title') }}</div>
        <div class="password-desc-item" v-for="(item, index) in pwdRules" :key="index">
          <div class="password-desc-icon" :class="{ 'password-icon-matched': item.matched }"></div>
          <div :class="{ 'password-desc-matched': item.matched }">{{ $t(item.key) }}</div>
        </div>
      </div>
      <div class="form-item form-item-pwd">
        <div class="form-item-label">{{ $t('account.confirm-new-psw') }}</div>
        <div class="form-input-pwd">
          <input
            :type="ConfirmPasswordType"
            class="form-item-input"
            :class="{ 'form-input-error': confirmPasswordErr }"
            v-model.trim="confirmPassword"
            maxlength="50"
          />
          <div class="toggle-show-pwd" @click="handleToggleShowPwd('ConfirmPassword')">
            {{ showConfirmPassword ? $t('login.hide') : $t('login.show') }}
          </div>
        </div>
        <div class="error-msg" v-show="confirmPasswordErr && confirmPasswordErrMsg">
          {{ confirmPasswordErrMsg }}
        </div>
      </div>
    </div>
    <div class="btn btn-step-3">
      <div v-if="!showLoading" @click="handleContinue">{{ $t('basic.continue') }}</div>
      <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
    </div>
  </div>
</template>

<script>
  import { getQueryString } from '@/utils';
  import { pwdRules } from '@/utils/config';

  export default {
    data() {
      return {
        password: '',
        passwordErr: false,
        passwordErrMsg: '',
        showLoading: false,
        showPassword: false,
        PasswordType: 'password',
        confirmPassword: '',
        confirmPasswordErr: false,
        confirmPasswordErrMsg: '',
        showConfirmPassword: false,
        ConfirmPasswordType: 'password',
        pwdRules,
        email: '',
        captcha: '',
      };
    },

    mounted() {
      this.email = decodeURIComponent(getQueryString('e'));
      this.captcha = getQueryString('c');
      this.pwdRules.forEach(item => {
        item.matched = false;
      });
    },

    methods: {
      goback() {
        this.$router.go(-1);
      },

      handleToggleShowPwd(p) {
        this[`show${p}`] = !this[`show${p}`];
        if (this[`show${p}`]) {
          this[`${p}Type`] = 'text';
        } else {
          this[`${p}Type`] = 'password';
        }
      },

      handleContinue() {
        if (!this.password && !this.confirmPassword) {
          this.passwordErr = true;
          this.confirmPasswordErr = true;
          this.passwordErrMsg = this.$t('error.field-empty-msg');
          this.confirmPasswordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.password) {
          this.passwordErr = true;
          this.passwordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.confirmPassword) {
          this.confirmPasswordErr = true;
          this.confirmPasswordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (this.password !== this.confirmPassword) {
          this.passwordErr = true;
          this.confirmPasswordErr = true;
          this.confirmPasswordErrMsg = this.$t('error.pwd-not-match');
          return;
        }

        if (this.pwdStrength !== this.$t('signup.pwd-strength-strong')) {
          this.passwordErr = true;
          return;
        }

        this.showLoading = true;
        this.$http.login
          .resetPwd({
            email: this.email,
            captcha: this.captcha,
            newPassword: this.password,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              this.$router.push('/reset-pwd/succ');
            } else if (res.state === '00' && res.errorCode === 'err_invalid_pwd') {
              this.passwordErr = true;
              this.confirmPasswordErr = true;
              this.passwordErrMsg = this.$t('error.pwd-invalid');
              this.confirmPasswordErrMsg = this.$t('error.pwd-invalid');
            } else if (res.state === '00' && res.errorCode === 'err_captcha_expiry') {
              // 验证码过期
              this.$router.push(`/reset-pwd/timeout?e=${encodeURIComponent(this.email)}`);
            } else if (res.state === '00' && res.errorCode === 'err_captcha_incorrect') {
              // 验证码有误
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },
    },

    computed: {
      pwdStrength() {
        const allMatched = this.pwdRules.every(item => {
          return item.matched === true;
        });
        return allMatched
          ? this.$t('signup.pwd-strength-strong')
          : this.$t('signup.pwd-strength-weak');
      },
    },

    watch: {
      password(newVal) {
        if (newVal) {
          this.passwordErr = false;
          this.passwordErrMsg = '';
          this.pwdRules.forEach(item => {
            if (item.regExp.test(newVal)) {
              item.matched = true;
            } else {
              item.matched = false;
            }
          });
        } else {
          this.pwdRules.forEach(item => {
            item.matched = false;
          });
        }
      },

      confirmPassword(newVal) {
        if (newVal) {
          this.confirmPasswordErr = false;
          this.confirmPasswordErrMsg = '';
        }
      },
    },
  };
</script>

<style></style>
