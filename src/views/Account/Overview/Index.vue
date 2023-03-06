<template>
  <div class="menu-content-wrapper">
    <img class="page-loading" src="~img/spin.gif" v-if="loading" />
    <div v-else>
      <transition name="expand-ani">
        <div class="switch-card-msg-popup" v-show="showMsg">
          <img src="~img/icon-update-successful.svg" alt="" />
          {{ $t('account.overview-switched-succ-desc', { last4: membership.last4 }) }}.
        </div>
      </transition>
      <div class="menu-content-wrapper-inner" v-if="userInfo && membership">
        <div class="content-title">{{ $t('account.account-overview') }}</div>
        <div class="profile-wrapper">
          <div class="title-default-style">{{ $t('account.profile') }}</div>
          <div class="profile-item clearfix">
            <div class="item-label fl">{{ $t('account.full-name') }}</div>
            <div class="item-value fl">{{ userInfo.firstName }} {{ userInfo.lastName }}</div>
          </div>
          <div class="profile-item clearfix">
            <div class="item-label fl">{{ $t('account.email-address') }}</div>
            <div class="item-value fl">{{ userInfo.email }}</div>
          </div>
        </div>
        <div class="entitlement-wrapper">
          <div class="title-default-style">{{ $t('account.entitlement') }}</div>
          <div class="entitlement-detail">
            <div class="entitlement clearfix">
              <div class="entitlement-flex" v-if="equityType === 1">
                <div class="entitlement-item fl">
                  <van-circle
                    class="fl"
                    v-model="currentRate"
                    rate="100"
                    size="105px"
                    stroke-width="60"
                    stroke-linecap="butt"
                    layer-color="#726D6D"
                    color="#8DB92E"
                  >
                    <div class="green">{{ $t('account.unlimited') }}</div>
                  </van-circle>
                  <div class="entitlement-item-desc fl">
                    {{ $t('account.cardholder') }}&nbsp;+&nbsp;{{ $t('account.guest') }}&nbsp;{{
                      $t('account.free-fast-track-pass')
                    }}
                  </div>
                </div>
              </div>

              <div class="entitlement-flex" v-if="equityType === 2">
                <div class="entitlement-item entitlement-item-ch fl">
                  <van-circle
                    class="fl"
                    v-model="currentRate"
                    rate="100"
                    size="105px"
                    stroke-width="60"
                    stroke-linecap="butt"
                    layer-color="#726D6D"
                    color="#8DB92E"
                  >
                    <div class="green">{{ $t('account.unlimited') }}</div>
                  </van-circle>
                  <div class="entitlement-item-desc fl">
                    {{ $t('account.cardholder') }}
                    <br />
                    {{ $t('account.free-fast-track-pass') }}
                  </div>
                </div>
                <div class="entitlement-item fl">
                  <van-circle
                    class="fl van-circle"
                    v-model="currentRate2"
                    :rate="equityRate"
                    size="105px"
                    stroke-width="60"
                    stroke-linecap="butt"
                    layer-color="#726D6D"
                    color="#8DB92E"
                  >
                    <div class="gray fs20">
                      <span class="green" :class="{ gray: equity.remainPoint === 0 }">{{
                        equity.remainPoint
                      }}</span>
                      / {{ equity.initPoint }}
                    </div>
                    <div class="green fs12" :class="{ gray: equity.remainPoint === 0 }">
                      {{ $t('account.remaining') }}
                    </div>
                  </van-circle>
                  <div class="entitlement-item-desc fl">
                    {{ $t('account.guest') }} <br />
                    {{ $t('account.free-fast-track-pass') }}
                  </div>
                </div>
              </div>

              <div class="entitlement-flex" v-if="equityType === 3">
                <div class="entitlement-item fl">
                  <van-circle
                    class="fl"
                    v-model="currentRate"
                    rate="100"
                    size="105px"
                    stroke-width="60"
                    stroke-linecap="butt"
                    layer-color="#726D6D"
                    color="#8DB92E"
                  >
                    <div class="green">{{ $t('account.unlimited') }}</div>
                  </van-circle>
                  <div class="entitlement-item-desc fl">
                    {{ $t('account.cardholder-only') }}&nbsp;-&nbsp;{{
                      $t('account.free-fast-track-pass')
                    }}
                  </div>
                </div>
              </div>

              <div class="entitlement-flex" v-if="equityType === 4">
                <div class="entitlement-item fl">
                  <van-circle
                    class="fl van-circle"
                    v-model="currentRate2"
                    :rate="equityRate"
                    size="105px"
                    stroke-width="60"
                    stroke-linecap="butt"
                    layer-color="#726D6D"
                    color="#8DB92E"
                  >
                    <div class="gray fs20">
                      <span class="green" :class="{ gray: equity.remainPoint === 0 }">{{
                        equity.remainPoint
                      }}</span>
                      / {{ equity.initPoint }}
                    </div>
                    <div class="green fs12" :class="{ gray: equity.remainPoint === 0 }">
                      {{ $t('account.remaining') }}
                    </div>
                  </van-circle>
                  <div class="entitlement-item-desc fl">
                    {{ $t('account.cardholder') }}&nbsp;+&nbsp;{{
                      $t('account.free-fast-track-pass')
                    }}
                  </div>
                </div>
              </div>

              <div class="entitlement-flex" v-if="equityType === 5">
                <div class="entitlement-item fl">
                  <van-circle
                    class="fl van-circle"
                    v-model="currentRate2"
                    :rate="equityRate"
                    size="105px"
                    stroke-width="60"
                    stroke-linecap="butt"
                    layer-color="#726D6D"
                    color="#8DB92E"
                  >
                    <div class="gray fs20">
                      <span class="green" :class="{ gray: equity.remainPoint === 0 }">{{
                        equity.remainPoint
                      }}</span>
                      / {{ equity.initPoint }}
                    </div>
                    <div class="green fs12" :class="{ gray: equity.remainPoint === 0 }">
                      {{ $t('account.remaining') }}
                    </div>
                  </van-circle>
                  <div class="entitlement-item-desc fl">
                    {{ $t('account.cardholder-only') }}&nbsp;-&nbsp;{{
                      $t('account.free-fast-track-pass')
                    }}
                  </div>
                </div>
              </div>

              <div class="entitlement-flex" v-if="equityType === 6">
                <div class="entitlement-item fl">
                  <van-circle
                    class="fl"
                    v-model="currentRate"
                    rate="0"
                    size="105px"
                    stroke-width="60"
                    stroke-linecap="butt"
                    layer-color="#726D6D"
                    color="#8DB92E"
                  >
                    <div style="color: #726d6d">{{ $t('account.none') }}</div>
                  </van-circle>
                  <div class="entitlement-item-desc fl">{{ $t('account.no-free-pass') }}</div>
                </div>
              </div>
            </div>
            <div class="entitlement-desc" v-if="equityType === 6">
              {{ $t('account.fast-track-buy') }}
            </div>
            <div v-else>
              <div class="entitlement-desc">
                • {{ equity.airportUseNote }}

                <van-popover v-model="showPopover">
                  <div class="question-icon-content">
                    {{ equity.airportUseIconTip }}
                  </div>
                  <template #reference>
                    <img
                      src="~img/icon-info.svg"
                      alt=""
                      @mousemove="questionIconHover"
                      @mouseout="questionIconLeave"
                    />
                  </template>
                </van-popover>
              </div>
              <div class="entitlement-desc">
                {{ $t('account.fast-track-date') }}
                {{ formatExpiryDate }}
              </div>
            </div>
          </div>
        </div>
        <div class="card-in-use-wrapper">
          <div class="title-default-style">{{ $t('account.card-in-use') }}</div>
          <div class="card-in-use-box">
            <div class="default">{{ $t('account.card-info-fl') }}</div>
            <div class="card-name-wrapper clearfix" v-show="!showEditCardName">
              <div class="card-name fl">{{ unescapeDefaultName }}</div>
              <div class="btn-edit fl" @click="editBtnClick">{{ $t('account.edit') }}</div>
            </div>
            <div class="card-name-edit" v-show="showEditCardName">
              <input type="text" v-model="cardName" maxlength="15" autocomplete="off" />
              <span class="btn-save" @click="saveEditCardName">{{ $t('account.save') }}</span>
            </div>
            <div class="card-details clearfix">
              <div class="card-pic-wrapper fl">
                <div class="card-pic">
                  <span class="last4">{{ membership.last4 }}</span>
                </div>
                <router-link
                  :to="`/account/update-card?first6=${membership.first6}`"
                  tag="div"
                  class="update-card"
                  >{{ $t('account.update-card') }}</router-link
                >
              </div>
              <div class="card-info fr clearfix">
                <div class="card-info-col card-info-w205 fl">
                  <div class="card-info-item">
                    <div class="card-info-item-label default">{{ $t('account.cardholder') }}</div>
                    <div class="card-info-item-val">{{ membership.cardholder }}</div>
                  </div>
                  <div class="card-info-item">
                    <div class="card-info-item-label default">
                      {{ $t('account.refresh-date') }}
                    </div>
                    <div class="card-info-item-val">{{ formatMembershipExpiryDate }}</div>
                  </div>
                </div>
                <div class="card-info-col card-info-w215 fr">
                  <div class="card-info-item">
                    <div class="card-info-item-label default">{{ $t('account.issuer') }}</div>
                    <div class="card-info-item-val">{{ membership.issuer }}</div>
                  </div>
                  <div class="card-info-item">
                    <div class="card-info-item-label default">{{ $t('account.dpip-title') }}</div>
                    <div class="card-info-item-val">
                      {{ dpid }}
                    </div>
                  </div>
                </div>
                <div class="desc">
                  {{ $t('account.only-applicable-for-fast') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-wrapper clearfix">
          <router-link to="/account/all-card" tag="div" class="btn btn-view fl"
            >{{ $t('account.view-all-menbership') }} <span>{{ memberShipCount }}</span></router-link
          >
          <router-link to="/account/add-card" tag="div" class="btn btn-add fl"
            >{{ $t('account.tab-add-card') }} <span class="icon-add"></span
          ></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Circle, Popover } from 'vant';
  import { mapState, mapMutations } from 'vuex';
  import { formatCardNo, formatDateEN } from '@/utils/index';
  import { getQueryString, encodeUnicode } from '@/utils';

  export default {
    data() {
      return {
        currentRate: 0,
        currentRate2: 0,
        membership: null,
        showEditCardName: false,
        cardName: '',
        saveEditCardNameState: false,
        showPopover: false,
        equity: null,
        memberShipCount: 0,
        showMsg: false,
        loading: true,
      };
    },

    mounted() {
      this.localeInit && this.getUserBasicInfo();
      if (getQueryString('showMsg')) {
        this.showMsg = true;
        setTimeout(() => {
          this.showMsg = false;
        }, 5000);
      }
    },

    methods: {
      editBtnClick() {
        this.cardName = '';
        this.showEditCardName = true;
      },

      questionIconHover() {
        this.showPopover = true;
      },

      questionIconLeave() {
        this.showPopover = false;
      },

      getContainer() {
        return document.querySelector('.menu-content-wrapper');
      },

      saveEditCardName() {
        if (!this.cardName.trim()) {
          this.showEditCardName = false;
          return;
        }

        if (this.saveEditCardNameState) {
          return;
        }

        this.saveEditCardNameState = true;
        this.$http.account
          .updateCardName({
            dpid: this.membership.dpid,
            defaultName: encodeUnicode(this.cardName),
          })
          .then(res => {
            this.saveEditCardNameState = false;
            if (res.state === '11') {
              this.showEditCardName = false;
              this.getUserBasicInfo();
            } else {
            }
          })
          .catch(() => {
            this.saveEditCardNameState = false;
          });
      },

      getUserBasicInfo() {
        this.$http.account
          .getAccountInfo({
            needMemberShipCount: 1,
          })
          .then(res => {
            this.loading = false;
            if (res.state === '11') {
              const {
                data: { membership, memberShipCount },
              } = res;
              this.membership = membership;
              this.memberShipCount = memberShipCount;
              /* eslint-disable */
              this.equity = this.membership.entitlements[0];
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
      dpid() {
        return this.membership.dpid && formatCardNo(this.membership.dpid);
      },

      unescapeDefaultName() {
        return unescape(this.membership.defaultName.replace(/\\u/g, '%u'));
      },

      formatExpiryDate() {
        /* eslint-disable */
        const expiryDate = this.equity && this.equity.expiryDate.split('T')[0];
        return formatDateEN(new Date(expiryDate));
        /* eslint-disable */
      },

      formatMembershipExpiryDate() {
        /* eslint-disable */
        const expiryDate = this.membership && this.membership.expireDate.split('T')[0];
        return formatDateEN(new Date(expiryDate));
        /* eslint-disable */
      },

      equityRate() {
        if (this.equityType === 2 || this.equityType === 4 || this.equityType === 5) {
          const rate = this.equity.remainPoint / this.equity.initPoint;
          return rate * 100;
        }
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

      locale() {
        return this.$i18n.locale;
      },

      ...mapState(['userInfo', 'localeInit']),
    },

    components: {
      [Circle.name]: Circle,
      [Popover.name]: Popover,
    },

    watch: {
      localeInit() {
        this.getUserBasicInfo();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>
