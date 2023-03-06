<template>
  <div
    class='page-header-wrapper'
    :class="{
      'page-header-wrapper-fixed': scrollFlag,
      'page-header-wrapper-home': routeName === 'Home',
    }"
  >
    <div class='page-header-content clearfix'>
      <img class='logo-mc' src='~img/logo-mc.png' alt='' @click="link('/')" />
      <div class='content-r'>
        <div class='content-item' @click="link('/helptopics')">
          {{ $t('basic.help-module-nav') }}
        </div>
        <van-popover
          v-model='showLanguagePopover'
          trigger='click'
          @select='handleLanguagePopoverClick'
          :offset='[-70, 10]'
          get-container='getContainer'
          class='lang-popover'
        >
          <div
            class='popover-item'
            v-for='_ in languageOpts'
            :key='_.shortName'
            @click='selctLang(_)'
          >
            <div class=''>
              <span
                :class="{
                  'ru-font': _.acceptLang === 'ru-RU',
                  'el-font': _.acceptLang === 'el-GR',
                }"
              >{{ _.name }}</span
              >
            </div>
            <img
              class=''
              src='~img/ticked-box-checked.png'
              alt=''
              v-if='$i18n.locale === _.acceptLang'
            />
          </div>
          <template #reference>
            <div class='content-item content-item-locale' v-if='languageOpts.length > 0'>
              <div class='icon-locale' />
              {{ currentLanguage }}
              <div class='arrow-down'></div>
              <div class='line-vertical'></div>
            </div>
          </template>
        </van-popover>

        <van-popover
          v-model='showPopover'
          trigger='click'
          @select='handlePopoverClick'
          :offset='[-20, 10]'
          get-container='getContainer'
          v-if='isLogin'
          class='user-popover'
        >
          <router-link tag='div' to='/account' class='popover-item'>{{
              $t('components.header-my-account')
            }}
          </router-link>
          <div class='popover-item' @click="clickPopoverItem('bookings')">
            {{ $t('components.bookings') }}
          </div>
          <div class='popover-item' @click.stop="clickPopoverItem('logout')">
            {{ $t('components.header-logout') }}
          </div>
          <template #reference>
            <div class='content-item content-item-username'>
              {{ userInfo.firstName }} {{ userInfo.lastName }}
              <div class='icon-account' />
            </div>
          </template>
        </van-popover>

        <div class='content-item' v-if='!isLogin' @click='login'>
          {{ $t('components.header-login') }}
        </div>
        <div class='content-item sign-up' v-if='!isLogin' @click="link('/sign-up')">
          {{ $t('components.header-signup') }}
        </div>
      </div>
    </div>

    <div class='page-header-content page-header-content-mobile clearfix'>
      <img class='logo-mc' src='~img/logo-mc.png' alt='' @click="link('/')" />
      <img class='icon-nav' src='~img/icon-nav-white@2x.png' alt='' @click='showNav' />
      <div class='nav-sign-up' v-if='!isLogin' @click="link('/sign-up')">
        {{ $t('components.header-signup') }}
      </div>
    </div>

    <van-popup v-model='showNavMenu' position='right' class='nav-menu-wrapper'>
      <div class='nav-close' @click='closeNavMenu'>
        <img class='fr' src='~img/icon-mobile-nav-closed.svg' alt='' />
      </div>
      <div class='nav-item' @click="link('/helptopics')">{{ $t('basic.help-module-nav') }}</div>
      <div class='nav-item nav-item-select' @click='clickLanguageSelect'>
        <img class='icon-locale' src='~img/icon-locale.svg' alt='' />
        <div class='language-select-r'>
          <div>{{ currentLanguage }}</div>
          <img
            class='arrow'
            :class="{ 'arrow-up': showLanguageSelect }"
            src='~img/icon-down-arrow-black.svg'
            alt=''
          />
        </div>
      </div>
      <div class='language-select-box' v-show='showLanguageSelect'>
        <div
          class='language-item'
          :class="{ 'fs-bold': $i18n.locale === _.acceptLang }"
          v-for='_ in languageOpts'
          :key='_.shortName'
          @click='selctLang(_)'
        >
          <div class=''>
            <!-- <span>{{ $t(`basic.lang-${_.label}`) }}</span>
            <span v-if="$i18n.locale !== _.value"
              >&nbsp;({{ $i18n.messages[_.value].basic[`lang-${_.label}`] }})</span
            > -->
            <span>{{ _.name }}</span>
          </div>
          <img
            class=''
            src='~img/ticked-box-checked.png'
            alt=''
            v-if='$i18n.locale === _.acceptLang'
          />
        </div>
      </div>
      <div class='nav-item nav-item-line'>
        <div class='line'></div>
      </div>
      <!-- <div class="nav-item" v-if="!isLogin" @click="link('/sign-up')">Sign Up</div> -->
      <div class='nav-item' v-if='!isLogin' @click='login'>{{ $t('components.header-login') }}</div>
      <div class='nav-item nav-item-select' v-if='isLogin' @click='clickAccountSelect'>
        <img class='icon-locale' src='~img/icon-account.svg' alt='' />
        <div class='language-select-r'>
          <div>{{ userInfo.firstName }} {{ userInfo.lastName }}</div>
          <img
            class='arrow'
            :class="{ 'arrow-up': showAccountSelect }"
            src='~img/icon-down-arrow-black.svg'
            alt=''
          />
        </div>
      </div>
      <div class='account-select-box' v-show='isLogin && showAccountSelect'>
        <div class='account-item' @click="clickPopoverItem('account')">
          {{ $t('components.header-my-account') }}
        </div>
        <div class='account-item' @click="clickPopoverItem('bookings')">
          {{ $t('components.bookings') }}
        </div>
        <div class='account-item' @click="clickPopoverItem('logout')">
          {{ $t('components.header-logout') }}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { Popup, Popover } from 'vant';
  import { mapState, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        showNavMenu: false,
        showPopover: false,
        showLanguagePopover: false,
        activeNames: [],
        showLanguageSelect: false,
        showAccountSelect: false,
      };
    },

    mounted() {
      this.getLanguageOpts();
    },

    methods: {
      getLanguageOpts() {
        this.$http.common.languageList().then(res => {
          if (res?.state === '11') {
            this.setState({
              state: 'languageOpts',
              values: res.data,
            });
            this.setLocale(res.data);
          }
        });
      },
      // getLanguageOpts() {
      //   this.$http.common.languageList().then(res => {
      //     if (res?.state === '11') {
      //       this.setState({
      //         state: 'languageOpts',
      //         values: res.data,
      //       });
      //       this.setLocale(res.data)
      //     }
      //   });
      // }

      setLocale(langList) {
        // 语种初始化
        const storageLang = localStorage.getItem('lang');
        const navigatorLang = window.navigator.language.toLowerCase().slice(0, 2);
        const navigatorLangObj = langList.find(_ => {
          return _.shortName?.toLowerCase() === navigatorLang;
        });
        const locale = storageLang || navigatorLangObj?.acceptLang || 'en-US';
        this.$i18n.locale = locale;
        localStorage.setItem('lang', locale);
        // document.body.classList.add(`lang-${locale}`);
        this.setState({
          state: 'localeInit',
          values: true,
        });
      },

      // setLocale(langList) {
      //   const storageLang = localStorage.getItem('lang');
      //   const navigatorLang = window.navigator.language.toLowerCase().slice(0, 2);
      //   const navigatorLangObj = langList.find(_ => {
      //     return _.shortName?.toLowerCase() === navigatorLang
      //   })
      //   const locale = storageLang || navigatorLangObj?.acceptLang || 'en-US'
      //   this.$i18n.locale = locale
      //   localStorage.setItem('lang', locale)
      //   this.setState({
      //     state: 'localInit',
      //     values: true
      //   })
      // }

      login() {
        this.closeNavMenu();
        this.$loginModal.show();
      },

      link(path) {
        this.closeNavMenu();
        this.$router.push(path);
      },

      showNav() {
        this.showNavMenu = true;
      },

      handlePopoverClick(action) {
        console.log(action);
      },

      closeNavMenu() {
        this.showNavMenu = false;
      },

      clickLanguageSelect() {
        this.showLanguageSelect = !this.showLanguageSelect;
      },

      clickAccountSelect() {
        this.showAccountSelect = !this.showAccountSelect;
      },

      handleLanguagePopoverClick() {
      },

      selctLang(_) {
        this.$i18n.locale = _.acceptLang;
        localStorage.setItem('lang', _.acceptLang);
        location.reload();
      },

      clickPopoverItem(type) {
        this.showPopover = false;
        this.closeNavMenu();
        switch (type) {
          case 'logout':
            this.logout();
            break;
          case 'account':
            this.$router.push('/account');
            break;
          case 'bookings':
            this.$router.push('/account/bookings');
            break;
          default:
            break;
        }
      },

      logout() {
        this.$http.account.logout().then(res => {
          if (res.state === '11') {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('isLogin');
            this.setState({
              state: 'isLogin',
              values: false,
            });
            this.add({
              state: 'backRouteAfterLogin',
              values: '/',
            });
            this.$router.push('/');
            this.getLanguageOpts();
          }
        });
      },
      // methods 和 vuex 的state 同名
      ...mapMutations(['setState']),
      // methods 和 vuex 的state 不同名
      ...mapMutations({ add: 'setState' }),
    },

    computed: {
      routeName() {
        return this.$route.name;
      },

      getContainer() {
        return document.querySelector('.page-header-wrapper');
      },

      currentLanguage() {
        const lang =
          this.languageOpts &&
          this.languageOpts.find(_ => {
            return _.acceptLang === this.$i18n.locale;
          });
        return lang?.shortName;
      },

      locale() {
        return this.$i18n.locale;
      },

      ...mapState(['isLogin', 'userInfo', 'languageOpts']),
    },

    watch: {
      locale() {
        this.getLanguageOpts();
      },
    },

    props: {
      scrollFlag: Boolean,
    },

    components: {
      [Popup.name]: Popup,
      [Popover.name]: Popover,
    },
  };
</script>

<style lang='scss' scoped>
  @import './Index.scss';
</style>
