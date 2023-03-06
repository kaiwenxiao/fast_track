<template>
  <div class="menu-content-wrapper">
    <div class="content-title">{{ $t('account.tab-changePassword') }}</div>
    <div class="form">
      <div style="font-size: 14px; padding-bottom: 24px; margin-top: -16px">
        {{ $t('basic.require-field-desc') }}
      </div>
      <div class="form-item">
        <div class="form-label">{{ $t('account.change-pwd-current-pwd') }}</div>
        <div class="form-input-pwd">
          <input
            class="form-input"
            :class="{ 'form-input-error': passwordErr }"
            :type="passwordType"
            v-model.trim="password"
            maxlength="50"
          />
          <div class="toggle-show-pwd" @click="handleToggleShowPwd('password')">
            {{ passwordShow ? $t('login.hide') : $t('login.show') }}
          </div>
        </div>
        <div class="error-msg" v-show="passwordErr && passwordErrMsg">{{ passwordErrMsg }}</div>
      </div>

      <div class="form-item">
        <div class="form-label">{{ $t('account.new-psw') }}</div>
        <div class="form-input-pwd">
          <input
            :type="newPasswordType"
            class="form-input"
            :class="{ 'form-input-error': newPasswordErr }"
            v-model.trim="newPassword"
            maxlength="50"
          />
          <div class="toggle-show-pwd" @click="handleToggleShowPwd('newPassword')">
            {{ newPasswordShow ? $t('login.hide') : $t('login.show') }}
          </div>
        </div>
        <div
          class="form-item-desc form-item-desc-pwd"
          :class="{ strong: pwdStrength === $t('signup.pwd-strength-strong') }"
          v-show="newPassword.length > 0"
        >
          {{ $t('signup.pwd-strength') }}:
          <span>{{ pwdStrength }} </span>
        </div>
        <div class="error-msg" v-show="newPasswordErr && newPasswordErrMsg">
          {{ newPasswordErrMsg }}
        </div>
      </div>
      <div class="password-desc">
        <div class="password-desc-title">{{ $t('signup.pwd-rules-title') }}</div>
        <div class="password-desc-item" v-for="(item, index) in pwdRules" :key="index">
          <div class="password-desc-icon" :class="{ 'password-icon-matched': item.matched }"></div>
          <div :class="{ 'password-desc-matched': item.matched }">{{ $t(item.key) }}</div>
        </div>
      </div>

      <div class="form-item">
        <div class="form-label">{{ $t('account.confirm-new-psw') }}</div>
        <div class="form-input-pwd">
          <input
            class="form-input"
            :class="{ 'form-input-error': confirmPasswordErr }"
            :type="confirmPasswordType"
            v-model.trim="confirmPassword"
            maxlength="50"
          />
          <div class="toggle-show-pwd" @click="handleToggleShowPwd('confirmPassword')">
            {{ confirmPasswordShow ? $t('login.hide') : $t('login.show') }}
          </div>
        </div>
        <div class="error-msg" v-show="confirmPasswordErr && confirmPasswordErrMsg">
          {{ confirmPasswordErrMsg }}
        </div>
      </div>
      <div class="btn-change">
        <div v-if="!showLoading" @click="handleVerify">{{ $t('account.change') }}</div>
        <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
      </div>
    </div>
    <van-popup class="succ-popup" v-model="showSuccPopup">
      <img src="~img/icon-successful-green.svg" alt="" />
      <div class="succ-title">{{ $t('account.succ') }}</div>
      <div class="succ-desc">{{ $t('account.has-been-updated') }}</div>
      <div class="btn-done" @click="handlePopupDone">{{ $t('account.done') }}</div>
    </van-popup>
  </div>
</template>

<script>
  import { Popup } from 'vant';
  import { pwdRules } from '@/utils/config';

  export default {
    data() {
      return {
        passwordShow: false,
        passwordType: 'password',
        password: '',
        passwordErr: false,
        passwordErrMsg: '',
        newPasswordShow: false,
        newPasswordType: 'password',
        newPassword: '',
        newPasswordErr: false,
        newPasswordErrMsg: '',
        confirmPasswordShow: false,
        confirmPasswordType: 'password',
        confirmPassword: '',
        confirmPasswordErr: false,
        confirmPasswordErrMsg: '',
        pwdRules,
        showLoading: false,
        showSuccPopup: false,
      };
    },

    methods: {
      handleToggleShowPwd(pwd) {
        this[`${pwd}Show`] = !this[`${pwd}Show`];
        if (this[`${pwd}Show`]) {
          this[`${pwd}Type`] = 'text';
        } else {
          this[`${pwd}Type`] = 'password';
        }
      },

      handlePopupDone() {
        this.showSuccPopup = false;
        this.resetForm();
      },

      resetForm() {
        this.password = '';
        this.passwordErr = false;
        this.passwordErrMsg = '';
        this.newPassword = '';
        this.newPasswordErr = false;
        this.newPasswordErrMsg = '';
        this.confirmPassword = '';
        this.confirmPasswordErr = false;
        this.confirmPasswordErrMsg = '';
      },

      handleVerify() {
        if (!this.password && !this.newPassword && !this.confirmPassword) {
          this.passwordErr = true;
          this.passwordErrMsg = this.$t('error.field-empty-msg');
          this.newPasswordErr = true;
          this.newPasswordErrMsg = this.$t('error.field-empty-msg');
          this.confirmPasswordErr = true;
          this.confirmPasswordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.password) {
          this.passwordErr = true;
          this.passwordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.newPassword) {
          this.newPasswordErr = true;
          this.newPasswordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.confirmPassword) {
          this.confirmPasswordErr = true;
          this.confirmPasswordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (this.newPassword !== this.confirmPassword) {
          this.newPasswordErr = true;
          this.confirmPasswordErr = true;
          this.confirmPasswordErrMsg = this.$t('error.pwd-not-match');
          return;
        }

        if (this.pwdStrength !== this.$t('signup.pwd-strength-strong')) {
          this.newPasswordErr = true;
          this.confirmPasswordErr = true;
          return;
        }
        this.submit();
      },

      submit() {
        this.showLoading = true;
        this.$http.account
          .passwordChange({
            password: this.password,
            newPassword: this.newPassword,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              this.showSuccPopup = true;
            } else if (res.state === '00' && res.errorCode === 'err_invalid_pwd') {
              this.newPasswordErr = true;
              this.confirmPasswordErr = true;
              this.newPasswordErrMsg = this.$t('error.pwd-invalid');
              this.confirmPasswordErrMsg = this.$t('error.pwd-invalid');
            } else if (res.state === '00' && res.errorCode === 'err_pwd_incorrect') {
              this.passwordErr = true;
              this.passwordErrMsg = this.$t('error.pwd-incorrect');
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
        }
      },

      newPassword(newVal) {
        if (newVal) {
          this.newPasswordErr = false;
          this.newPasswordErrMsg = '';
          if (this.confirmPasswordErr) {
            this.confirmPasswordErr = false;
            this.confirmPasswordErrMsg = '';
          }
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
          if (this.newPasswordErr) {
            this.newPasswordErr = false;
            this.newPasswordErrMsg = '';
          }
        }
      },
    },

    components: {
      [Popup.name]: Popup,
    },

    mounted() {
      this.pwdRules.forEach(item => {
        item.matched = false;
      });
    },
  };
</script>

<style lang="scss">
  @import './Index.scss';
</style>
