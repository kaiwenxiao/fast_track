<template>
  <div class="fail-wrapper">
    <img class="icon-error" src="~img/icn-error@2x.png" alt="" />
    <div class="fail-title">{{ $t('signup.card-declined') }}</div>
    <div class="desc">{{ $t('signup.reject-card') }}</div>
    <div class="desc">
      {{ $t('signup.warn-card') }}
    </div>
    <router-link to="/sign-up/step-1" tag="div" class="btn">{{
      $t('signup.go-back-to')
    }}</router-link>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .fail-wrapper {
    width: 400px;
    margin: 0 auto;
    padding: 100px 0 115px;
    .icon-error {
      width: 50px;
      height: 50px;
    }
    .fail-title {
      font-size: 32px;
      @extend .ff-bold;
      padding: 30px 0 40px;
      color: $red;
    }
    .desc {
      line-height: 20px;
      font-size: 16px;
      @extend .ff-book;
      color: $black;
      padding-bottom: 15px;
    }
    .btn {
      @include confirmBtn(100%, 52px, 16px, 8px);
      margin-top: 15px;
    }
  }

  @media screen and (max-width: 1024px) {
    .fail-wrapper {
      width: 88%;
      padding-bottom: 175px;
    }
  }
</style>
