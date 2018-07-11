<template lang='pug'>
    div(v-if='ow_data.cabins.length > 0', v-loading='loading')
        .airfly(:class='{"actived": show}')
            .airfly__card(@click='showExtends', :class='{"useable": ow_data.cabins.length <= 0}')
                .airfly__card_name
                    .c-company
                        .flight-type
                            span.logo
                                img(:src='flight_data.logo')
                            span.title
                                |{{airline.get(flight_data.airline)}}
                        .c-company__detail
                            span {{flight_data.no}}
                            span 型号{{flight_data.plane}}
                            span.shared(v-if='flight_data.shared')
                                el-tooltip.item(effect='dark', :content="'实际乘坐: ' + airline.get(flight_data.operatingNo.substr(0, 2)) + flight_data.operatingNo", placement='bottom-start')
                                    span 共享
                .airfly__card_time
                    .sep-lf
                        h2 {{flight_data.departTime}}
                        p {{flight_data.departPort}}{{flight_data.departTerminal}}
                    .sep-ct
                        .range {{flight_data.flightTime}}
                        .line
                        p.nonstop(v-if='flight_data.nonstop') 非直达
                    .sep-rt
                        h2 {{flight_data.arriveTime}}
                        p {{flight_data.arrivePort}}{{flight_data.arriveTerminal}}
                .airfly__card_price
                    p.prc
                        span.rmb ￥
                        span.data {{minPrice}}
                    .vim
                        span.dis 此价格不包括詹姆士补贴
            el-collapse-transition
                .airfly__extends(v-show='show')
                    .airfly__extends_list
                        .c-triangle
                        .flight-info(v-if='stock === "A" || stock > 0')
                            .flight-info__list
                                ul
                                    li 准点率 {{flight_data.onTimeRate}}
                                    li(v-if='flight_data.meals==="B"') 餐食：早餐
                                    li(v-else-if='flight_data.meals==="D"') 餐食：正餐
                                    li(v-else-if='flight_data.meals==="M"') 餐食：轻正餐
                                    li(v-else-if='flight_data.meals==="S"') 餐食：点心餐
                                    li(v-else-if='flight_data.meals==="R"') 餐食：快餐
                                    li(v-else-if='flight_data.meals!==null') 有餐食{{flight_data.meals}}
                                    li(v-else) 无餐食
                                    li 以下价格不包括机建燃油费
                            .flight-info__order
                                .order__card
                                    .order__card_col(v-for='item in ow_data.cabins', v-if='item.stock > 0 || item.stock === "A"')
                                        .col-agent
                                            span(v-if='item.level==="Y"') 经济
                                            span(v-else-if='item.level==="F"') 头等
                                            span(v-else='item.level==="C"') 商务
                                            span {{item.cabin}}舱
                                        .col-center
                                            .col-center__tag
                                                .col-center__tag_tips
                                                    span(@click='remarkRule(item.cabin)') 退改签
                                                //- .col-center__tag_tips(v-if='flight_data.nonstop')
                                                //-     span(@click='transitMsg') 经停站信息
                                            .col-center__prc
                                                el-row
                                                    el-col(:span='6')
                                                        span.col-center__prc_logo ￥
                                                        span.col-center__prc_prc {{Math.ceil(item.salePrices[0].price)}}
                                                    //- el-col(:span='5')
                                                    //-     span.col-center__prc_ret 返现：￥{{item.minParPrice-item.salePrices[0].price | formatRet}}
                                                    el-col(:span='6')
                                                        span.col-center__prc_discount 折扣:{{item.salePrices[0].discount | formatDis}}
                                                    el-col(:span='6')
                                                        span.col-center__prc_stock 余票:{{item.stock === "A" ? "余票充足" : item.stock}}
                                        .col-book
                                            template(v-if='buyOrRscd === 0')
                                                el-button(type='success', @click='orderTicket(item)') 预定
                                            template(v-if='buyOrRscd === 1')
                                                el-button(type='success', @click='reschedule(item)') 改签
                        .flight-info__else(v-else)
                            p 没有余票
        el-dialog(title='退改签规则', :visible.sync='dialogRemarkRule', width='30%')
            p(v-loading='dialogRemarkLoading') {{remarkRuleMessage}}
            span(slot='footer')
                el-button(type='primary', size='small', @click='dialogRemarkRule = false') 确定
        el-dialog(title='经停站信息', :visible.sync='dialogTransit', width='30%')
            p(v-loading='dialogTransitLoading') {{transitMessage}}
            span(slot='footer')
                el-button(type='primary', size='small', @click='dialogTransit = false') 确定
