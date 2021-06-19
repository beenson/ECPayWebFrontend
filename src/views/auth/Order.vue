<template>
  <b-card>
    <b-card-body class="invoice-padding pb-0">
      <div class="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">

        <!-- Header: Left Content -->
        <div class="logo-wrapper">
          <h3 class="text-primary invoice-logo">
            買爆
          </h3>
        </div>

        <!-- Header: Right Content -->
        <div class="mt-md-0 mt-2">
          <h4 class="invoice-title">
            order
            <span class="invoice-number">#{{ id }}</span>
          </h4>
          <div class="invoice-date-wrapper">
            <p class="invoice-date-title">
              下訂日期:
            </p>
            <p class="invoice-date">
              {{ orderDate }}
            </p>
          </div>
        </div>
      </div>
    </b-card-body>

    <!-- Spacer -->
    <hr class="invoice-spacing">

    <b-card-body
      class="invoice-padding pt-0"
    >
      <b-col
        cols="12"
        xl="6"
        class="p-0"
      >
        <div>
          <h6 class="mb-2">
            付款資訊:
          </h6>
          <table>
            <tbody>
              <tr>
                <td class="pr-1">
                  狀態:
                </td>
                <td><span class="font-weight-bold">{{ status }}</span></td>
              </tr>
              <tr>
                <td class="pr-1">
                  付款方式:
                </td>
                <td><span class="font-weight-bold">{{ type }}</span></td>
              </tr>
              <tr>
                <td class="pr-1">
                  銀行:
                </td>
                <td>{{ bank }}</td>
              </tr>
              <tr>
                <td class="pr-1">
                  代碼:
                </td>
                <td>{{ code }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>
    </b-card-body>

    <b-table-lite
      responsive
      :items="items"
      :fields="fields"
    >
      <template #cell(picture)="data">
        <b-img
          class="col-6"
          :src="data.value"
        />
      </template>
    </b-table-lite>

    <!-- Invoice Description: Total -->
    <b-card-body class="invoice-padding pb-0">
      <b-row>
        <!-- Col: Sales Persion -->
        <b-col
          cols="12"
          md="6"
          class="mt-md-0 mt-3"
          order="2"
          order-md="1"
        />
        <!-- Col: Total -->
        <b-col
          cols="12"
          md="6"
          class="mt-md-6 d-flex justify-content-end"
          order="1"
          order-md="2"
        >
          <div class="invoice-total-wrapper">
            <div class="invoice-total-item">
              <p class="invoice-total-title">
                <strong>Total:{{ total }}</strong>
              </p>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BTable, BAvatar, BBadge, BRow, BCol, BFormGroup, BTableLite, BFormSelect, BPagination, BInputGroup, BFormInput, BInputGroupAppend, BButton, BImg,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCard,
    BTable,
    BTableLite,
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
      orderDate: '2021/6/19',
      status: '未付款',
      type: '銀行',
      bank: '--------',
      code: '987987',
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
        const timestamp = new Date(res.data.Order.createAt)
        this.orderDate = [timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate()].join('/').concat(' ', [timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds()].map(ele => '0'.concat(ele).slice(-2)).join(':'))
        this.status = res.data.Payment.status
        this.type = res.data.Payment.type
        this.bank = res.data.Payment.bank === '' ? '------------' : res.data.Payment.bank
        this.code = res.data.Payment.code
        this.total = res.data.Order.price
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
