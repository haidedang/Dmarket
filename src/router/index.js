import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signup from '@/components/Signup'
import Register from '@/components/Register'
import NewOrganization from '@/components/NewOrganization'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/newOrganization',
      name: 'newOrganisation',
      component: NewOrganization
    }
  ]
})

export default router
