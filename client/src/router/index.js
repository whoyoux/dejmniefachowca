import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      cantGoIfLogged: true
    },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/profile/:id',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/confirm/:confirmToken',
    component: () => import('../views/ConfirmAccount.vue'),
  },
    {
      path: '/changeAvatar',
      component: () => import('../views/ChangeAvatar'),
      meta: {
        requiresAuth: true
      }
    },
  {
    path: '/*',
    component: () => import('../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from,next) => {  
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(localStorage.getItem("jwt") == null) {
      next({
        path: from.fullPath
      });
    } else {
      next();
    }
  } else if(to.matched.some(record => record.meta.cantGoIfLogged)) {
    if(localStorage.getItem("jwt") == null) {
      next();
    } else {
      next({
        path: '/dashboard'
      });
    }
  } else {
    next();
  }

  
  
});

export default router
