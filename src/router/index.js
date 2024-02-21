import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'product',
      component: () => import('@/views/Product.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'product',
        breadcrumb: [
          {
            text: 'product',
            active: true,
          },

        ],
      },
    },
    {
      path: '/products/add',
      name: 'add-product',
      component: () => import('@/views/ProductForm.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'add-product',
        breadcrumb: [
          {
            text: 'add-product',
            active: true,
          },

        ],
      },
    },
    {
      path: '/products/:id/edit',
      name: 'edit-product',
      component: () => import('@/views/ProductForm.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'edit-product',
        breadcrumb: [
          {
            text: 'edit-product',
            active: true,
          },

        ],
      },
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductDetail.vue'),
      meta: {
        requiresAuth: true,
        pageTitle: 'product-detail',
        breadcrumb: [
          {
            text: 'product-detail',
            active: true,
          },

        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
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

// Function to check if the user is authenticated
function isAuthenticated() {
  // Check if user has a valid token
  const token = localStorage.getItem('accessToken')
  return !!token
}

// Navigation guards
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Protected route requires authentication
    if (!isAuthenticated()) {
      // If not authenticated, redirect to login
      next({
        name: 'login',
        query: { redirect: to.fullPath }, // Save the intended route for redirection after login
      })
    } else {
      // If authenticated, proceed to the route
      next()
    }
  } else {
    // Public route
    // eslint-disable-next-line no-lonely-if
    if (isAuthenticated()) {
      // If authenticated user tries to access a public route, redirect them to a private route
      next({ name: 'product' }) // Redirect to the product page or any other private route
    } else {
      // If not authenticated, proceed to the public route
      next()
    }
  }
})

export default router
