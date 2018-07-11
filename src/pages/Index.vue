<template lang='pug'>
    div
        el-row(:gutter="10")
            el-col(:span='12')
                el-card.box-card
                    .clearfix(slot='header')
                        span 机票预定
                    el-form(:model='flight', label-position='left', label-width='80px')
                        el-form-item(label='行程')
                            //- el-row
                            el-col(:span='10')
                                flightCityCard(placeholder='输入城市/机场', v-model='flight.depart', @citySelect='departSelect')
                            el-col(:span='4', style='text-align: center')
                                span.exchange(@click='cityExchange') 换
                            el-col(:span='10')
                                flightCityCard(placeholder='输入城市/机场', v-model='flight.arrive', @citySelect='arriveSelect')
                        el-form-item(label='出发日期')
                            el-form-item
                                el-col(:span='8')
                                    el-date-picker(type='date', v-model='flight.setTime', placeholder='yyyy-mm-dd', style='width: 100%', value-format="yyyy-MM-dd")
                        el-form-item
                            el-button(type='success', style='width: 100px', @click='flightSearch') 搜索
            el-col(:span='12')
                el-card.box-card
                    .clearfix(slot='header')
                        span 酒店预订
                    el-form(:model='hotel', label-position='left', label-width='80px')
                        el-form-item(label='目的地')
                            el-form-item
                                hotelCityCard(v-model='hotel.destination', @citySelect='citySelect', @scenicSelect='scenicSelect', cityWidth='200', scenicWidth='300')
                        el-form-item(label='日期选择')
                            el-col
                                el-date-picker(v-model='hotel.rangeTime', type='daterange', range-separator='至', start-placeholder='入住日期', end-placeholder='离店日期', value-format="yyyy-MM-dd")
                        el-form-item
                            el-button(type='primary', style='width: 100px', @click='hotelSearch') 搜索
        hr
        el-row(:gutter="10")
            el-col(:span='12')
                el-card.box-card
                    .clearfix(slot='header')
                        span 机票订单列表
                        .card-extra
                            el-button(type='danger', size='small', @click='getAllOrder') 所有订单
                    el-table(:data='flightOrder', size='small')
                        el-table-column(prop='order_no', label='订单号')
                        el-table-column(prop='owner.nickname', label='机主昵称')
                        el-table-column(prop='owner.phone', label='机主号码')
                        el-table-column(prop='date_created', label='创建日期', :formatter='flightOrderDateForm')
                        el-table-column(prop='total', label='订单金额')
                        el-table-column(prop='status', label='状态')
                        el-table-column(label='查看详情')
                            template(slot-scope='scope')
                                el-button(type='text', size='small', @click='orderDetail(scope.row.id)') 详情
            el-col(:span='12')
                el-card.box-card
                    .clearfix(slot='header')
                        span 酒店订单列表
                        .card-extra
                            el-button(type='danger', size='small', @click='getAllOrder') 所有订单
                    el-table(:data='hotelOrder', size='small')
                        el-table-column(prop='order_no', label='订单号')
                        el-table-column(prop='owner.nickname', label='机主昵称')
                        el-table-column(prop='owner.phone', label='机主号码')
                        el-table-column(prop='date_created', label='创建日期', :formatter='hotelOrderDateForm')
                        el-table-column(prop='total', label='订单金额')
                        el-table-column(prop='status', label='状态')
                        el-table-column(label='查看详情')
                            template(slot-scope='scope')
                                el-button(type='text', size='small', @click='orderDetail(scope.row.id)') 详情
</template>

<script>
import flightCityCard from '@/components/FlightCityCard.vue'
import hotelCityCard from '@/components/HotelCityCard.vue'
export default {
    components: {flightCityCard, hotelCityCard},
    data () {
        return {
            hotel: {},
            hotelOrder: [],
            flightOrder: []
        }
    },
    computed: {
        startTime () {
            let time = new Date(this.hotel.rangeTime[0])
            return time.getFullYear() + '-' + (String(time.getMonth() + 1).length === 1 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + (String(time.getDate()).length === 1 ? ('0' + time.getDate()) : (time.getDate()))
        },
        endTime () {
            let time = new Date(this.hotel.rangeTime[1])
            return time.getFullYear() + '-' + (String(time.getMonth() + 1).length === 1 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + (String(time.getDate()).length === 1 ? ('0' + time.getDate()) : (time.getDate()))
        },
        flight () {
            return this.$store.state.flight
        }
    },
    methods: {
        flightOrderDateForm (row, column) { // 尾缀带Form的都是element表格进行数据格式化的
            return row.date_created.substr(0, 10)
        },
        hotelOrderDateForm (row, column) {
            return row.date_created.substr(0, 10)
        },
        flightSearch () { // 搜索航班
            if (this.flight.depart === '' || this.flight.arrive === '') {
                this.$message('查询条件为空')
            } else if (this.flight.depart === this.flight.arrive) {
                this.$message('到达城市不能与出发城市相同')
            } else {
                this.$router.push({path: '/flight'})
            }
        },
        departSelect (item) { // 选择起飞地点
            this.$store.commit('departChange', item)
        },
        arriveSelect (item) { // 选择到达地点
            this.$store.commit('arriveChange', item)
        },
        cityExchange () { // 交换起落点
            let depart = this.flight.theDepart
            let arrive = this.flight.theArrive
            this.$store.commit('departChange', arrive)
            this.$store.commit('arriveChange', depart)
        },
        citySelect (item) { // 选择酒店城市
            this.hotel.scenic = ''
        },
        scenicSelect (item, scenicClass) { // scenic选择
            this.hotel.scenic = item
            this.hotel.scenicClass = scenicClass
        },
        hotelSearch () { // 酒店查询
            if (this.hotel.destination === '') {
                this.$message('查询城市为空')
            } else {
                this.$store.commit('saveHotel', this.hotel)
                this.$router.push({path: '/hotel'})
            }
        },
        orderDetail (id) { // 订单详情
            this.$router.push({path: '/order', query: {order_id: id}})
        },
        getAllOrder () { // 所有订单
            this.$router.push('/order')
        }
    },
    created () {
        this.hotel = this.$store.state.hotel
        let now = new Date()
        this.hotel.rangeTime[0] = new Date()
        this.hotel.rangeTime[1] = new Date(now.setDate(now.getDate() + 1))
        if (this.$store.state.flight.setTime === '') {
            this.$store.commit('setTime', new Date())
        }
        this.$http.get('/orders?type=air', {
            params: {
                page: 1
            }
        }).then((res) => {
            this.flightOrder = res.data.results
        }).catch((error) => {
            console.log(error)
        })
        this.$http.get('/orders?type=hotel', {
            params: {
                page: 1
            }
        }).then((res) => {
            this.hotelOrder = res.data.results
        }).catch((error) => {
            console.log(error)
        })
    },
    mounted () {
    }
}
</script>

<style scoped>
    hr {
        margin: 10px 0;
    }
    .card-extra {
        float: right;
        margin-top: -5px;
    }
    .box-card {
        overflow: visible;
    }
    .exchange {
        padding: 6px;
        font-family: "YouYuan";
        color: #352b2b;
        background-color: #f5eded;
        border: 1px solid #dcdfe6;
        border-radius: 50%;
        cursor: pointer;
        user-select: none;
    }
    .exchange:focus {
        outline: none;
    }
    .exchange:hover {
        color: #409eff;
        background-color: #fff;
    }
</style>
