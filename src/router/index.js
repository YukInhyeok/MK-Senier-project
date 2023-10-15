import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import marketmap from '@/components/marketmap.vue'
import map from '@/components/Map.vue'

import submitReview from '@/components/submitReview.vue'
import SellerLogin from '@/components/Seller/SellerLogin.vue'
import SellerSignup from '@/components/Seller/SellerSignup.vue'
import ProductRegistration from '@/components/Seller/ProductRegistration.vue'
import SelectProduct from '@/components/Search/SearchProduct.vue'
import StoreRegistration from '@/components/StoreRegistration.vue'
import Kiosk from '@/components/kiosk/kioskMap.vue'
import SellerSelect from '@/components/Seller/SellerSelect.vue'
import SellerInfo from '@/components/Seller/SellerInfo.vue'
import StoreInfo from '@/components/StoreInfo.vue'
import FindPassword from '@/components/Seller/SellerFindPassword.vue'
import StorePage from'@/components/StorePage.vue'
import SearchProduct from '@/components/Search/SearchProduct.vue'
import SearchMap from '@/components/Search/SearchMap.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path : '/FindPassword',
    name : 'FindPassword',
    component : FindPassword

  },
  {
    path:'/Storeinfo',
    name: 'Storeinfo',
    component : StoreInfo

  },
  {
    path:'/SellerInfo/:userId',
    name:'SellerInfo',
    component: SellerInfo

  },
  {
    path: '/marketmap',
    name: 'marketmap',
    component: marketmap
  },
  {
    path:'/map',
    name: 'map',
    component: map
  },
  {
    path: '/SellerLogin',
    name: 'SellerLogin',
    component: SellerLogin
  },
  {
    path:'/SellerSignup',
    name:'SellerSignup',
    component: SellerSignup
  },
  {
    path:'/submitReview/:storeId',
    name:'submitReview',
    component: submitReview
  },
  {
    path :'/ProductRegistration/:userId',
    name:'ProductRegistration',
    component:ProductRegistration
  }, 
  {
    path:'/SelectProduct',
    name: 'SelectProduct',
    component : SelectProduct
  },
  {
    path:'/StoreRegistration',
    name: 'StoreRegistration',
    component : StoreRegistration
  },
  {
    path:'/kiosk',
    name: 'kiosk',
    component : Kiosk
  },
  {
    path:'/SellerSelect',
    name:'SellerSelect',
    component : SellerSelect
  },
  {
    path: '/Si',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/Search',
    name:'Search',
    component : SearchProduct
  },
  {
    path:'/SearchMap',
    name:'SearchMap',
    component : SearchMap
  },
  {
    path: '/store/:storeId',
    name: 'StorePage',
    component: StorePage,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
