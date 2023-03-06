<template>
  <div class="server-error-wrapper">
    <img src="~img/icn-error@2x.png" alt="" />
    <div class="server-error-title">{{ $t('components.connection-error') }}</div>
    <div class="server-error-desc">
      {{ $t('components.try-again') }}
    </div>
    <div class="btn-ok" @click="okClick">{{ $t('components.ok') }}</div>
  </div>
</template>

<script>
  export default {
    methods: {
      okClick() {
        this.$router.go(-1);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>
