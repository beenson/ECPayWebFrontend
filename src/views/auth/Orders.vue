<template>
  <b-card>
    <b-row>
      <b-col
        md="2"
        sm="4"
        class="my-1"
      >
        <b-form-group
          class="mb-0"
        >
          <label class="d-inline-block text-sm-left mr-50">顯示比數</label>
          <b-form-select
            id="perPageSelect"
            v-model="perPage"
            size="sm"
            :options="pageOptions"
            class="w-50"
          />
        </b-form-group>
      </b-col>
      <b-col
        md="4"
        sm="8"
        class="my-1"
      >
        <b-form-group
          label="排序"
          label-cols-sm="2"
          label-align-sm="right"
          label-size="sm"
          label-for="sortBySelect"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-select
              id="sortBySelect"
              v-model="sortBy"
              :options="sortOptions"
              class="w-75"
            />
            <b-form-select
              v-model="sortDesc"
              size="sm"
              :disabled="!sortBy"
              class="w-25"
            >
              <option :value="false">
                升冪
              </option>
              <option :value="true">
                降冪
              </option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col
        md="6"
        class="my-1"
      >
        <b-form-group
          label="搜尋"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              placeholder="請輸入關鍵字"
            />
            <b-input-group-append>
              <b-button
                variant="primary"
                :disabled="!filter"
                @click="filter = ''"
              >
                清除
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-table
          striped
          hover
          responsive
          selectable
          :per-page="perPage"
          :current-page="currentPage"
          :items="items"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :filter="filter"
          :filter-included-fields="filterOn"
          @filtered="onFiltered"
          @row-selected="onRowSelected"
        >
          <template #cell(avatar)="data">
            <b-avatar :src="data.value" />
          </template>

          <template #cell(status)="data">
            <b-badge :variant="status[1][data.value]">
              {{ status[0][data.value] }}
            </b-badge>
          </template>

        </b-table>
      </b-col>

      <b-col
        cols="12"
      >
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="center"
          size="sm"
          class="my-0"
        />
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard, BTable, BAvatar, BBadge, BRow, BCol, BFormGroup, BFormSelect, BPagination, BInputGroup, BFormInput, BInputGroupAppend, BButton,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCard,
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
  },
  data() {
    return {
      perPage: 10,
      pageOptions: [5, 10, 15, 20],
      totalRows: 1,
      currentPage: 1,
      sortBy: 'createAt',
      sortDesc: true,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
      fields: [
        { key: 'id', label: '訂單編號', sortable: true },
        { key: 'price', label: '金額', sortable: true },
        { key: 'createAt', label: '建立日期', sortable: true },
      ],
      items: [
        {
          id: 1,
          price: 0,
          createAt: '',
        },
      ],
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
    this.loadOrders()
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
    loadOrders() {
      useJwt.axiosIns.post('http://127.0.0.1:8080/order/list').then(res => {
        if (res.data.error) {
          this.showToast(res.data.error, 'danger')
          return
        }
        this.items = []
        res.data.forEach(item => {
          const date = new Date(item.createAt)
          this.items.push({
            id: item.id,
            price: item.price,
            createAt: [date.getFullYear(), date.getMonth(), date.getDate()].join('/').concat(' ', [date.getHours(), date.getMinutes(), date.getSeconds()].map(ele => '0'.concat(ele).slice(-2)).join(':')),
          })
        })
        this.totalRows = this.items.length
      })
    },
    onRowSelected(items) {
      this.$router.push({ name: 'order', params: { id: items[0].id } })
    },
  },
}

</script>

<style>

</style>