</template>

<script>
export default {
    data () {
        return {
            loading: false,
            show: false,
            all_space: true,
            airline: '',
            stock: 0,
            dialogRemarkRule: false,
            dialogRemarkLoading: false,
            remarkRuleMessage: '',
            dialogTransit: false,
            dialogTransitLoading: false,
            transitMessage: ''
        }
    },
    props: {
        flight_data: Object,
        ow_data: Object,
        buyOrRscd: {
            type: Number,
            default: 0
        },
        rescheduleData: Array,
        rscdId: {
            type: Number,
            required: false
        }
    },
    computed: {
        minPrice () { // 展示最低价格
            let price = this.ow_data.cabins[0].salePrices[0].price
            for (let i of this.ow_data.cabins) {
                if (price > i.salePrices[0].price) {
                    price = i.salePrices[0].price
                }
            }
            return Math.ceil(price)
        }
    },
    filters: {
        formatDis (value) {
            return Math.round(value * 100) / 100
        },
        formatRet (value) {
            return Number.parseInt(value)
        }
    },
    methods: {
        showExtends () { // 如果筛选过后没有仓位，不显示该航班
            if (this.ow_data.cabins.length > 0) {
                this.show = !this.show
            }
        },
        remarkRule (cabin) { // 显示改签规则
            this.dialogRemarkRule = true
            this.dialogRemarkLoading = true
            this.$http.post('/orders/dps/policy', {
                departDate: this.flight_data.departDate,
                airlineCode: this.flight_data.airline,
                depart: this.flight_data.depart,
                arrive: this.flight_data.arrive,
                cabin: cabin
            }).then((res) => {
                let s = res.data.cancelTicketDes + '\r\n' + res.data.changeTicketDes + '\r\n' + res.data.refundTicketDes
                this.remarkRuleMessage = s
                this.dialogRemarkLoading = false
            }).catch((error) => {
                console.log(error)
            })
        },
        transitMsg () { // 显示经停站信息
            this.dialogTransit = true
            this.dialogTransitLoading = true
            this.$http.post('/orders/dps/stopinfo', {
                departDate: this.flight_data.departDate,
                flightNo: this.flight_data.shared ? this.flight_data.operatingNo : this.flight_data.no
            }).then(res => {
                console.log(res.data.flightLegBriefs)
                for (let i of res.data.flightLegBriefs) {
                    // this.transitMessage += i.departureAirport
                    this.transitMessage = this.airline.get(i.departureAirport)
                    console.log(this.airline)
                    console.log(this.airline.get(i.departureAirport))
                }
                this.dialogTransitLoading = false
            }).catch(error => {
                console.log(error)
            })
        },
        orderTicket (item) { // 订票
            let time = new Date(this.flight_data.departDate)
            let theprice = null
            if (item.level.toUpperCase() === 'Y') {
                theprice = this.flight_data.yprice
            } else if (item.level.toUpperCase() === 'F') {
                theprice = this.flight_data.fprice
            } else if (item.level.toUpperCase() === 'C') {
                theprice = this.flight_data.cprice
            }
            let cardObj = {
                departDate: time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate(),
                departCityName: this.flight_data.departPort.substr(0, 2),
                arriveCityName: this.flight_data.arrivePort.substr(0, 2),
                airline: this.airline.get(this.flight_data.airline),
                no: this.flight_data.no,
                cabin: item.cabin,
                level: item.level,
                departTime: this.flight_data.departTime,
                arriveTime: this.flight_data.arriveTime,
                departPort: this.flight_data.departPort + (this.flight_data.departTerminal ? this.flight_data.departTerminal : ''),
                arrivePort: this.flight_data.arrivePort + (this.flight_data.arriveTerminal ? this.flight_data.arriveTerminal : ''),
                flightTime: this.flight_data.flightTime,
                stock: item.stock,
                price: {
                    'policyId': item.salePrices[0].policyId, // 7;产品ID,在选中的航班中有该数据;
                    'ageType': '', // 8;年龄类型 成人ADT 儿童CHD 婴儿INF
                    'cabin': item.cabin, // 9;舱位
                    'fdPrice': item.fdPrice, // 10;展示价格
                    'sequence': 1,
                    'fuelFee': this.flight_data.fuelFee,
                    'taxFee': this.flight_data.taxFee,
                    // 'yprice': this.flight_data.yprice,
                    // 'cprice': this.flight_data.cprice,
                    // 'fprice': this.flight_data.fprice,
                    'theprice': theprice,
                    // 'minParPrice': item.minParPrice,
                    'minSalePrice': item.salePrices[0].price
                },
                policys: [{
                    'airDate': (this.flight_data.departDate).substr(0, 10) + ' ' + this.flight_data.departTime.substr(0, 5) + ':00',
                    'airDateStr': (this.flight_data.departDate).substr(0, 10) + ' ' + this.flight_data.departTime.substr(0, 5) + ':00',
                    'arrive': this.flight_data.arrive,
                    'cabin': item.cabin,
                    'depart': this.flight_data.depart,
                    'departDate': (this.flight_data.departDate).substr(0, 10) + ' ' + this.flight_data.departTime + ':00',
                    'departDateStr': (this.flight_data.departDate).substr(0, 10) + ' ' + this.flight_data.departTime + ':00',
                    'discount': item.salePrices[0].discount + '',
                    'fdPrice': item.fdPrice + '',
                    'flightNo': this.flight_data.no,
                    'fuelFare': this.flight_data.fuelFee + '',
                    'fuelFareStr': this.flight_data.fuelFee + '',
                    'operatingNo': this.flight_data.operatingNo,
                    'shared': this.flight_data.shared,
                    'taxFee': this.flight_data.taxFee + '',
                    'taxFeeStr': this.flight_data.taxFee + ''
                }]
            }
            let orderObj = {
                name: '',
                phone: '',
                user_id: '',
                flights: [
                    {
                        airline: this.flight_data.airline,
                        depart: this.flight_data.depart, // 3;起点三字码
                        arrive: this.flight_data.arrive, // 4;终点三字码
                        departTerminal: this.flight_data.departTerminal ? this.flight_data.departTerminal : '',
                        arriveTerminal: this.flight_data.arriveTerminal ? this.flight_data.arriveTerminal : '',
                        departTime: this.flight_data.departTime,
                        arriveTime: this.flight_data.arriveTime,
                        departDate: (this.flight_data.departDate).substr(0, 10) + ' ' + this.flight_data.departTime + ':00', // 5;起飞时间:'2018-02-09 00:00:00'
                        flightNo: this.flight_data.no, // 6;飞机航班号:'MU2862'
                        factFlightNo: this.flight_data.operatingNo,
                        flightTime: this.flight_data.flightTime,
                        serviceLevel: item.level,
                        cabin: item.cabin,
                        meals: this.flight_data.meals,
                        plane: this.flight_data.plane,
                        onTimeRate: this.flight_data.onTimeRate,
                        nonstop: this.flight_data.nonstop,
                        sequence: 1
                    }
                ],
                prices: [
                    {
                        policyId: item.salePrices[0].policyId, // 7;产品ID,在选中的航班中有该数据;
                        ageType: '', // 8;年龄类型 成人ADT 儿童CHD 婴儿INF
                        cabin: item.cabin, // 9;舱位
                        fdPrice: item.fdPrice, // 10;展示价格
                        sequence: 1,
                        fuelFee: this.flight_data.fuelFee,
                        taxFee: this.flight_data.taxFee,
                        buyPrice: item.salePrices[0].buyPrice,
                        parPrice: item.salePrices[0].parPrice,
                        salePrice: item.salePrices[0].price,
                        serviceLevel: item.level,
                        originPrice: theprice,
                        discount: item.salePrices[0].discount,
                        sign: item.salePrices[0].sign
                    }
                ],
                travelers: []
            }
            // console.log('orderdata:', orderObj)
            this.$router.push({path: '/flightOrder', query: {orderObj: encodeURIComponent(JSON.stringify(orderObj)), cardObj: encodeURIComponent(JSON.stringify(cardObj))}})
            // this.$router.push({path: '/flightOrder', query: {orderObj: JSON.stringify(orderObj), cardObj: JSON.stringify(cardObj)}})
        },
        reschedule (item) { // 改签
            let arr = []
            this.loading = true
            for (let i of this.rescheduleData) {
                let o = {}
                o.origContact = i.origContact
                o.newContact = i.newContact
                o.origFlight = i.origFlight
                o.newFlight = {
                    depart: this.flight_data.depart,
                    arrive: this.flight_data.arrive,
                    departDate: this.flight_data.departDate,
                    flightNo: this.flight_data.no,
                    sequence: 1,
                    arriveTerminal: this.flight_data.arriveTerminal,
                    departTerminal: this.flight_data.departTerminal,
                    arriveTime: this.flight_data.arriveTime,
                    departTime: this.flight_data.departTime,
                    cabin: item.cabin,
                    factFlightNo: this.flight_data.operatingNo,
                    meals: this.flight_data.meals,
                    serviceLevel: item.level,
                    plane: this.flight_data.plane,
                    onTimeRate: this.flight_data.onTimeRate,
                    flightTime: this.flight_data.flightTime,
                    airline: this.flight_data.airline,
                    nonstop: this.flight_data.nonstop
                }
                arr.push(o)
            }
            this.$http.post('/orders/dps/change/' + this.rscdId, {
                items: arr
            }).then(res => {
                this.loading = false
                if (res.status >= 200 && res.status < 300) {
                    this.$message.success('改签成功')
                    this.$router.replace('/order')
                } else {
                    this.$message.error(res.data.message)
                }
            }).catch(error => {
                this.$message.error('改签失败')
                this.loading = false
                console.log(error)
            })
        }
    },
    created () {
        let airline = new Map([['3U', '四川航空'], ['8L', '祥鹏航空'], ['9C', '春秋航空'], ['9H', '长安航空'], ['A6', '红土航空'], ['BK', '奥凯航空'], ['CA', '中国航空'], ['CN', '大新华航'], ['CZ', '南方航空'], ['DR', '瑞丽航空'], ['DZ', '东海航空'], ['EU', '成都航空'], ['FM', '上海航空'], ['FU', '福州航空'], ['G5', '华夏航空'], ['GJ', '长龙航空'], ['GS', '天津航空'], ['GT', '桂林航空'], ['GX', '北部弯航空'], ['GY', '多彩贵州航空'], ['HO', '吉祥航空'], ['HU', '海南航空'], ['JD', '首都航空'], ['JR', '幸福航空'], ['KN', '中联航空'], ['KY', '昆明航空'], ['LT', '龙江航空'], ['MF', '厦门航空'], ['MU', '东方航空'], ['NS', '河北航空'], ['OQ', '重庆航空'], ['PN', '西部航空'], ['QW', '青岛航空'], ['RY', '江西航空'], ['SC', '山东航空'], ['TV', '西藏航空'], ['UQ', '乌鲁木齐航空'], ['Y8', '扬子江快运航空'], ['YI', '英安航空'], ['ZH', '深圳航空']])
        this.airline = airline
        for (let item in this.ow_data.cabins) {
            if (this.ow_data.cabins[item].stock === 'A') {
                this.stock = 'A'
                break
            }
            if (this.ow_data.cabins[item].stock > 0) {
                this.stock += parseInt(this.ow_data.cabins[item].stock)
            }
        }
    },
    beforeDestory () {
        console.log('im going to end')
    }
}
</script>

