<template>
  <div v-if="equity">
    <div class="entitlementBox" v-if="equity.allowAirportUseEquity && equity.hasCipEquity">
      <div class="entitlementContent">
        <div class="boxLeft">
          <!-- <img class="icon" src="@/assets/images/icon-free trips@2x.png" /> -->
          <div class="leftText">{{ $t('product.free-fast-track-pass') }}</div>
        </div>
        <div class="boxRight">
          <div
            class="rightText"
            v-if="equity.isCardHolderUnlimited && equity.allowGuestUse && equity.isGuestUnlimited"
          >
            <p>
              {{ $t('product.cardholder-guest') }}&nbsp;:&nbsp;<strong>{{
                $t('product.unlimited')
              }}</strong>
            </p>
          </div>

          <div
            class="rightText"
            v-if="equity.isCardHolderUnlimited && equity.allowGuestUse && !equity.isGuestUnlimited"
          >
            <p>
              {{ $t('product.cardholder') }}&nbsp;:&nbsp;<strong>{{
                $t('product.unlimited')
              }}</strong>
            </p>
            <p>
              {{ $t('account.guest') }}:
              <strong>{{ equity.remainPoint }}/{{ equity.initPoint }}</strong>
            </p>
          </div>

          <div class="rightText" v-if="equity.isCardHolderUnlimited && !equity.allowGuestUse">
            <p>
              {{ $t('product.cardholder-only') }}&nbsp;:&nbsp;<strong>{{
                $t('product.unlimited')
              }}</strong>
            </p>
          </div>

          <div
            class="rightText"
            v-if="!equity.isCardHolderUnlimited && equity.allowGuestUse && !equity.isGuestUnlimited"
          >
            <p>
              {{ $t('product.cardholder-guest') }}&nbsp;:&nbsp;
              <strong>{{ equity.remainPoint }}/{{ equity.initPoint }}</strong>
            </p>
          </div>

          <div class="rightText" v-if="!equity.isCardHolderUnlimited && !equity.allowGuestUse">
            <p>
              {{ $t('product.cardholder-only') }}&nbsp;:&nbsp;
              <strong>{{ equity.remainPoint }}/{{ equity.initPoint }}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="no-remain-entitlement" v-if="!equity.allowAirportUseEquity">
      <div class="desc">{{ $t('product.no-remain-entitlement-desc1') }}</div>
    </div>

    <div class="no-remain-entitlement" v-if="equity.allowAirportUseEquity && !equity.hasCipEquity">
      <div class="desc">{{ $t('product.no-remain-entitlement-desc2') }}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      equity: Object,
    },
  };
</script>
<style lang="scss" scoped>
  .entitlementBox {
    padding: 5px;
    margin-top: 16px;
    align-items: center;
    border-radius: 8px;
    color: #2d354c;
    background-color: #fbddb3;
    .entitlementContent {
      display: flex;
      border-radius: 8px;
      border: 1px dashed #2d354c;
      .boxLeft {
        width: 38%;
        display: flex;
        align-items: center;
        padding: 16px 8px 16px 68px;
        border-right: 1px dashed #2d354c;
        box-sizing: border-box;
        .icon {
          height: 33px;
          width: 52px;
          margin: 0 15px;
        }
        .leftText {
          font-size: 20px;
          @extend .ff-bold;
          line-height: 1.5;
        }
      }
      @media screen and (max-width: 1024px) {
        .boxLeft {
          padding-left: 15px !important;
          width: 45%;
          .icon {
            height: 15px;
            width: 35px;
          }
          .leftText {
            font-size: 12px;
          }
        }
      }
      .boxRight {
        display: flex;
        align-items: center;
        width: 90%;
        background: url('~img/happy-group@2x.png') no-repeat;
        background-size: contain;
        background-position: bottom;
        .rightText {
          padding: 0 8px;
          font-size: 16px;
          color: #2d354c;
          line-height: 1.5;
          padding-left: 20px;
        }
        p {
          strong {
            @extend .ff-bold;
          }
        }
      }
      @media screen and (max-width: 1024px) {
        .boxRight {
          width: unset;
          background: unset;
          .rightText {
            font-size: 12px;
            padding: 0 8px;
          }
        }
      }
    }
  }
  .no-remain-entitlement {
    padding: 5px;
    margin-top: 24px;
    border-radius: 8px;
    background-color: #fbddb3;
    text-align: center;
    .desc {
      display: flex;
      align-items: center;
      height: 90px;
      padding-left: 100px;
      line-height: 18px;
      font-size: 20px;
      @extend .ff-bold;
      border-radius: 8px;
      border: 1px dashed #2d354c;
      background: url('~img/sad-group@2x.png') no-repeat;
      background-size: contain;
    }
  }
  @media screen and (max-width: 1024px) {
    .no-remain-entitlement {
      .desc {
        padding: 0 10px;
        background: unset;
        font-size: 12px;
        height: 60px;
      }
    }
  }
</style>
