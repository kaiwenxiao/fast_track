<template>
  <div class="menu-content-wrapper">
    <img class="page-loading" src="~img/spin.gif" v-if="loading" />
    <div v-else>
      <div class="content-title">{{ $t('account.entitlement') }}</div>
      <div class="desc">{{ $t('account.entitlement-') }}</div>
      <div class="entitlement-wrapper" v-if="equityType !== 6">
        <div class="entitlement-detail clearfix" v-if="equityType === 1">
          <div class="entitlement-item fl clearfix">
            <div class="icon-wrapper clearfix">
              <img class="fl" src="~img/icon-mc-entitlement.svg" alt="" />
              <span class="note fr">{{ equity.airportUseNote }}</span>
            </div>
            <p class="fr">{{ $t('account.cardholder') }}&nbsp;+&nbsp;{{ $t('account.guest') }}</p>
            <div class="entitlement-title">
              {{ $t('account.unlimited') }}&nbsp;{{ $t('account.free-fast-track-passes') }}
            </div>
            <div class="refresh-date-title">{{ $t('account.refresh-date') }}</div>
            <div class="refresh-date">
              {{ equity.expireDateFormat }}
            </div>
          </div>
        </div>

        <div class="entitlement-detail clearfix" v-if="equityType === 2">
          <div class="entitlement-item fl clearfix">
            <div class="icon-wrapper clearfix">
              <img class="fl" src="~img/icon-mc-entitlement.svg" alt="" />
              <span class="note fr">{{ equity.airportUseNote }}</span>
            </div>
            <p class="fr">{{ $t('account.cardholder-only') }}</p>
            <div class="entitlement-title">
              {{ $t('account.unlimited') }}&nbsp;{{ $t('account.free-fast-track-passes') }}
            </div>
            <div class="refresh-date-title">{{ $t('account.refresh-date') }}</div>
            <div class="refresh-date">
              {{ equity.expireDateFormat }}
            </div>
          </div>
          <div class="entitlement-item fl clearfix">
            <div class="icon-wrapper clearfix">
              <img class="fl" src="~img/icon-mc-entitlement.svg" alt="" />
              <span class="note fr">{{ equity.airportUseNote }}</span>
            </div>
            <p class="fr">{{ $t('account.guest') }}</p>
            <div class="entitlement-title">
              {{ equity.remainPoint }}/{{ equity.initPoint }}
              {{ $t('account.free-fast-track-pass') }}
            </div>
            <div class="refresh-date-title">{{ $t('account.refresh-date') }}</div>
            <div class="refresh-date">
              {{ equity.expireDateFormat }}
            </div>
          </div>
        </div>

        <div class="entitlement-detail clearfix" v-if="equityType === 3">
          <div class="entitlement-item fl clearfix">
            <div class="icon-wrapper clearfix">
              <img class="fl" src="~img/icon-mc-entitlement.svg" alt="" />
              <span class="note fr">{{ equity.airportUseNote }}</span>
            </div>
            <p class="fr">{{ $t('account.cardholder-only') }}</p>
            <div class="entitlement-title">
              {{ $t('account.unlimited') }}&nbsp;{{ $t('account.free-fast-track-passes') }}
            </div>
            <div class="refresh-date-title">{{ $t('account.refresh-date') }}</div>
            <div class="refresh-date">
              {{ equity.expireDateFormat }}
            </div>
          </div>
        </div>

        <div class="entitlement-detail clearfix" v-if="equityType === 4">
          <div class="entitlement-item fl clearfix">
            <div class="icon-wrapper clearfix">
              <img class="fl" src="~img/icon-mc-entitlement.svg" alt="" />
              <span class="note fr">{{ equity.airportUseNote }}</span>
            </div>
            <p class="fr">{{ $t('account.cardholder') }}&nbsp;+&nbsp;{{ $t('account.guest') }}</p>
            <div class="entitlement-title">
              {{ equity.remainPoint }}/{{ equity.initPoint }}
              {{ $t('account.free-fast-track-pass') }}
            </div>
            <div class="refresh-date-title">
              {{ $t('account.refresh-date') }}
            </div>
            <div class="refresh-date">
              {{ equity.expireDateFormat }}
            </div>
          </div>
        </div>

        <div class="entitlement-detail clearfix" v-if="equityType === 5">
          <div class="entitlement-item fl clearfix">
            <div class="icon-wrapper clearfix">
              <img class="fl" src="~img/icon-mc-entitlement.svg" alt="" />
              <span class="note fr">{{ equity.airportUseNote }}</span>
            </div>
            <p class="fr">{{ $t('account.cardholder-only') }}</p>
            <div class="entitlement-title">
              {{ equity.remainPoint }}/{{ equity.initPoint }}
              {{ $t('account.free-fast-track-pass') }}
            </div>
            <div class="refresh-date-title">{{ $t('account.refresh-date') }}</div>
            <div class="refresh-date">
              {{ equity.expireDateFormat }}
            </div>
          </div>
        </div>

        <div class="desc">{{ $t('account.note') }}:&nbsp;{{ note }}</div>
      </div>
      <div class="no-entitlement" v-else>
        <img class="icon-no-entitlement" src="~img/icon-no-entitlement.svg" alt="" />
        <div class="no-entitlement-desc">{{ $t('account.no-free') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatDateEN } from '@/utils/index';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        equity: null,
        loading: true,
      };
    },

    mounted() {
      this.localeInit && this.getEquityUseInfo();
    },

    methods: {
      getEquityUseInfo() {
        this.$http.account.getAccountInfo().then(res => {
          this.loading = false;
          if (res.state === '11') {
            /* eslint-disable */
            const {
              data: {
                membership: { entitlements },
              },
            } = res;
            const equity = entitlements[0];
            equity.expireDateFormat = formatDateEN(new Date(equity.expiryDate.split('T')[0]));
            this.equity = equity;
            this.note = equity && equity.airportUseIconTip;
            /* eslint-disable */
          } else {
            res.note &&
              this.$toast({
                type: 'fail',
                message: res.note,
              });
          }
        });
      },
    },

    computed: {
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

      ...mapState(['localeInit']),
    },

    watch: {
      localeInit() {
        this.getEquityUseInfo();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>
