<template lang='pug'>
    div
        el-card.search(:class="{'search-hide': searchHide}")
            el-form(:model='flight')
                el-row(:gutter='10', type='flex', justify='center', style='width: 1000px; margin: auto')
                    el-col(:span='6')
                        el-form-item
                            flightCityCard(placeholder='输入城市/机场', v-model='flight.depart', @citySelect='departSelect')
                    el-col(:span='1')
                        el-form-item(style='text-align: center')
                            span.exchange(@click='cityExchange') 换
                    el-col(:span='6')
                        el-form-item
                            flightCityCard(placeholder='输入城市/机场', v-model='flight.arrive', @citySelect='arriveSelect')
                    el-col(:span='6')
                        el-form-item
                            el-date-picker(type='date', v-model='flight.setTime', placeholder='出发日期', value-format="yyyy-MM-dd")
                    el-col(:span='2')
                        el-form-item
                            el-button(type='success', @click='flightSearch', size='medium') 重新搜索
        el-card.screening(:class="{'screening-fix': screeningFix}")
            el-form(ref='flight_opt', :model='flight_opt')
                el-row(:gutter='10')
                    el-col(:span='8')
                        el-select(v-model='flight_scn.setTime', filterable, multiple, placeholder='起飞时段', size='small', @change='screening')
                            el-option(v-for='item in flight_opt.setTime', :value='item.value', :key='item.value', :label='item.label')
                    el-col(:span='8')
                        el-select(v-model='flight_scn.airline', filterable, multiple, placeholder='航空公司', size='small', @change='screening')
                            el-option(v-for='item in flight_opt.airline', :value='item', :key='item', :label='airline.get(item)')
                    //- el-col(:span='4')
                    //-     el-select(v-model='flight_scn.depart', filterable, multiple, placeholder='起飞机场', size='small')
                    //-         el-option(v-for='item in flight_opt.depart', :value='item.value', :key='item.value') {{item.label}}
                    //- el-col(:span='4')
                    //-     el-select(v-model='flight_scn.arrive', filterable, multiple, placeholder='降落机场', size='small')
                    //-         el-option(v-for='item in flight_opt.arrive', :value='item.value', :key='item.value') {{item.label}}
                    el-col(:span='8')
                        el-select(v-model='flight_scn.position', filterable, multiple, placeholder='仓位', size='small', @change='screening')
                            el-option(v-for='item in flight_opt.position', :value='item.value', :key='item.value', :label='item.label')
        .loading-block(v-if='loading', v-loading='loading', element-loading-text='若加载时间过长，请重新搜索')
        .main-data(v-else)
            div.flight_table(v-if='flight_data_show.length > 0')
                template(v-for='(item, index) in flight_data_show')
                    flight-card(:flight_data='item', :ow_data='ow_data_show[item.no]')
            div(v-else-if='flight_data === null || ow_data === null', style='height: 300px; background-color: white; padding-top: 100px;')
                p(style='text-align: center; margin: 0 auto; font-family: "youyuan"; font-size: 28px; color: red;') 系统繁忙，请稍后重试
            div(v-else-if='flight_data.length > 0 && flight_data_show.length === 0', style='height: 300px; background-color: white; padding-top: 100px;')
                p(style='text-align: center; margin: 0 auto; font-family: "youyuan"; font-size: 28px; color: red;') 没有符合条件的航班
            //- div(v-else, v-loading='loading', style='min-height: 300px', element-loading-text='若加载时间过长，请重新搜索')
</template>

