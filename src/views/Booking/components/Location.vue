<template>
  <div class="secondBox">
    <div class="content">
      <div class="title">{{ $t('product.location-details') }}</div>
      <div class="part-box">
        <div class="part1">
          <div class="item" v-if="Number(freeEntry) > 0">
            <div class="box-row">
              <img class="infantIcon" src="@/assets/images/icon-children@2x.png" />
              <div
                class="item-title"
                v-html="$t('product.box-row-title', { age: freeEntry })"
              ></div>
            </div>
          </div>
          <div class="item" v-if="refundable < 0">
            <div class="box-row">
              <img src="@/assets/images/icn-cancel@2x.png" />
              <div class="item-title">{{ $t('home.non-refundable') }}</div>
            </div>
            <div class="item-desc">
              {{ $t('product.box-row-desc1') }}
            </div>
          </div>
          <div class="item" v-if="refundable >= 0">
            <div class="box-row">
              <img src="@/assets/images/icon-refund-permitted@2x.png" />
              <div class="item-title">{{ $t('home.refunds-permitted') }}</div>
            </div>
            <div
              class="item-desc"
              v-html="$t('product.box-row-desc2', { target: linkTarget })"
            ></div>
          </div>
          <div class="item" v-if="advancePurchase">
            <div class="box-row">
              <img src="@/assets/images/icn-advance booking@2x.png" />
              <div class="item-title">{{ $t('home.advance-bookings-only') }}</div>
            </div>
            <div class="item-desc">
              {{
                $t('product.pre-book-hrs', {
                  preBookHr,
                  hrs: this.preBookHr > 1 ? $t('product.hour', 2) : $t('product.hour', 1),
                })
              }}
            </div>
          </div>

          <div class="item" v-if="!advancePurchase">
            <div class="box-row">
              <img src="@/assets/images/icon-Book-instant@2x.png" />
              <div class="item-title">{{ $t('home.same-day-bookings-available') }}</div>
            </div>
            <div class="item-desc">{{ $t('product.no-notice-require') }}</div>
          </div>
        </div>
        <div class="part2">
          <div class="item">
            <div class="box-row">
              <img src="@/assets/images/icon-clock@2x.png" />
              <div class="item-title">{{ $t('product.operating-hours') }}</div>
            </div>
            <div class="item-desc">{{ businessHour }}</div>
          </div>

          <div class="item" v-if="location">
            <div class="box-row">
              <img src="@/assets/images/icon-location@2x.png" />
              <div class="item-title">{{ $t('account.location') }}</div>
            </div>
            <div class="item-desc">
              {{ location }}
            </div>
          </div>

          <div class="item item-passenger">
            <div class="box-row">
              <img src="~img/icn-passengers@2x.png" alt="" />
              <div class="passenger-item">
                <div class="passenger-item-title">{{ $t('product.passengers') }}</div>
                <div class="passenger-item-desc">
                  {{
                    Number(freeEntry) > 0
                      ? $t('product.age-and-above', { age: freeEntry })
                      : $t('product.all-passengers')
                  }}
                </div>
              </div>
              <div class="passenger-item">
                <div class="passenger-item-title">{{ currency }} {{ price.toFixed(2) }}</div>
                <div class="passenger-item-desc">{{ $t('product.person') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      refundable: Number,
      freeEntry: String,
      advancePurchase: Number,
      preBookHr: Number,
      price: {
        type: Number,
        default: 0,
      },
      count: Number,
      businessHour: String,
      currency: String,
      location: String,
    },

    computed: {
      linkTarget() {
        return sessionStorage.getItem('appType') === 'app' ? '_self' : '_blank';
      },
    },
  };
</script>
<style lang="scss" scoped>
  .secondBox {
    width: 100%;
    margin: 32px 0;
    color: #2d354c;
    border-radius: 8px;
    border: 3px solid #f79f1a;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    .content {
      padding: 32px 50px 0;
      .title {
        line-height: 20px;
        font-size: 16px;
        @extend .ff-bold;
        padding-bottom: 24px;
      }
      .part-box {
        display: flex;
        flex-direction: row;
        .item {
          padding-bottom: 28px;
          .box-row {
            display: flex;
            align-items: center;
            padding-bottom: 8px;
            img {
              width: 31px;
              height: 31px;
              margin-right: 20px;
            }
            .item-title {
              line-height: 20px;
              font-size: 16px;
              @extend .ff-bold;
              span {
                font-size: 14px;
                @extend .ff-reg;
                color: #6e6e6e;
              }
            }
          }
          .item-desc {
            line-height: 18px;
            font-size: 14px;
            padding-left: 51px;
            color: #6e6e6e;
            a {
              @extend .ff-bold;
              text-decoration: underline;
              color: #f79f1a;
              cursor: pointer;
            }
          }
          &.item-passenger {
            line-height: 18px;
            font-size: 14px;
            .box-row {
              align-items: flex-start;
              .passenger-item {
                .passenger-item-title {
                  @extend .ff-bold;
                  padding-bottom: 8px;
                }
                .passenger-item-desc {
                  color: #6e6e6e;
                }
                &:last-of-type {
                  margin-left: 70px;
                }
              }
            }
          }
        }
      }
      .part1 {
        width: 45%;
        padding-right: 10%;
      }
      .part2 {
        width: 40%;
        padding-left: 5%;
      }
    }

    @media screen and (max-width: 1024px) {
      .content {
        padding: 16px 16px 0 !important;
        .part-box {
          display: unset;
          .item {
            .box-row {
              img {
                width: 25px;
                height: 25px;
                margin-right: 13px;
              }
            }
            .item-desc {
              padding-left: 38px;
            }
            &.item-passenger {
              .box-row {
                .passenger-item {
                  &:last-of-type {
                    margin-left: 10%;
                  }
                }
              }
            }
          }
          .part1 {
            width: 100%;
            padding: unset;
          }
          .part2 {
            width: 100%;
            padding: unset;
          }
        }
      }
    }
  }
</style>
