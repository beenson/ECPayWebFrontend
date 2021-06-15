<template>
  <b-row class="match-height">
    <b-col
      cols="12"
    >
      <!-- <p class="mb-2">
        <span>A Vue.js component for ApexCharts. Read full documnetation</span>
        <b-link
          target="_blank"
          href="https://apexcharts.com/docs/installation/"
        >
          here
        </b-link>
      </p> -->
    </b-col>
    <b-col cols="12">
      <earn-type-chart />
    </b-col>
    <b-col cols="12">
      <sell-type-chart />
    </b-col>
    <b-col md="12">
      <payment-chart />
    </b-col>
    <b-col md="12">
      <login-chart />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol, BLink } from 'bootstrap-vue'

import EarnTypeChart from './chart/EarnTypeChart.vue'
import SellTypeChart from './chart/SellTypeChart.vue'
import PaymentChart from './chart/PaymentChart.vue'
import LoginChart from './chart/LoginChart.vue'

export default {
  components: {
    BRow,
    BCol,
    BLink,

    EarnTypeChart,
    SellTypeChart,
    PaymentChart,
    LoginChart,
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
@import '@core/scss/vue/libs/chart-apex.scss';
</style>
