<template>
  <div class="menu-content-wrapper all-card-wrapper">
    <img class="page-loading" src="~img/spin.gif" v-if="loading" />
    <div v-else>
      <router-link to="/account" class="back">
        <img src="~img/Icon ionic-ios-arrow-back@2x.png" alt="" />
        {{ $t('basic.page-back') }}</router-link
      >
      <div class="content-title">{{ $t('account.tab-all-card') }}</div>
      <div class="card-wrapper clearfix">
        <div
          class="card-item fl"
          :class="{ 'card-item-actived': currentDpid === item.dpid }"
          v-for="item in list"
          :key="item.dpid"
          @click="selectItem(item.dpid, item.statusCode, item.last4)"
        >
          <div class="tick" :class="{ 'tick-actived': currentDpid === item.dpid }"></div>
          <div class="status">
            <span class="default">{{ $t('account.status') }}</span>
            <span class="bold status-val">{{ $t(statusConfig[item.statusCode]) }}</span>
          </div>
          <div class="card clearfix">
            <div class="card-info fl">
              <div class="default">{{ $t('account.card-info-fl') }}</div>
              <div class="bold cardl4">{{ unescapeDefaultName(item.defaultName) }}</div>
            </div>
            <div class="card-pic fr">
              <span>{{ item.last4 }}</span>
            </div>
          </div>
          <div class="dpid-wrapper">
            <div class="default dpip-title">{{ $t('account.dpip-title') }}</div>
            <div class="dpid bold">{{ item.dpidFormat }}</div>
            <div class="default refresh-date">{{ $t('account.refresh-date') }}</div>
            <div class="date bold">{{ item.expireDateFormat }}</div>
          </div>
          <div class="entitlement-wrapper" v-if="item.equity.type !== 6">
            <div v-if="item.equity.type === 1">
              <div class="entitlement-item">
                <img src="~img/icon-freetrip-2.svg" alt="" />
                <div class="entitlement-info">
                  <div class="entitlement-item-title bold">
                    {{ $t('account.unlimited') }}
                    &nbsp;
                    {{ $t('account.free-fast-track-passes') }}
                  </div>
                  <div class="default">
                    {{ $t('account.cardholder') }}
                    &nbsp;+&nbsp;
                    {{ $t('account.guest') }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.equity.type === 2">
              <div class="entitlement-item">
                <img src="~img/icon-freetrip-2.svg" alt="" />
                <div class="entitlement-info">
                  <div class="entitlement-item-title bold">
                    {{ $t('account.unlimited') }}
                    &nbsp;
                    {{ $t('account.free-fast-track-passes') }}
                  </div>
                  <div class="default">{{ $t('account.cardholder') }}</div>
                </div>
              </div>
              <div class="entitlement-item">
                <img src="~img/icon-freetrip-2.svg" alt="" />
                <div class="entitlement-info">
                  <div class="entitlement-item-title bold">
                    {{ item.equity.remainPoint }}/{{ item.equity.initPoint }}
                    {{ $t('account.free-fast-track-pass') }}
                  </div>
                  <div class="default">{{ $t('account.guest') }}</div>
                </div>
              </div>
            </div>

            <div v-if="item.equity.type === 3">
              <div class="entitlement-item">
                <img src="~img/icon-freetrip-2.svg" alt="" />
                <div class="entitlement-info">
                  <div class="entitlement-item-title bold">
                    {{ $t('account.unlimited') }}
                    &nbsp;
                    {{ $t('account.free-fast-track-passes') }}
                  </div>
                  <div class="default">{{ $t('account.cardholder-only') }}</div>
                </div>
              </div>
            </div>

            <div v-if="item.equity.type === 4">
              <div class="entitlement-item">
                <img src="~img/icon-freetrip-2.svg" alt="" />
                <div class="entitlement-info">
                  <div class="entitlement-item-title bold">
                    {{ item.equity.remainPoint }}/{{ item.equity.initPoint }}
                    {{ $t('account.free-fast-track-pass') }}
                  </div>
                  <div class="default">
                    {{ $t('account.cardholder') }}
                    &nbsp;+&nbsp;
                    {{ $t('account.guest') }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.equity.type === 5">
              <div class="entitlement-item">
                <img src="~img/icon-freetrip-2.svg" alt="" />
                <div class="entitlement-info">
                  <div class="entitlement-item-title bold">
                    {{ item.equity.remainPoint }}/{{ item.equity.initPoint }}
                    {{ $t('account.free-fast-track-pass') }}
                  </div>
                  <div class="default">{{ $t('account.cardholder-only') }}</div>
                </div>
              </div>
            </div>

            <div class="desc">{{ item.entitlements[0].airportUseNote }}</div>
          </div>
          <div class="no-entitlement" v-else>
            <img src="~img/icon-freetrip-2.svg" alt="" />
            <div class="entitlement-item-title bold">{{ $t('account.no-available') }}</div>
          </div>
        </div>

        <div class="btn-switch" :class="{ 'btn-switch-actived': switchBtnActived }">
          <div @click="switchCard">{{ $t('account.switch-card') }}</div>
        </div>
      </div>
      <van-popup v-model="showPopup" class="switching-popup" :close-on-click-overlay="false">
        <div class="switching-card-wrapper clearfix">
          <div class="card-item fl">
            <span>{{ last4 }}</span>
          </div>
          <img class="fl" src="~img/change-card-arrow.gif" alt="" />
          <div class="card-item fl">
            <span>{{ last4Actived }}</span>
          </div>
        </div>
        <div class="popup-title">{{ $t('account.switching-membership') }}</div>
      </van-popup>
    </div>
  </div>
</template>

<script>
  import { formatCardNo, formatDateEN } from '@/utils';
  import { cardStatusConfig as statusConfig } from '@/utils/config';
  import { mapState, mapMutations } from 'vuex';
  import { Popup } from 'vant';

  export default {
    data() {
      return {
        list: [],
        statusConfig,
        currentDpid: null,
        currentDpidStatus: null,
        showPopup: false,
        last4: null,
        last4Actived: null,
        loading: true,
      };
    },

    mounted() {
      this.localeInit && this.fetchList();
    },

    methods: {
      fetchList() {
        this.$http.account.membershipList().then(res => {
          this.loading = false;
          if (res.state === '11') {
            const list = res.data;
            list.forEach(item => {
              item.expireDateFormat = formatDateEN(new Date(item.expireDate.split('T')[0]));
              item.dpidFormat = formatCardNo(item.dpid);
              if (item.statusCode === 'inuse') {
                this.last4 = item.last4;
              }

              const equity = item.entitlements && item.entitlements[0];
              let type = 6;
              if (!equity) {
                type = 6;
              } else {
                if (equity.isUnlimited && equity.allowGuestUse && equity.guestIsUnlimited) {
                  // CH & Guest Unlmited
                  type = 1;
                } else if (equity.isUnlimited && equity.allowGuestUse && !equity.guestIsUnlimited) {
                  // CH: Unlimited ， Guest: * Visits
                  type = 2;
                } else if (equity.isUnlimited && !equity.allowGuestUse) {
                  // CH： Unlimited,  Guest: No entitlement
                  type = 3;
                } else if (
                  !equity.isUnlimited &&
                  equity.allowGuestUse &&
                  !equity.guestIsUnlimited
                ) {
                  // CH+ Guest : * visits
                  type = 4;
                } else if (!equity.isUnlimited && !equity.allowGuestUse) {
                  // CH： * visits,  Guest: No entitlement
                  type = 5;
                }
              }

              item.equity = {
                type,
                initPoint: equity && equity.initPoint,
                remainPoint: equity && equity.remainPoint,
              };
            });
            this.list = list;
          }
        });
      },

      selectItem(dpid, status, last4) {
        if (document.documentElement.clientWidth <= 1024) {
          return;
        }
        this.currentDpid = dpid;
        this.currentDpidStatus = status;
        this.last4Actived = last4;
      },

      switchCard() {
        if (!this.switchBtnActived) {
          return;
        }
        this.showPopup = true;
        this.$http.account
          .membershipSwitch({
            newDpid: this.currentDpid,
          })
          .then(res => {
            if (res.state === '11') {
              this.checkCardLevel();
              this.$router.push('/account/overview?showMsg=1');
              this.getLanguageOpts();
            }
          })
          .catch(() => {});
      },

      checkCardLevel() {
        this.$http.account.checkCardLevel().then(res => {
          if (res.state === '11') {
            const {
              data: { equityChangeType },
            } = res;
            if (equityChangeType !== 0) {
              this.setState({
                state: 'polanEquityChangeType',
                values: equityChangeType,
              });
              this.setState({
                state: 'showPolanEquityChangePopup',
                values: true,
              });
            }
          }
        });
      },

      getLanguageOpts() {
        this.$http.common.languageList().then(res => {
          if (res?.state === '11') {
            this.setState({
              state: 'languageOpts',
              values: res.data,
            });
          }
        });
      },

      unescapeDefaultName(str) {
        return unescape(str.replace(/\\u/g, '%u'));
      },

      ...mapMutations(['setState']),
    },

    computed: {
      switchBtnActived() {
        if (this.currentDpidStatus === 'not_inuse') {
          return true;
        }
        return false;
      },

      ...mapState(['localeInit']),
    },

    components: {
      [Popup.name]: Popup,
    },

    watch: {
      localeInit() {
        this.fetchList();
      },
    },
  };
</script>

<style lang="scss">
  @import './Index.scss';
</style>
