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
      <apex-bar-chart />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol, BLink } from 'bootstrap-vue'

import EarnTypeChart from './chart/EarnTypeChart.vue'
import SellTypeChart from './chart/SellTypeChart.vue'
import ApexBarChart from './chart/ApexBarChart.vue'

export default {
  components: {
    BRow,
    BCol,
    BLink,

    EarnTypeChart,
    SellTypeChart,
    ApexBarChart,
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
@import '@core/scss/vue/libs/chart-apex.scss';
</style>
