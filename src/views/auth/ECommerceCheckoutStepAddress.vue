<template>
  <validation-observer
    #default="{ handleSubmit }"
    ref="refFormObserver"
  >
    <b-form
      class="list-view product-checkout"
      @submit.prevent="handleSubmit(onSubmit)"
    >

      <!-- Left Form -->
      <b-card no-body>
        <b-card-header class="flex-column align-items-start">
          <b-card-title>填寫收貨地址</b-card-title>
        </b-card-header>
        <b-card-body>
          <b-row>

            <!-- Full Name -->
            <b-col
              cols="12"
              md="6"
            >
              <validation-provider
                #default="validationContext"
                name="名稱"
                rules="required"
              >
                <b-form-group
                  label="名稱"
                  label-for="full-name"
                  class="mb-2"
                >
                  <b-form-input
                    id="full-name"
                    v-model="addressDetails.fullName"
                    :state="getValidationState(validationContext)"
                    trim
                  />
                  <b-form-invalid-feedback>
                    {{ validationContext.errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>

            <!-- Mobile Number -->
            <b-col
              cols="12"
              md="6"
              class="mb-2"
            >
              <validation-provider
                #default="validationContext"
                name="手機號碼"
                rules="required|integer"
              >
                <b-form-group
                  label="手機號碼"
                  label-for="mobile-number"
                >
                  <b-form-input
                    id="mobile-number"
                    v-model="addressDetails.mobile"
                    type="number"
                    :state="getValidationState(validationContext)"
                    trim
                  />
                  <b-form-invalid-feedback>
                    {{ validationContext.errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>

            <!-- City -->
            <b-col
              cols="12"
              md="6"
            >
              <validation-provider
                #default="validationContext"
                name="地址"
                rules="required"
              >
                <b-form-group
                  label="地址"
                  label-for="city"
                  class="mb-2"
                >
                  <b-form-input
                    id="city"
                    v-model="addressDetails.city"
                    :state="getValidationState(validationContext)"
                    trim
                  />
                  <b-form-invalid-feedback>
                    {{ validationContext.errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>

            <!-- pincode -->
            <b-col
              cols="12"
              md="6"
            >
              <validation-provider
                #default="validationContext"
                name="郵遞區號"
                rules="required|integer"
              >
                <b-form-group
                  label="郵遞區號"
                  label-for="pincode"
                  class="mb-2"
                >
                  <b-form-input
                    id="pincode"
                    v-model="addressDetails.pincode"
                    type="number"
                    :state="getValidationState(validationContext)"
                    trim
                  />
                  <b-form-invalid-feedback>
                    {{ validationContext.errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>

            <!-- Submit Button -->
            <b-col cols="12">
              <b-button
                variant="primary"
                @click="saveSubmit()"
              >
                儲存並下一步
              </b-button>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <!-- Right Col -->
      <div class="customer-card">
        <b-card
          v-for="(deliver, i) in delivers"
          :key="i"
          :title="deliver.name"
        >
          <b-card-text>{{ deliver.pincode }} {{ deliver.address }}</b-card-text>
          <b-card-text>{{ deliver.phone }}</b-card-text>
          <b-button
            variant="primary"
            block
            @click="$emit('next-step')"
          >
            使用此收貨資料
          </b-button>
        </b-card>
      </div>
    </b-form>
  </validation-observer>
</template>

<script>
import {
  BForm, BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BRow, BCol, BFormGroup, BFormInput, BButton, BFormInvalidFeedback,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import vSelect from 'vue-select'
import { required, integer } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'

export default {
  components: {
    // BSV
    BForm,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BButton,
    BFormInvalidFeedback,

    // Form Validation
    ValidationProvider,
    ValidationObserver,

    // 3rd party
    vSelect,
  },
  props: {
    addressDetails: {
      type: Object,
      required: true,
    },
  },
  setup(_, { emit }) {
    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(() => {})

    const onSubmit = () => {
      emit('next-step')
    }

    let delivers = []

    const loadDeliver = () => {
      delivers = []
      if (localStorage.getItem('delivers')) {
        const json = JSON.parse(localStorage.getItem('delivers'))
        json.forEach(data => {
          delivers.push(data)
        })
      }
    }

    loadDeliver()

    return {

      // Form
      onSubmit,

      // Form Validation
      refFormObserver,
      getValidationState,
      resetForm,

      // FOrm Validators
      required,
      integer,

      loadDeliver,
      delivers,
    }
  },
  created() {
  },
  methods: {
    saveSubmit() {
      const deliver = {
        name: this.addressDetails.fullName,
        address: this.addressDetails.city,
        phone: this.addressDetails.mobile,
        pincode: this.addressDetails.pincode,
      }
      this.delivers.push(deliver)
      this.setLocalStorage()
      this.$emit('next-step')
    },
    setLocalStorage() {
      const json = JSON.stringify(this.delivers)
      localStorage.setItem('delivers', json)
      this.loadDeliver()
      this.$forceUpdate()
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
<style>
  .list-view {
    grid-template-columns: 3fr 1fr;
  }
</style>
