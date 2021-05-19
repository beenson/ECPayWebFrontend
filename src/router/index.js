import Vue from 'vue'
import VueRouter from 'vue-router'
import useJwt from '@/auth/jwt/useJwt'

Vue.use(VueRouter)
// 註解 -- 路由器
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: '首頁',
        breadcrumb: [
          {
            text: '首頁',
            active: true,
          },
        ],
        access: 'user',
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        pageTitle: 'Second Page',
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/auth/Profile.vue'),
      meta: {
        pageTitle: '個人資料',
        access: 'user',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/Register.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.access) {
    useJwt.refreshToken().then(res => {
      if (res.data.error) {
        localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
        localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)
        localStorage.removeItem('user')
      } else {
        useJwt.setToken(res.data.token)
        useJwt.setRefreshToken(res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
      }
    })
    if (!useJwt.getToken()) {
      next({ name: 'login' })
    }
    next()
  } else {
    if (useJwt.getToken()) {
      next({ name: 'home' })
    }
    next()
  }
})

export default router
