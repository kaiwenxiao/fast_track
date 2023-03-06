<template>
  <div class="session-time-out">
    <div class="content-wrapper">
      <div class="title">{{ $t('login.verification-code-expired') }}</div>
      <div class="desc">
        {{ $t('login.request-desc') }}
      </div>
      <div class="btn" @click="resendCode">{{ $t('login.request') }}</div>
      <div class="btn-cancel" @click="cancel">{{ $t('login.cancel') }}</div>
    </div>
  </div>
</template>

<script>
  import { getQueryString } from '@/utils';

  export default {
    data() {
      return {
        email: null,
      };
    },

    mounted() {
      this.email = decodeURIComponent(getQueryString('e'));
    },

    methods: {
      resendCode() {
        this.$http.login
          .resetPwdEmailVerify({
            email: this.email,
          })
          .then(res => {
            if (res.state === '11') {
              this.$router.push(`/reset-pwd/step-2?e=${encodeURIComponent(this.email)}`);
            }
          });
      },

      cancel() {
        this.$loginModal.show();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .session-time-out {
    padding: 70px 64px 70px;
    .content-wrapper {
      width: 400px;
      text-align: center;
      margin: 0 auto;
      .title {
        line-height: 35px;
        font-size: 28px;
        @extend .ff-bold;
      }
      .desc {
        line-height: 20px;
        font-size: 16px;
        @extend .ff-book;
        padding: 20px 0 32px;
        color: #060605;
      }
      .btn {
        @include confirmBtn(100%, 52px, 16px, 8px);
      }
      .btn-cancel {
        width: 100%;
        height: 52px;
        line-height: 48px;
        font-size: 16px;
        @extend .ff-bold;
        margin-top: 16px;
        color: #f38b00;
        border: 2px solid #f38b00;
        border-radius: 8px;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }
</style>
