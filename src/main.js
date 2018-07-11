// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(Vuex)
Vue.use(ElementUI)

const store = new Vuex.Store({
    state: {// 用来存储flight搜索数据和hotel搜索数据
        count: 0,
        collapse: true,
        flight: {
            depart: '北京(BJS)',
            arrive: '上海(SHA)',
            setTime: '',
            theDepart: {
                airportCode: 'PEK',
                airportNameCN: '北京首都国际机场',
                airportNameEN: 'beijing',
                cityCode: 'BJS',
                cityNameCN: '北京',
                cityNameEN: 'beijing',
                cityPinyin: 'beijing',
                cityPy: 'bj',
                isHot: 'Y'
            },
            theArrive: {
                airportCode: 'PVG',
                airportNameCN: '上海浦东机场',
                airportNameEN: 'Shanghai',
                cityCode: 'SHA',
                cityNameCN: '上海',
                cityNameEN: 'Shanghai',
                cityPinyin: 'shanghai',
                cityPy: 'sh',
                isHot: 'Y'
            }
        },
        hotel: {
            destination: '深圳',
            scenicClass: '',
            scenic: '',
            rangeTime: []
        }
    },
    mutations: {
        collToggle () {
            this.state.collapse = !this.state.collapse
        },
        departChange (state, depart) {
            state.flight.theDepart = depart
            state.flight.depart = depart.cityNameCN + '(' + depart.cityCode + ')'
        },
        arriveChange (state, arrive) {
            state.flight.theArrive = arrive
            state.flight.arrive = arrive.cityNameCN + '(' + arrive.cityCode + ')'
        },
        setTime (state, time) {
            state.flight.setTime = time
        },
        saveHotel (state, hotel) {
            state.hotel = hotel
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store: store,
    components: { App },
    template: '<App/>',
    created () {
        const gm = {} // 常量对象
        gm.apiurl = 'http://120.79.174.104:8000' // 后台URL
        axios.interceptors.request.use(function (config) { // axios请求拦截
            if (!config.local_data) { // 判断是否取本地数据，因为有些json数据在前端本地存储
                config.url = gm.apiurl + config.url
            }
            config.headers.Authorization = 'Token ' + localStorage.Token // 在发送之前添加TOKEN
            config.timeout = 30000 // 响应超时时间30s
            return config
        }, function (error) {
            return Promise.reject(error)
        })
        axios.interceptors.response.use((response) => { // axios响应拦截
            return response
        }, (error) => {
            // console.log('from main.js error code:', error.message)
            if (error.message === 'Network Error') { // Network Error判断
                if (window.navigator.onLine) {
                    this.$message.error('服务器错误，请联系管理员')
                } else {
                    this.$message.error('网络错误，请检查电脑是否联网')
                }
                return
            }
            if (error.code === 'ECONNABORTED') {
                this.$message.error('请求超时，请重试')
                return
            }
            if (error.response.status === 401) { // 请求错误判断，现在看用switch好像更合适点。。。
                console.log(error.response.data)
                if (error.response.data.message.includes('password')) {
                    this.$alert('账号或密码错误', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {}
                    })
                } else if (error.response.data.message.includes('token')) {
                    this.$alert('登录信息过期，请重新登录', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            localStorage.removeItem('Token')
                            this.$router.push('/')
                        }
                    })
                }
            } else if (error.response.status === 403) {
                this.$alert('权限不足', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {}
                })
            } else if (error.response.status === 404) {
                this.$message.error('未找到请求资源')
            } else if (error.response.status >= 500) {
                this.$message.error('服务器错误')
            } else if (error.response.status === 400) {
                this.$message.error('请求数据错误')
            }
            return Promise.reject(error)
        })
    }
})
