<template>
  <div class="menu-content-wrapper bookings-wrapper">
    <img class="page-loading" src="~img/spin.gif" v-if="loading" />
    <div v-else>
      <div class="content-title">{{ $t('account.tab-bookings') }}</div>
      <div class="tab-wrapper">
        <div class="tab clearfix">
          <div
            class="tab-item"
            :class="{ 'tab-item-actived': activedTab === item.value }"
            v-for="item in tab"
            :key="item.value"
            @click="handleTabClick(item.value)"
          >
            {{ $t(item.key) }}
            <span class="active-line" v-show="activedTab === item.value"></span>
          </div>
        </div>
        <div class="tab-content">
          <div
            class="history-item clearfix"
            v-for="item in this[`${activedTab}Trips`]"
            :key="item.orderNo"
          >
            <img class="history-item-pic" :src="item.airportCover" alt="" />
            <div class="history-item-r">
              <div class="item-title">{{ $t('account.fast-track') }}</div>
              <div class="item-detail clearfix">
                <div class="item-detail-airport fl">
                  <div class="item-nowrap">{{ item.airportName }}</div>
                  <div>{{ item.terminal }}</div>
                </div>
                <div class="item-detail-date fl clearfix">
                  <div>{{ item.serviceTime.split(',')[0] }}</div>
                  <div>{{ item.serviceTime.split(',')[1] }}</div>
                </div>
                <div class="item-view fr" @click="viewDetails(item.orderNo)">
                  {{ $t('account.view-details') }} >
                  <span class="icon-arrow-right-org"></span>
                </div>
              </div>
            </div>
          </div>
          <!-- Bookings-upcoming trips-empty -->
          <div
            class="upcoming-trips-empty"
            v-if="activedTab === 'upcoming' && upcomingTrips.length === 0"
          >
            <img src="~img/icon-no-upcomingTrip.svg" alt="" />
            <div class="desc">{{ $t('account.upcoming-trips-desc') }}</div>
            <router-link to="/airport" tag="div" class="btn-book">{{
              $t('account.book-fast')
            }}</router-link>
          </div>

          <!-- 20210615反馈新增 -->
          <div class="upcoming-trips-empty" v-if="activedTab === 'past' && pastTrips.length === 0">
            <img src="~img/icon-no-upcomingTrip.svg" alt="" />
            <div class="desc">{{ $t('account.past-trips-desc') }}</div>
            <router-link to="/airport" tag="div" class="btn-book">{{
              $t('account.book-fast')
            }}</router-link>
          </div>

          <div
            class="upcoming-trips-empty"
            v-if="activedTab === 'cancelled' && cancelledTrips.length === 0"
          >
            <img src="~img/icon-no-upcomingTrip.svg" alt="" />
            <div class="desc">{{ $t('account.cancel-trips-desc') }}</div>
            <router-link to="/airport" tag="div" class="btn-book">{{
              $t('account.book-fast')
            }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { bookingsTab as tab } from '@/utils/config';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        tab,
        activedTab: 'upcoming',
        pastTrips: [],
        upcomingTrips: [],
        cancelledTrips: [],
        loading: true,
      };
    },

    mounted() {
      this.localeInit && this.fetchOrderHistory();
    },

    methods: {
      handleTabClick(tab) {
        this.activedTab = tab;
      },

      fetchOrderHistory() {
        this.$http.account.bookingOrderHistory().then(res => {
          this.loading = false;
          if (res.state === '11') {
            const {
              data: { pastTrips, upcomingTrips, cancelledTrips },
            } = res;
            this.pastTrips = pastTrips;
            this.upcomingTrips = upcomingTrips;
            this.cancelledTrips = cancelledTrips;
          }
        });
      },

      viewDetails(orderNo) {
        this.$router.push(`/account/bookingDetails?orderNo=${orderNo}`);
      },
    },

    computed: {
      ...mapState(['localeInit']),
    },

    watch: {
      localeInit() {
        this.fetchOrderHistory();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>
