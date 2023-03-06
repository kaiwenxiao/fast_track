<template>
  <div>
    <div
      class="sign-up-step-wrapper"
      v-if="pathname !== 'sign-up-succ' && pathname !== 'sign-up-fail'"
    >
      <h1 class="step-title">{{ $t('signup.create-account') }}</h1>

      <div class="step-progress clearfix">
        <div class="step-item current-step">
          <div class="step-flag">1</div>
          <div class="step-desc">{{ $t('signup.card-verification') }}</div>
        </div>
        <div
          class="step-line"
          :class="{
            'step-line-actived': progressLineActived,
          }"
        ></div>
        <div class="step-item" :class="{ 'current-step': progressLineActived }">
          <div class="step-flag">2</div>
          <div class="step-desc">{{ $t('signup.personal-details') }}</div>
        </div>
      </div>

      <ProgressBar
        :thisStep="progressData.thisStep"
        :nextStep="progressData.nextStep"
        :rate="progressData.rate"
        :circleText="progressData.circleText"
        class="step-progress-mobile"
        v-if="progressData"
      />
      <router-view />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
  import ProgressBar from '@/views/Booking/components/ProgressBar.vue';
  import i18n from '../../i18n';

  const stepProgressBar = {
    'sign-up-step-1': {
      thisStep: i18n.t('signup.card-verification'),
      nextStep: i18n.t('signup.next-personal-details'),
      rate: '50',
      circleText: i18n.t('signup.1-of-2'),
    },
    'sign-up-step-2': {
      thisStep: i18n.t('signup.personal-details'),
      nextStep: '',
      rate: '100',
      circleText: i18n.t('signup.2-of-2'),
    },
  };

  export default {
    data() {
      return {};
    },

    mounted() {},

    computed: {
      pathname() {
        return this.$route.name;
      },

      progressData() {
        return stepProgressBar[this.pathname];
      },

      progressLineActived() {
        if (this.pathname === 'sign-up-step-2' || this.pathname === 'sign-up-succ') {
          return true;
        }
        return false;
      },
    },

    components: {
      ProgressBar,
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>
