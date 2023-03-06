<template>
  <div class="account-wrapper">
    <div class="bread-crumb">
      <router-link to="/">{{ $t('account.go-page-home') }}</router-link>
      <span>&gt;</span>
      <router-link :to="`/account/${currentTabObj.path}`">
        <span v-if="currentTab === 'overview'">{{ $t('account.go-page-account-1') }}</span>
        <span>{{ $t(currentTabObj.key) }}</span>
      </router-link>
      <span v-if="breadCrumbSecPath">
        <span>&gt;</span>
        <span v-html="breadCrumbSecPath"></span>
      </span>
    </div>
    <div class="hello-wrapper">
      {{ $t('account.hello') }} {{ firstNameFormat }},
      <span v-if="canRedeemEquity">{{ $t('account.hello-desc') }}</span>
    </div>
    <div class="content clearfix" v-if="!inMobile">
      <ul class="slide-menu">
        <li
          class="menu-item"
          :class="{ 'menu-item-actived': currentTab === item.path }"
          v-for="(item, index) in tabList"
          :key="index"
          @click="handleMenuItemClick(item.path)"
        >
          <span
            class="menu-item-icon"
            :style="{
              backgroundImage:
                currentTab === item.path ? `url(${item.iconActived})` : `url(${item.icon})`,
            }"
          ></span>
          <span class="menu-item-label">{{ $t(item.key) }}</span>
        </li>
      </ul>
      <router-view />
    </div>

    <div class="content-mobile" v-else>
      <van-collapse v-model="activeNames" :border="false">
        <van-collapse-item name="1" title-class="menu-nav">
          <template #title>
            <div class="actived-menu">
              <img :src="currentTabObj.icon" alt="" />
              <div>{{ currentTabObj.label }}</div>
            </div>
          </template>
          <div
            v-for="(item, index) in menuList"
            :key="index"
            class="mune-nav-item"
            @click="handleMenuItemClick(item.path)"
          >
            <img :src="item.icon" alt="" />
            <div>{{ item.label }}</div>
          </div>
        </van-collapse-item>
      </van-collapse>

      <router-view />
    </div>
  </div>
</template>

<script>
  import { accountTab as tabList } from '@/utils/config';
  import { mapState, mapMutations } from 'vuex';
  import { Collapse, CollapseItem } from 'vant';

  export default {
    data() {
      return {
        tabList,
        activeNames: [],
        equity: null,
      };
    },

    mounted() {
      this.localeInit && this.getUserBasicInfo();
    },

    methods: {
      handleMenuItemClick(path) {
        this.activeNames = [];
        if (path === 'logout') {
          this.logout();
        } else {
          this.$router.push(`/account/${path}`);
        }
      },

      logout() {
        this.$http.account.logout().then(res => {
          if (res.state === '11') {
            this.setState({
              state: 'isLogin',
              values: false,
            });
            this.setState({
              state: 'backRouteAfterLogin',
              values: '/',
            });
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('isLogin');
            this.$router.push('/');
          }
        });
      },

      getUserBasicInfo() {
        this.$http.account
          .getAccountInfo()
          .then(res => {
            if (res.state === '11') {
              const {
                data: { membership },
              } = res;

              /* eslint-disable */
              this.equity = membership.entitlements && membership.entitlements[0];
              /* eslint-disable */
            } else {
              res.note &&
                this.$toast({
                  type: 'fail',
                  message: res.note,
                });
            }
          })
          .catch(() => {});
      },

      ...mapMutations(['setState']),
    },

    computed: {
      currentTab() {
        let currentTab = this.$route.name;
        if (currentTab === 'logout') {
          return;
        }
        if (currentTab === 'addCard' || currentTab === 'allCard' || currentTab === 'updateCard') {
          currentTab = 'overview';
        }
        if (currentTab === 'bookingDetails') {
          currentTab = 'bookings';
        }
        return currentTab;
      },

      firstNameFormat() {
        const { firstName } = this.userInfo;
        return `${firstName.slice(0, 1).toUpperCase()}${firstName.slice(1)}`;
      },

      menuList() {
        return this.tabList.filter(item => {
          return item.showInMobile === true;
        });
      },

      currentTabObj() {
        return this.tabList.find(item => {
          return item.path === this.currentTab;
        });
      },

      breadCrumbSecPath() {
        let pathName = this.$route.name;
        let secPath = null;
        switch (pathName) {
          case 'addCard':
            secPath = this.$t('account.tab-add-card');
            break;
          case 'allCard':
            secPath = this.$t('account.tab-all-card');
            break;
          case 'updateCard':
            secPath = this.$t('account.tab-update-card');
            break;
          case 'bookingDetails':
            secPath = this.$t('account.tab-booking-details');
            break;
        }
        return secPath;
      },

      inMobile() {
        return document.documentElement.clientWidth <= 1024;
      },

      equityType() {
        let type = 6;
        if (!this.equity) {
          type = 6;
        } else {
          if (
            this.equity.isUnlimited &&
            this.equity.allowGuestUse &&
            this.equity.guestIsUnlimited
          ) {
            // CH & Guest Unlmited
            type = 1;
          } else if (
            this.equity.isUnlimited &&
            this.equity.allowGuestUse &&
            !this.equity.guestIsUnlimited
          ) {
            // CH: Unlimited ， Guest: * Visits
            type = 2;
          } else if (this.equity.isUnlimited && !this.equity.allowGuestUse) {
            // CH： Unlimited,  Guest: No entitlement
            type = 3;
          } else if (
            !this.equity.isUnlimited &&
            this.equity.allowGuestUse &&
            !this.equity.guestIsUnlimited
          ) {
            // CH+ Guest : * visits
            type = 4;
          } else if (!this.equity.isUnlimited && !this.equity.allowGuestUse) {
            // CH： * visits,  Guest: No entitlement
            type = 5;
          }
        }
        return type;
      },

      canRedeemEquity() {
        let canRedeemEquity = false;
        if (this.equityType === 1 || this.equityType === 2 || this.equityType === 3) {
          canRedeemEquity = true;
        } else if (
          (this.equityType === 4 || this.equityType === 5) &&
          this.equity.remainPoint > 0
        ) {
          canRedeemEquity = true;
        }
        return canRedeemEquity;
      },

      ...mapState(['userInfo', 'localeInit']),
    },

    watch: {
      $route(to, from) {
        if (to.query.showMsg) {
          this.getUserBasicInfo();
        }
      },
      localeInit() {
        this.getUserBasicInfo();
      },
    },

    components: {
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
    },
  };
</script>

<style lang="scss">
  @import './Index.scss';
</style>
