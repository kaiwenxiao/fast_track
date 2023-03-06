<template>
  <div class="page-wrapper">
    <Header :showBack="false" />
    <div class="mainContent">
      <div class="bg">
        <img class="icon-failed" src="@/assets/images/spin.gif" alt="" />
        <div>
          <div class="title">{{ $t('product.booking-process') }}</div>
          <div class="desc">
            <div>{{ $t('product.booking-process-desc') }}</div>
            <div>{{ $t('product.thank') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue';
  export default {
    components: {
      Header,
    },
    methods: {
      payConfirm(data) {
        this.$http.booking.payConfirm(data).then(res => {
          if (res.state === '11') {
            sessionStorage.removeItem('orderNo');
            this.$router.push('/bookingsuccess');
          } else if (res.state === '00' && res.errorCode === 'err_pay_card_3d_check') {
            // 需要stripe 3d校验 后台不会返回这个errorCode了
            alert('stripe error');
          } else if (res.state === '00' && res.errorCode === 'err_pay') {
            // 支付问题（stripe问题）
            this.$router.push('/payFailed?failType=payment');
          } else {
            // 下单失败（非stripe原因）
            this.$router.push('/payFailed?failType=booking');
          }
        });
      },
    },
    mounted() {
      const data = this.$route.params;
      this.payConfirm(data);
    },
  };
</script>
<style lang="scss" scoped>
  @import './index.scss';
  .page-wrapper {
    min-height: 100vh;
    padding-bottom: 20px;
    box-sizing: border-box;
    background-color: #fff;
    .mainContent {
      padding: 124px 20px 0;
      .bg {
        text-align: center !important;
        background-color: #fff !important;
        margin: 0 280px;
        padding: 100px 0;
        border-radius: 20px;
        .icon-failed {
          width: 53px;
        }
        .title {
          font-size: 28px;
          @extend .ff-bold;
          padding: 20px 0;
          color: #5f5e5e;
        }
        .desc {
          line-height: 18px;
          font-size: 14px;
          padding-bottom: 30px;
          color: #060605;
          div {
            &:nth-child(2) {
              padding-top: 8px;
            }
          }
        }
      }

      @media screen and (max-width: 1024px) {
        .bg {
          margin: 0 !important;
          padding: 0 !important;
          border-radius: unset;
          box-shadow: unset;
        }
      }
    }
  }
</style>
