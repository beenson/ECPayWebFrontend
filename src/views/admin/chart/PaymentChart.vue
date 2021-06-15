<template>
  <b-card no-body>
    <b-card-header>
      <!-- title and subtitle -->
      <div>
        <b-card-title class="mb-1">
          支付方式統計
        </b-card-title>
        <b-card-sub-title>統計各支付方式使用到的次數</b-card-sub-title>
      </div>
      <!--/ title and subtitle -->

      <!-- datepicker -->
    </b-card-header>

    <b-card-body>
      <vue-apex-charts
        ref="realtimeChart"
        type="bar"
        height="350"
        :options="data.chartOptions"
        :series="data.series"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BCardTitle, BCardSubTitle,
} from 'bootstrap-vue'
import querystring from 'querystring'
import useJwt from '@/auth/jwt/useJwt'
import VueApexCharts from 'vue-apexcharts'
import apexChatData from './apexChartData'

export default {
  components: {
    BCard,
    VueApexCharts,
    BCardHeader,
    BCardBody,
    BCardTitle,
    BCardSubTitle,
  },
  setup() {
    const data = JSON.parse(JSON.stringify(apexChatData.barChart))
    /* data.chartOptions.tooltip.custom = x => `${'<div class="px-1 py-50"><span>'}$${
      x.series[x.seriesIndex][x.dataPointIndex]
    }</span></div>` */

    return {
      rangePicker: ['2021/06/09', '2021/06/13'],
      rangePickerOri: ['2021/06/09', '2021/06/13'],
      data,
    }
  },
  data() {
    return {
      apexChatData,
      categories: [],
    }
  },
  created() {
    this.loadCategories().then(() => {
      this.loadRecord()
    })
  },
  methods: {
    async onDateChange() {
      if (this.rangePicker.includes(' to ')) {
        this.rangePicker = this.rangePicker.replaceAll('-', '/')
        if (this.rangePickerOri === this.rangePicker) {
          return
        }
        this.rangePickerOri = this.rangePicker
        await this.loadRecord()
        this.$forceUpdate()
      }
    },
    async loadCategories() {
      await useJwt.axiosIns.post('http://127.0.0.1:8080/category/categorys').then(res => {
        const list = res.data
        this.categories = []
        list.sort((a, b) => b.priority - a.priority) // 排序 => priority越大越前面
        list.forEach(category => {
          this.categories.push({
            id: category.id,
            title: category.name,
          })
        })
      })
    },
    async loadRecord() {
      // this.$set(, 'categories', dateArray)
      await useJwt.axiosIns.post('http://127.0.0.1:8080/admin/getDefaultDayAnalysisRecord', querystring.stringify({
        key: 'PAYMENT_',
      })).then(res => {
        const list = res.data.record
        const names = []
        const values = []
        list.forEach(data => {
          if (data.key === 'EARNINGS') {
            return
          }
          let name = ''
          if (data.key.includes('ATM')) {
            name = `${this.getATMName(data.key.split('_')[2])}ATM`
          } else {
            name = '超商繳費'
          }
          names.push(name)
          values.push(data.value)
        })
        this.data.chartOptions.xaxis.categories = names
        this.data.series[0].data = values
        this.$refs.realtimeChart.updateSeries(this.data.series, false, true)
        this.$refs.realtimeChart.updateOptions(this.data.chartOptions, false, true)
      })
    },
    getDateIndex(start, to) {
      let i = 0
      const data = {}
      for (;;) {
        if (start.getTime() < to.getTime() + 1) {
          let mon = start.getMonth() + 1
          let date = start.getDate()
          if (mon < 10) {
            mon = `0${mon}`
          }
          if (date < 10) {
            date = `0${date}`
          }
          data[`${mon}/${date}`] = i
          start.setDate(start.getDate() + 1)
          i += 1
        } else {
          return data
        }
      }
    },
    getDateArray(start, to) {
      const data = []
      for (;;) {
        if (start.getTime() < to.getTime() + 1) {
          let mon = start.getMonth() + 1
          let date = start.getDate()
          if (mon < 10) {
            mon = `0${mon}`
          }
          if (date < 10) {
            date = `0${date}`
          }
          data.push(`${mon}/${date}`)
          start.setDate(start.getDate() + 1)
        } else {
          return data
        }
      }
    },
    getCategoryName(id) {
      let c = 'unknown'
      this.categories.forEach(category => {
        if (category.id === parseInt(id, 10)) {
          c = category.title
        }
      })
      return c
    },
    getATMName(code) {
      switch (parseInt(code, 10)) {
        case 812:
          return '台新'
        case 4:
          return '台銀'
        case 822:
          return '中信'
        case 7:
          return '第一'
        case 5:
          return '土地'
        case 814:
          return '大眾'
        default:
          return '未知'
      }
    },
  },
}
</script>
