<template>
  <b-card no-body>
    <b-card-header>
      <!-- title and subtitle -->
      <div>
        <b-card-title class="mb-1">
          登入趨勢
        </b-card-title>
        <b-card-sub-title>每天的登入量統計</b-card-sub-title>
      </div>
      <!--/ title and subtitle -->

      <!-- datepicker -->
      <div class="d-flex align-items-center">
        <feather-icon
          icon="CalendarIcon"
          size="16"
        />
        <flat-pickr
          v-model="rangePicker"
          :config="{ mode: 'range'}"
          class="form-control flat-picker bg-transparent border-0 shadow-none"
          placeholder="YYYY/MM/DD"
          @input="onDateChange"
        />
      </div>
      <!-- datepicker -->
    </b-card-header>

    <b-card-body>
      <vue-apex-charts
        ref="realtimeChart"
        type="area"
        height="400"
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
import flatPickr from 'vue-flatpickr-component'
import apexChatData from './apexChartData'

export default {
  components: {
    BCard,
    VueApexCharts,
    BCardHeader,
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    flatPickr,
  },
  setup() {
    const data = JSON.parse(JSON.stringify(apexChatData.lineChartSimple))
    data.chartOptions.tooltip.custom = x => `${'<div class="px-1 py-50"><span>'}登入${
      x.series[x.seriesIndex][x.dataPointIndex]
    }次</span></div>`

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
      let start = this.rangePicker[0]
      let end = this.rangePicker[1]
      if (this.rangePicker.length !== 2) {
        [start, end] = this.rangePicker.split(' to ')
      }
      const dateIndex = this.getDateIndex(new Date(start), new Date(end))
      const dateArray = this.getDateArray(new Date(start), new Date(end))
      // this.$set(, 'categories', dateArray)
      await useJwt.axiosIns.post('http://127.0.0.1:8080/admin/getAnalysisRecord', querystring.stringify({
        key: 'LOGINTIMES',
        start,
        end,
      })).then(res => {
        const list = res.data.record
        const series = {}
        const seriesArr = []
        const keys = []
        list.forEach(data => {
          if (data.key === 'EARNINGS') {
            return
          }
          const dataDate = `${data.date.split('-')[1]}/${data.date.split('-')[2]}`
          if (!keys.includes(data.key)) {
            keys.push(data.key)
          }
          if (series[data.key] === undefined) {
            series[data.key] = []
          }
          series[data.key][dateIndex[dataDate]] = data.value
        })
        keys.forEach(key => {
          if (series[key] === undefined) {
            series[key] = []
          }
          for (let i = 0; i < dateArray.length; i += 1) {
            if (series[key][i] === undefined || series[key][i] === null) {
              series[key][i] = 0
            }
          }
          const cid = key.split('_')[1]
          seriesArr.push({
            name: this.getCategoryName(cid),
            data: series[key],
          })
        })
        this.data.chartOptions.xaxis.categories = dateArray
        this.data.series = seriesArr
        this.$refs.realtimeChart.updateSeries(seriesArr, false, true)
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
  },
}
</script>
