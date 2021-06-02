<template>
  <b-card>
    <div>
      <!-- Media -->
      <b-media class="mb-2">
        <template #aside>
          <b-avatar
            ref="previewEl"
            :src="userData.avatar"
            :text="avatarText(userData.name)"
            :variant="`light-primary`"
            size="90px"
            rounded
          />
        </template>
        <h4 class="mb-1">
          {{ userData.name }}
        </h4>
        <div class="d-flex flex-wrap">
          {{ userData.admin > 0 ? '管理員' : '使用者' }}
        </div>
      </b-media>

      <!-- User Info: Input Fields -->
      <b-form>
        <b-row>
          <!-- Field: Full Name -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="名稱"
              label-for="full-name"
            >
              <b-form-input
                id="full-name"
                v-model="userData.name"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Email -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="信箱"
              label-for="email"
            >
              <b-form-input
                id="email"
                v-model="userData.email"
                type="email"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Phone -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="手機"
              label-for="phone"
            >
              <b-form-input
                id="phone"
                v-model="userData.phone"
              />
            </b-form-group>
          </b-col>

          <!-- Field: password -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="密碼"
              label-for="password"
            >
              <b-form-input
                id="password"
                v-model="password"
                type="password"
              />
            </b-form-group>
          </b-col>

          <!-- Field: admin -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="權限"
              label-for="admin"
            >
              <b-form-select
                id="admin"
                v-model="userData.admin"
              >
                <option :value="0">
                  會員
                </option>
                <option :value="1">
                  管理員
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>

        </b-row>
      </b-form>

      <!-- PERMISSION TABLE -->
      <!-- <b-card
        no-body
        class="border mt-1"
      >
        <b-card-header class="p-1">
          <b-card-title class="font-medium-2">
            <feather-icon
              icon="LockIcon"
              size="18"
            />
            <span class="align-middle ml-50">Permission</span>
          </b-card-title>
        </b-card-header>
        <b-table
          striped
          responsive
          class="mb-0"
          :items="permissionsData"
        >
          <template #cell(module)="data">
            {{ data.value }}
          </template>
          <template #cell()="data">
            <b-form-checkbox :checked="data.value" />
          </template>
        </b-table>
      </b-card> -->

      <!-- Action Buttons -->
      <b-button
        variant="primary"
        class="mb-1 mb-sm-0 mr-0 mr-sm-1"
        :block="$store.getters['app/currentBreakPoint'] === 'xs'"
        @click="submit"
      >
        修改
      </b-button>
      <b-button
        variant="outline-secondary"
        type="reset"
        :block="$store.getters['app/currentBreakPoint'] === 'xs'"
        @click="reset"
      >
        重設
      </b-button>
    </div>
  </b-card>
</template>

<script>
import {
  BButton, BMedia, BAvatar, BRow, BCol, BFormSelect, BFormGroup, BFormInput, BForm, BTable, BCard, BCardHeader, BCardTitle, BFormCheckbox,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { ref } from '@vue/composition-api'
import querystring from 'querystring'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BForm,
    BTable,
    BCard,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
  },
  setup(props) {
    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, base64 => {
      // eslint-disable-next-line no-param-reassign
      props.userData.avatar = base64
    })

    return {
      avatarText,

      //  ? Demo - Update Image on click of update button
      refInputEl,
      previewEl,
      inputImageRenderer,
    }
  },
  data() {
    return {
      id: this.$router.currentRoute.params.id,
      userData: {
        admin: 0,
        email: '',
        id: 0,
        name: '',
        phone: '',
      },
      userDataOri: JSON.parse(localStorage.getItem('user')),
      password: '',
    }
  },
  created() {
    this.loadUser()
  },
  methods: {
    reset() {
      this.userData.name = this.userDataOri.name
      this.userData.email = this.userDataOri.email
      this.userData.phone = this.userDataOri.phone
      this.userData.admin = this.userDataOri.admin
      this.password = ''
    },
    loadUser() {
      useJwt.axiosIns.post(`http://127.0.0.1:8080/user/admin/user/${this.id}`).then(res => {
        if (res.data.error) {
          this.showToast(res.data.error, 'danger')
          return
        }
        this.userData = res.data.user
        this.userDataOri = JSON.parse(JSON.stringify(res.data.user))
      })
    },
    submit() {
      let changePW = false
      if (this.password !== '') {
        changePW = true
      }
      if (this.userData.name === '') {
        this.showToast('請輸入名稱', 'danger')
        return
      }
      if (this.userData.phone === '') {
        this.showToast('請輸入手機號碼', 'danger')
        return
      }
      if (this.userData.email === '') {
        this.showToast('請輸入信箱', 'danger')
        return
      }
      const body = {
        newPhone: this.userData.phone,
        newName: this.userData.name,
        newEmail: this.userData.email,
        newAdmin: this.userData.admin,
      }
      if (changePW) {
        body.newPassword = this.password
      }
      useJwt.axiosIns.post(`http://127.0.0.1:8080/user/admin/user/${this.id}/edit`, querystring.stringify(body)).then(res => {
        if (res.data.error) {
          this.showToast(res.data.error, 'danger')
          return
        }
        this.userData = res.data.user
        this.showToast('修改會員資料成功!', 'success')
      })
    },
    showToast(title, variant) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title,
          icon: 'EditIcon',
          variant,
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
