<template>
  <div class="succ-wrapper">
    <img class="icon-succ" src="~img/icon-successful-green.svg" alt="" />
    <div class="succ-content">
      <div class="title">{{ $t('login.update-success') }}</div>
      <div class="desc">{{ $t('login.success-desc') }}</div>
    </div>

    <div class="btn" @click="handleLogin">{{ $t('login.go-to-login') }}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        errorType: null,
        email: null,
      };
    },
    methods: {
      handleLogin() {
        this.$loginModal.show();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .succ-wrapper {
    padding: 50px 64px 70px;
    .icon-succ {
      width: 50px;
    }
    .succ-content {
      width: 360px;
      margin: 0 auto;
      .title {
        line-height: 35px;
        font-size: 28px;
        @extend .ff-bold;
        padding: 18px 0 20px;
        color: #81ac25;
      }
      .desc {
        line-height: 20px;
        font-size: 16px;
        @extend .ff-book;
        padding-bottom: 32px;
        color: #060605;
      }
    }
    .btn {
      @include confirmBtn(400px, 52px, 16px, 8px);
    }
  }

  @media screen and (max-width: 1024px) {
    .succ-wrapper {
      width: 88%;
      margin: 0 auto;
      padding-left: 0;
      padding-right: 0;
      .btn {
        width: 100%;
      }
    }
  }
</style>
