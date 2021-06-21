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
    /* {
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
    }, */
    {
      path: '/category/:id',
      name: 'category',
      component: () => import('@/views/category/category.vue'),
      meta: {
        contentClass: 'ecommerce-application',
        pageTitle: 'Category Page',
        breadcrumb: [
          {
            text: '商品分類',
            active: true,
          },
        ],
        access: 'user',
      },
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/product/product.vue'),
      meta: {
        pageTitle: '商品',
        access: 'user',
      },
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/category/category.vue'),
      meta: {
        contentClass: 'ecommerce-application',
        pageTitle: 'Product Page',
        breadcrumb: [
          {
            text: '商品分類',
            active: true,
          },
        ],
        access: 'user',
      },
    },
    {
      path: '/user',
      component: () => import('@/views/auth/base.vue'),
      children: [
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
          path: '/cart',
          name: 'cart',
          component: () => import('@/views/auth/ShoppingCart.vue'),
          meta: {
            pageTitle: '購物車',
            access: 'user',
          },
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('@/views/auth/Orders.vue'),
          meta: {
            pageTitle: '我的訂單',
            access: 'user',
          },
        },
        {
          path: '/order/:id',
          name: 'order',
          component: () => import('@/views/auth/Order.vue'),
          meta: {
            pageTitle: '我的訂單',
            access: 'user',
          },
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/base.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'admin.dashboard',
          component: () => import('@/views/admin/dashboard.vue'),
          meta: {
            pageTitle: '儀表板',
            access: 'admin',
            breadcrumb: [
              {
                text: '管理後台',
                active: true,
              },
              {
                text: '後台統計',
                active: true,
              },
            ],
          },
        },
        {
          path: 'user/:id',
          name: 'admin.user',
          component: () => import('@/views/admin/user.vue'),
          meta: {
            pageTitle: '會員管理',
            access: 'admin',
            breadcrumb: [
              {
                text: '管理後台',
                active: true,
              },
              {
                text: '會員管理',
                active: true,
              },
            ],
          },
        },
        {
          path: 'users',
          name: 'admin.users',
          component: () => import('@/views/admin/users.vue'),
          meta: {
            pageTitle: '會員管理',
            access: 'admin',
            breadcrumb: [
              {
                text: '管理後台',
                active: true,
              },
              {
                text: '會員管理',
                active: true,
              },
            ],
          },
        },
        {
          path: 'product/:id',
          name: 'admin.product',
          component: () => import('@/views/admin/product.vue'),
          meta: {
            pageTitle: '商品管理',
            access: 'admin',
            breadcrumb: [
              {
                text: '管理後台',
                active: true,
              },
              {
                text: '商品管理',
                active: true,
              },
            ],
          },
        },
        {
          path: 'product/create',
          name: 'admin.productCreate',
          component: () => import('@/views/admin/product_create.vue'),
          meta: {
            pageTitle: '商品新增',
            access: 'admin',
            breadcrumb: [
              {
                text: '管理後台',
                active: true,
              },
              {
                text: '商品管理',
                active: true,
              },
              {
                text: '商品新增',
                active: true,
              },
            ],
          },
        },
        {
          path: 'products',
          name: 'admin.products',
          component: () => import('@/views/admin/products.vue'),
          meta: {
            pageTitle: '商品管理',
            access: 'admin',
            breadcrumb: [
              {
                text: '管理後台',
                active: true,
              },
              {
                text: '商品管理',
                active: true,
              },
            ],
          },
        },
      ],
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

router.beforeEach(async (to, from, next) => {
  if (to.meta.access === 'user' || to.meta.access === 'admin') {
    if (useJwt.getToken() !== 'undefined' && useJwt.getToken() !== undefined && useJwt.getToken() !== null) {
      await useJwt.refreshToken().then(res => {
        if (res.data.token) {
          if (to.meta.access === 'admin') {
            if (res.data.user.admin <= 0) {
              next({ name: 'error-404' })
            }
          }
          next()
        }
      })
    } else {
      next({ name: 'login' })
    }
    return
  }
  if (useJwt.getToken() !== 'undefined' && useJwt.getToken() !== undefined && useJwt.getToken() !== null) {
    next({ name: 'home' })
    return
  }
  next()
})

export default router
