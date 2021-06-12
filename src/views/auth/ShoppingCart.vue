<template>
  <section class="dark-layout ecommerce-application">
    <form-wizard
      ref="refFormWizard"
      color="#7367F0"
      :title="null"
      :subtitle="null"
      finish-button-text="Submit"
      back-button-text="Previous"
      hide-buttons
      class="checkout-form-wizard steps-transparent"
    >
      <!-- account detail tab -->
      <tab-content
        title="購買列表"
        icon="feather icon-shopping-cart"
      >
        <e-commerce-checkout-step-cart @next-step="formWizardNextStep" />
      </tab-content>

      <!-- address -->
      <tab-content
        title="聯絡資訊"
        icon="feather icon-home"
      >
        <e-commerce-checkout-step-address
          :address-details="checkoutDetails.address"
          @next-step="formWizardNextStep"
        />
      </tab-content>

      <!-- social link -->
      <tab-content
        title="付款"
        icon="feather icon-credit-card"
      >
        <e-commerce-checkout-step-payment
          :payment-details="checkoutDetails.payment"
          @next-step="formWizardNextStep"
        />
      </tab-content>
    </form-wizard>
  </section>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ref } from '@vue/composition-api'
import ECommerceCheckoutStepPayment from './ECommerceCheckoutStepPayment.vue'
import ECommerceCheckoutStepCart from './ECommerceCheckoutStepCart.vue'
import ECommerceCheckoutStepAddress from './ECommerceCheckoutStepAddress.vue'

export default {
  components: {
    // 3rd Party
    FormWizard,
    TabContent,

    // SFC
    ECommerceCheckoutStepCart,
    ECommerceCheckoutStepAddress,
    ECommerceCheckoutStepPayment,
  },
  setup() {
    const refFormWizard = ref(null)
    const formWizardNextStep = () => {
      refFormWizard.value.tabs[2].$children[0].getTotal()
      refFormWizard.value.nextTab()
    }

    // ? This is just dummy details
    const checkoutDetails = ref({
      address: {
        fullName: '',
        mobile: '',
        houseNo: '',
        landmark: '',
        city: '',
        pincode: '',
        state: '',
        addressType: null,
      },
      payment: {
        cvv: '',
      },
    })

    return {
      refFormWizard,
      formWizardNextStep,

      // Dummy Details
      checkoutDetails,
    }
  },
}
</script>

<style lang="css">
@import '~@core/assets/fonts/feather/iconfont.css';
</style>
<style lang="scss">
@import '@core/scss/vue/libs/vue-wizard.scss';
@import '~@core/scss/base/pages/app-ecommerce.scss';
@import '~vue-form-wizard/dist/vue-form-wizard.min.css';
</style>

<style lang="scss" scoped>
.checkout-form-wizard ::v-deep {
  .wizard-tab-content {
    box-shadow: none !important;
    background: transparent !important;
    padding: 0;
  }
}
</style>