<script>
import flightCard from './FlightCard.vue'
import flightCityCard from '@/components/FlightCityCard.vue'
export default {
    components: {flightCard, flightCityCard},
    data () {
        return {
            loading: false,
            searchHide: false,
            screeningFix: false,
            flight_opt: {
                airline: [],
                setTime: [
                    {
                        value: '00:00-10:00',
                        label: '00:00-10:00'
                    },
                    {
                        value: '10:00-14:00',
                        label: '10:00-14:00'
                    },
                    {
                        value: '14:00-19:00',
                        label: '14:00-19:00'
                    },
                    {
                        value: '19:00-24:00',
                        label: '19:00-24:00'
                    }
                ],
                position: [
                    {
                        value: 'Y',
                        label: '经济舱'
                    },
                    {
                        value: 'C',
                        label: '商务舱'
                    },
                    {
                        value: 'F',
                        label: '头等舱'
                    }
                ],
                depart: [
                    {
                        value: '北京南苑机场',
                        label: '北京南苑机场'
                    },
                    {
                        value: '北京首都机场',
                        label: '北京首都机场'
                    }
                ],
                arrive: [
                    {
                        value: '上海虹桥机场',
                        label: '上海虹桥机场'
                    },
                    {
                        value: '上海浦东机场',
                        label: '上海浦东机场'
                    }
                ]
            },
            flight_scn: {
                airline: [],
                setTime: [],
                position: [],
                depart: [],
                arrive: []
            },
            airline: new Map([['3U', '四川航空'], ['8L', '祥鹏航空'], ['9C', '春秋航空'], ['9H', '长安航空'], ['A6', '红土航空'], ['BK', '奥凯航空'], ['CA', '中国航空'], ['CN', '大新华航'], ['CZ', '南方航空'], ['DR', '瑞丽航空'], ['DZ', '东海航空'], ['EU', '成都航空'], ['FM', '上海航空'], ['FU', '福州航空'], ['G5', '华夏航空'], ['GJ', '长龙航空'], ['GS', '天津航空'], ['GT', '桂林航空'], ['GX', '北部弯航空'], ['GY', '多彩贵州航空'], ['HO', '吉祥航空'], ['HU', '海南航空'], ['JD', '首都航空'], ['JR', '幸福航空'], ['KN', '中联航空'], ['KY', '昆明航空'], ['LT', '龙江航空'], ['MF', '厦门航空'], ['MU', '东方航空'], ['NS', '河北航空'], ['OQ', '重庆航空'], ['PN', '西部航空'], ['QW', '青岛航空'], ['RY', '江西航空'], ['SC', '山东航空'], ['TV', '西藏航空'], ['UQ', '乌鲁木齐航空'], ['Y8', '扬子江快运航空'], ['YI', '英安航空'], ['ZH', '深圳航空']]),
            flight_data: [],
            flight_data_show: [],
            ow_data: {},
            ow_data_show: {},
            flightMap: []
        }
    },
    computed: {
        flight () {
            return this.$store.state.flight
        },
        setTime () {
            let time = new Date(this.flight.setTime)
            return time.getFullYear() + '-' + (String(time.getMonth() + 1).length === 1 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + (String(time.getDate()).length === 1 ? ('0' + time.getDate()) : (time.getDate()))
        }
    },
    methods: {
        getFlightData () {
            if (this.flight.depart === '' || this.flight.arrive === '') {
                this.$message('城市选项不能为空')
            } else if (this.flight.setTime === '') {
                this.$message('请输入出发时间')
            } else if (this.flight.depart === this.flight.arrive) {
                this.$message('到达城市不能与出发城市相同')
            } else {
                this.clear()
                this.loading = true
                this.$http.get('/web/jp/searchPlaneTicket', {
                    params: {
                        depart: this.flight.theDepart.cityCode,
                        arrive: this.flight.theArrive.cityCode,
                        date: this.setTime
                    }
                }).then((res) => {
                    this.loading = false
                    if (res.data === null || typeof res.data === 'string' || res.data.ow_data === null) {
                        this.flight_data = null
                        this.ow_data = null
                        this.$message('系统繁忙，请稍后重试')
                        return
                    }
                    this.flightMap = Reflect.ownKeys(res.data.ow_data)
                    this.ow_data = res.data.ow_data
                    for (let i of this.flightMap) {
                        this.flight_data.push(res.data.flights[i])
                    }
                    for (let i = 0; i < this.flight_data.length; i++) {
                        if (this.flight_data[i].depart === 'NAY') {
                            this.flight_data[i].departPort = '北京南苑机场'
                        } else if (this.flight_data[i].depart === 'SHA') {
                            this.flight_data[i].departPort = '上海虹桥机场'
                        } else {
                            this.flight_data[i].departPort = this.flight.theDepart.airportNameCN
                        }

                        if (this.flight_data[i].arrive === 'NAY') {
                            this.flight_data[i].arrivePort = '北京南苑机场'
                        } else if (this.flight_data[i].arrive === 'SHA') {
                            this.flight_data[i].arrivePort = '上海虹桥机场'
                        } else {
                            this.flight_data[i].arrivePort = this.flight.theArrive.airportNameCN
                        }
                    }
                    for (let i in this.flight_data) {
                        if (this.flight_opt.airline.indexOf(this.flight_data[i].airline) === -1) {
                            this.flight_opt.airline.push(this.flight_data[i].airline)
                        }
                    }
                    this.flight_data_show = this.flight_data.slice(0)
                    this.ow_data_show = JSON.parse(JSON.stringify(this.ow_data))
                    // console.log('flights:', Reflect.ownKeys(res.data.flights))
                    // console.log('ow_data:', Reflect.ownKeys(res.data.ow_data))
                }).catch((error) => {
                    this.loading = false
                    console.log(error)
                })
            }
        },
        departSelect (item) { // 选择出发城市
            this.$store.commit('departChange', item)
        },
        arriveSelect (item) { // 选择到达城市
            this.$store.commit('arriveChange', item)
        },
        cityExchange () { // 城市交换
            let depart = this.flight.theDepart
            let arrive = this.flight.theArrive
            this.$store.commit('departChange', arrive)
            this.$store.commit('arriveChange', depart)
        },
        clear () { // 清楚搜索信息
            this.flight_data = []
            this.flight_data_show = []
            this.ow_data = {}
            this.ow_data_show = {}
            this.flight_opt.airline = []
            this.flight_scn.airline = []
            this.flight_scn.setTime = []
            this.flight_scn.position = []
        },
        screening () { // 筛选
            this.flight_data_show = []
            let arr = this.flight_data
            for (let i in arr) {
                if (this.scnAirline(arr[i].airline) && this.scnTime(arr[i].departTime)) {
                    this.flight_data_show.push(arr[i])
                }
            }
            this.ow_data_show = JSON.parse(JSON.stringify(this.ow_data))
            for (let i of this.flightMap) {
                for (let j = 0; j < this.ow_data_show[i].cabins.length;) {
                    if (!this.scnPosition(this.ow_data_show[i].cabins[j].level)) {
                        // console.log(this.ow_data_show[i].cabins[j].level)
                        this.ow_data_show[i].cabins.splice(j, 1)
                    } else {
                        j++
                    }
                }
            }
        },
        scnAirline (airline) { // 航班筛选判断
            if (this.flight_scn.airline.length === 0 || this.flight_scn.airline.indexOf(airline) !== -1) {
                return true
            } else {
                return false
            }
        },
        scnTime (time) { // 时间筛选判断
            if (this.flight_scn.setTime.length === 0) {
                return true
            } else {
                let setTime = this.flight_scn.setTime
                for (let i in setTime) {
                    switch (setTime[i]) {
                    case '00:00-10:00':
                        if (time.substring(0, 2) < 10) {
                            return true
                        }
                        break
                    case '10:00-14:00':
                        if (time.substring(0, 2) >= 10 && time.substring(0, 2) < 14) {
                            return true
                        }
                        break
                    case '14:00-19:00':
                        if (time.substring(0, 2) >= 14 && time.substring(0, 2) < 19) {
                            return true
                        }
                        break
                    case '19:00-24:00':
                        if (time.substring(0, 2) >= 19 && time.substring(0, 2) < 24) {
                            return true
                        }
                        break
                    default: return false
                    }
                }
            }
        },
        scnPosition (pos) { // 舱位筛选判断
            if (this.flight_scn.position.length === 0 || this.flight_scn.position.indexOf(pos) !== -1) {
                return true
            } else {
                return false
            }
        },
        flightSearch () {
            this.getFlightData()
        }
    },
    created () {
        if (this.$store.state.flight.setTime === '') {
            this.$store.commit('setTime', new Date())
        }
        this.getFlightData()
    },
    mounted () {
        // console.log(this.$el.querySelector('.screening').getBoundingClientRect().top)
        let _this = this
        function scroll () {
            return {
                left: window.pageXOffset,
                top: window.pageYOffset
            }
        }
        window.onscroll = (function () {
            let sTop = scroll().top
            return function () {
                if (sTop > scroll().top) {
                    // console.log('向上滚动')
                    _this.searchHide = false
                    sTop = scroll().top
                    // --------------fix the screening bar
                    _this.screeningFix = false
                } else if (sTop < scroll().top) {
                    // console.log('向下滚动')
                    _this.searchHide = true
                    sTop = scroll().top
                    // --------------unfix the screening bar
                    if (_this.$el.querySelector('.screening').getBoundingClientRect().top <= 60) {
                        _this.screeningFix = true
                    }
                }
            }
        })()
    },
    beforeDestroy () {
        window.onscroll = null
    }
}
</script>

<style scoped>
    .search {
        min-width: 1000px;
        margin: 0 auto 10px;
        overflow: visible;
        text-align: center;
        position: fixed;
        left: 200px;
        right: 0px;
        border-radius: 0;
        box-sizing: border-box;
        top: 60px;
        z-index: 1000;
        height: 100px;
        transition: transform 300ms;
    }
    .search-hide {
        transition: transform 300ms;
        transform: translate(0px, -100px)
    }
    .screening {
        width: 1000px;
        margin: 0 auto;
        border-radius: 0;
        margin-top: 100px;
    }
    .screening-fix {
        /* position: fixed;
        top: 60px;
        margin: 0; */
    }
    .main-data {
        width: 1000px;
        margin: 0 auto;
        /* background: red; */
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
    .loading-block {
        height: 200px;
        width: 1000px;
        margin: 0 auto;
    }
</style>
