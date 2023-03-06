<template>
  <div class="footer-wrapper">
    <div class="footer-content">
      <div class="footer-item">
        <div>
          <router-link to="/helptopics?backType=-1">{{ $t('basic.help-module-nav') }}</router-link>
        </div>
        <div>
          <router-link to="/termsconditions?backType=-1">{{
            $t('basic.terms-and-conditions')
          }}</router-link>
        </div>
        <div>
          <router-link to="/termsuse?backType=-1">{{ $t('basic.terms-of-use') }}</router-link>
        </div>
        <div>
          <router-link to="/privacypolicy?backType=-1">{{
            $t('basic.privacy-policy')
          }}</router-link>
        </div>
      </div>
      <div class="copy-right">
        <span>&copy; {{ $t('components.footer-rights') }}</span>

        <div class="copy-right-r fr">
          <div>{{ $t('basic.program-name') }}</div>
          <div>
            <span>{{ $t('components.footer-service-provided-desc-1') }}</span>
            <img src="~img/logo-dp-white.svg" alt="" />
            <span>{{ $t('components.footer-service-provided-desc-2') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>
