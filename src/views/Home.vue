<template>
  <b-row>
    <b-col
      cols="12"
    >
      <b-card
        text-variant="center"
        class="card card-congratulations"
      >
        <b-img
          :src="require('@/assets/images/elements/decore-left.png')"
          class="congratulations-img-left"
        />
        <b-img
          :src="require('@/assets/images/elements/decore-right.png')"
          class="congratulations-img-right"
        />

        <b-avatar
          variant="primary"
          size="70"
          class="shadow mb-2"
        >
          <feather-icon
            size="28"
            icon="AwardIcon"
          />
        </b-avatar>
        <h1 class="mb-1 mt-50 text-white">
          恭喜!
        </h1>
        <b-card-text class="m-auto w-75">
          你是第100萬位經過這條商店街的客人
        </b-card-text>
      </b-card>
    </b-col>
    <b-col
      v-for="category in items"
      :key="category.id"
      cols="12"
      xl="3"
      md="4"
      sm="6"
    >
      <statistic-card-vertical
        :color="category.color"
        :statistic="category.name"
        icon="ShoppingBagIcon"
        @click.native="go(category.id)"
      />
    </b-col>
  </b-row>
</template>

<script>
import {
  BCard, BImg, BCardText, BTable, BAvatar, BBadge, BRow, BCol, BFormGroup, BFormSelect, BPagination, BInputGroup, BFormInput, BInputGroupAppend, BButton,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import StatisticCardVertical from '@core/components/statistics-cards/StatisticCardVertical.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCard,
    BImg,
    BCardText,
    BTable,
    BAvatar,
    BBadge,
    BRow,
    BCol,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BButton,
    ToastificationContent,
    StatisticCardVertical,
  },
  data() {
    return {
      perPage: 10,
      pageOptions: [5, 10, 15, 20],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
      fields: [
        { key: 'id', label: '編號', sortable: true },
        { key: 'name', label: '名稱', sortable: true },
        { key: 'priority', label: '排序', sortable: true },
      ],
      items: [
        {
          id: 1,
          name: 'name',
          priority: 0,
        },
      ],
      categories: [],
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }))
    },
  },
  created() {
    this.loadCategory()
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length
  },
  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    loadCategory() {
      useJwt.axiosIns.post('http://127.0.0.1:8080/category/categorys').then(res => {
        if (res.data.error) {
          this.showToast(res.data.error, 'danger')
          return
        }
        this.items = []
        res.data.forEach(item => {
          this.items.push({
            id: item.id,
            name: item.name,
            priority: item.priority,
            color: this.randColor(),
          })
        })
        this.totalRows = this.items.length
      })
    },
    go(idx) {
      this.$router.push({ name: 'category', params: { id: idx } })
    },
    randColor() {
      const rand = Math.floor(Math.random() * 6)
      const arr = ['primary', 'secondary', 'success', 'warning', 'danger', 'info']
      return arr[rand]
    },
  },
}

</script>

<style>

</style>