<style scoped>
    .airfly {
        border-bottom: 1px solid rgb(207, 207, 207);
        background-color: #fff;
    }
    .airfly.actived {
        margin: 10px 0;
        position: relative;
        box-shadow: 0 0 15px rgba(0,0,0,.2);
    }
    .airfly__card.useable {
        cursor: not-allowed;
        background-color: #C0C4CC;
    }
    .airfly:hover {
        position: relative;
        box-shadow: 0 0 15px rgba(0,0,0,.2);
    }
    .airfly__card {
        box-sizing: border-box;
        background-color: #fbfbfb;
        height: 100px;
        width: 1000px;
        padding: 25px 30px 15px 15px;
        /* margin-bottom: 10px; */
        display: flex;
        /* justify-content: space-between; */
        cursor: pointer;
    }
    .airfly__card:focus {
        outline: -webkit-focus-ring-color auto 5px;
    }
    /* .c-company----------------------------------- */
    .c-company > .flight-type > span {
        display: inline-block;
    }
    .c-company > .flight-type > .logo {
        width: 34px;
    }
    .c-company > .flight-type > .title {
        font-size: 16px;
        height: 24px;
        margin-bottom: 3px;
    }
    .c-company > .c-company__detail {
        padding: 0 0 3px 34px;
        color: #888;
    }
    .c-company > .c-company__detail > span {
        padding-right: 4px;
        display: inline-block;
    }
    .c-company__detail > span.shared {
        color: #46d2a9
    }
    .airfly__card_name {
        width: 300px;
    }
    /* .airfly__card_time----------------------------------- */
    .airfly__card_time {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        width: 500px;
    }
    .airfly__card_time > .sep-lf, .airfly__card_time > .sep-rt {
        width: 190px;
        text-align: center;
    }
    .airfly__card_time > .sep-lf > h2, .airfly__card_time > .sep-rt > h2 {
        font-size: 25px;
    }
    .airfly__card_time > .sep-ct {
        color: #888;
        width: 120px;
        text-align: center;
        margin: 0 23px;
    }
    .airfly__card_time > .sep-ct > .range {
        height: 20px;
    }
    .airfly__card_time > .sep-ct > .line {
        border-bottom: 1px solid #dfdfdf;
    }
    .airfly__card_time > .sep-ct > .line::after {
        content: '';
        border-bottom: 1px solid #dfdfdf;
        width: 8px;
        float: right;
        margin-top: -2px;
        transform: rotate(30deg);
    }
    .airfly__card_time > .sep-ct > .nonstop {
        margin-top: 5px;
        color: red;
    }
    /* .airfly__card_price----------------------------------- */
    .airfly__card_price {
        color: #ff8205;
        vertical-align: middle;
        margin-top: -10px;
        width: 200px;
        text-align: right;
    }
    .airfly__card_price > .prc {
        font-size: 30px;
    }
    .airfly__card_price > .prc > .rmb {
        font-size: 16px;
        font-family: Arial;
    }
    .airfly__card_price > .vim > .dis {
        color: #888;
        float: right;
        font-size: 15px;
    }
    /* .airfly__extends-------------------------------------- */
    .airfly__extends_list {
        border-top: 1px solid #cfcfcf;
    }
    .c-triangle {
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #cfcfcf;
        float: right;
        margin: -10px 33px 0 0;
    }
    .c-triangle > p {
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #f6f6f6;
        /* border-bottom: 10px solid #fdfdfd; */
        margin: 1px 0 0 -10px;
    }
    .flight-type {
        padding: 5px 0;
        /* background: #fdfdfd; */
    }
    .flight-type > ul.tab {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
    }
    .flight-type > ul.tab > li {
        display: inline;
        margin: 0 20px;
        cursor: pointer;
        padding: 2px;
    }
    .flight-type > ul.tab > li.cur {
        color: #40bad6;
        border-bottom: 2px solid #40bad6;
        cursor: default;
    }
    .flight-info__list {
        height: 36px;
        padding: 0 30px;
        line-height: 36px;
        border-bottom: 1px solid #e1e1e1;
        background: #f6f6f6;
        clear: both;
    }
    .flight-info__list > ul {
        float: right;
        width: 48%;
        color: #555;
        text-align: right;
    }
    .flight-info__list > ul > li {
        display: inline;
        padding-left: 18px;
    }
    .flight-info__else {
        height: 50px;
        background: #f6f6f6;
    }
    .flight-info__else > p {
        font-size: 20px;
        text-align: center;
        padding-top: 10px;
    }
    .flight-info__order {
        background: #fdfdfd;
    }
    .flight-info__order > .order__card {
        padding: 0 30px;
        cursor: pointer;
    }
    .flight-info__order > .order__card > .order__card_col {
        border-bottom: 1px solid #ebebeb;
        padding: 11px 0;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
    }
    .col-agent {
        min-height: 1px;
        width: 150px;
        color: #555;
        font-size: 16px;
    }
    .col-center {
        width: 650px;
        display: flex;
        justify-content: space-between
    }
    .col-center > span {
        font-size: 16px;
    }
    .col-center__tag {
        width: 250px;
    }
    .col-center > .col-center__tag > .col-center__tag_tips {
        display: inline-block;
        vertical-align: middle;
        color: #40bad6;
        margin-right: 10px;
    }
    .col-center > .col-center__prc {
        color: #bd1900;
        width: 400px;
        font-size: 24px;
    }
    .col-center__prc_logo {
        font-size: 16px;
    }
    .col-center__prc_stock, .col-center__prc_discount, .col-center__prc_ret {
        color: black;
        font-size: 14px;
    }
    .col-book > button {
        padding: 6px 20px;
    }
</style>
