<!--
 * @Author: 黄荣基
 * @Date: 2021-01-08 16:17:30
 * @LastEditors: 黄荣基
 * @LastEditTime: 2021-01-20 18:12:20
-->
<template>
  <van-calendar
    :poppable="false"
    :show-confirm="false"
    :style="{ height: '560px' }"
    show-subtitle
    safe-area-inset-bottom
    :min-date="minDate"
    :max-date="maxDate"
    :default-date="minDate"
    color="#F79F1A"
    ref="vantCalendar"
  >
    <div slot="footer" class="passengerBtn flexRight" @click="confirm">
      <div class="btn flexCenter">{{ $t('account.done') }}</div>
    </div>
  </van-calendar>
</template>
<script>
  import { formatDateEN, jsDateFormatter } from '@/utils/index';
  import { Calendar } from 'vant';

  export default {
    props: {
      minDate: Date,
      maxDate: Date,
    },

    methods: {
      confirm() {
        // eslint-disable-next-line no-underscore-dangle
        const visitDate = this.$refs.vantCalendar._data.currentDate,
          // 对日期按需求进行格式化成  => 25 July 2020
          visitDateEN = formatDateEN(visitDate),
          visitDateData = jsDateFormatter(visitDate);
        this.$emit('confirm', visitDateEN, visitDateData);
      },
    },

    components: {
      [Calendar.name]: Calendar,
    },
  };
</script>
<style lang="scss" scoped>
  .passengerBtn {
    width: 30%;
    padding: 20px 0 20px 10%;
    .btn {
      height: 50px;
      width: 90px;
      background-color: #f38b00;
      border-radius: 4px;
      font-size: 16px;
      @extend .ff-bold;
      color: #ffffff;
    }
  }
</style>
