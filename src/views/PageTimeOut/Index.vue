<template>
  <div class="page-time-out-wrapper">
    <img class="icon-error" src="~img/icon-clock.svg" alt="" />
    <div class="title">{{ $t('components.page-time-out') }}</div>
    <div class="desc">
      {{ $t('components.login-text1') }}&nbsp;<span @click="login"
        >{{ $t('components.login-text2') }}&nbsp;</span
      >{{ $t('components.login-text3') }}
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      login() {
        this.$loginModal.show();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>
