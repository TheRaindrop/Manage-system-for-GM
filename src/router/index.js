import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            // component: resolve => require(['../components/common/Home.vue'], resolve)
            redirect: '/login'
        },
        {
            path: '/login',
            component: resolve => require(['@/pages/Login.vue'], resolve)
        },
        {
            path: '/home',
            component: resolve => require(['@/components/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['@/pages/Index.vue'], resolve)
                },
                {
                    path: '/flight',
                    component: resolve => require(['@/pages/flight/Flight.vue'], resolve)
                },
                {
                    path: '/flightReschedule',
                    component: resolve => require(['@/pages/flight/FlightReschedule.vue'], resolve)
                },
                {
                    path: '/flightOrder',
                    component: resolve => require(['@/pages/flight/FlightOrder.vue'], resolve)
                },
                {
                    path: '/hotel',
                    component: resolve => require(['@/pages/hotel/Hotel.vue'], resolve)
                },
                {
                    path: '/hotelDetail',
                    component: resolve => require(['@/pages/hotel/HotelDetail.vue'], resolve)
                },
                {
                    path: '/order',
                    component: resolve => require(['@/pages/order/Order.vue'], resolve)
                },
                {
                    path: '/users',
                    component: resolve => require(['@/pages/users/Users.vue'], resolve)
                },
                {
                    path: '/gCoin',
                    component: resolve => require(['@/pages/credit/GCoin.vue'], resolve)
                },
                {
                    path: '/vipHall',
                    component: resolve => require(['@/pages/credit/VipHall.vue'], resolve)
                },
                {
                    path: '/insurance',
                    component: resolve => require(['@/pages/insurance/Insurance.vue'], resolve)
                },
                {
                    path: '/return',
                    component: resolve => require(['@/pages/return/Return.vue'], resolve)
                },
                {
                    path: '/returnDetail',
                    component: resolve => require(['@/pages/return/ReturnDetail.vue'], resolve)
                }
            ]
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
})
