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
            >
              <template v-slot:first>
                <option value="">
                  -- none --
                </option>
              </template>
            </b-form-select>
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
        >
          <template #cell(picture)="data">
            <b-img
              class="col-12"
              :src="data.value"
            />
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
  BCard, BTable, BAvatar, BBadge, BRow, BCol, BFormGroup, BFormSelect, BPagination, BInputGroup, BFormInput, BInputGroupAppend, BButton, BImg,
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
    BImg,
    ToastificationContent,
  },
  data() {
    return {
      id: this.$router.currentRoute.params.id,
      perPage: 10,
      pageOptions: [5, 10, 15, 20],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
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
        { key: 'picture', label: '照片', sortable: false },
        { key: 'name', label: '商品名稱', sortable: true },
        { key: 'desc', label: '商品描述', sortable: false },
        { key: 'price', label: '單價', sortable: true },
        { key: 'amount', label: '數量', sortable: true },
        { key: 'productTot', label: '小計', sortable: false },
      ],
      items: [
        {
          picture: '',
          name: 'name',
          desc: 'desc',
          price: 0,
          amount: 0,
          productTot: 0,
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
    this.loadOrder()
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
    loadOrder() {
      useJwt.axiosIns.post(`http://127.0.0.1:8080/order/${this.id}`).then(res => {
        if (res.data.error) {
          this.showToast(res.data.error, 'danger')
          return
        }
        this.items = []
        res.data.OrderItems.forEach(item => {
          useJwt.axiosIns.post(`http://127.0.0.1:8080/product/${item.productId}`).then(pres => {
            if (pres.data.error) {
              this.showToast(pres.data.error, 'danger')
              return
            }
            const p = pres.data.product
            this.items.push({
              picture: p.photo,
              name: p.name,
              desc: p.desc,
              price: p.price,
              amount: item.amount,
              productTot: p.price * item.amount,
            })
            this.totalRows = this.items.length
          })
        })
      })
    },
  },
}

</script>

<style>
  @media (max-width: 679px) {
    tbody tr td {
      max-width: 100%;
    }
  }
  @media (min-width: 680px) and (max-width: 4000px) {
    tbody tr td {
      max-width: 20vw;
    }
  }
  td img {
    min-height: 4vh;
    min-width: 6vh;
  }
</style>
