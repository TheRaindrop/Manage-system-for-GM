<template lang='pug'>
    div
        el-card
            .clearfix(slot='header')
                span 订单列表
                .search-bar(style='float: right')
                    el-radio-group(size='small', style='margin-right: 50px', v-model='orderType')
                        el-radio-button(label='0') 所有订单
                        el-radio-button(label='1') 机票订单
                        el-radio-button(label='2') 酒店订单
                        el-radio-button(label='3') 贵宾厅订单
                        el-radio-button(label='4') 詹姆士商城订单
                    el-input(v-model='searchData', style='width: 200px; margin-right: 10px;', size='small', placeholder='输入手机号码查找用户订单', @keyup.enter.native='searchOrder')
                    el-button(type='success', size='small', @click='searchOrder') 搜索订单
            el-table(:data='orderData', style='width: 100%', :default-sort='{prop: "date_created", order: "descending"}', v-loading='loading')
                el-table-column(type='expand')
                    template(slot-scope='props')
                        div(v-if='props.row.air_orders.length > 0')
                            div.flight-expand
                                .flight-expand__creater
                                    p(v-if='props.row.created_by === props.row.owner.id') 订单创建人：手机创建
                                    p(v-else) 订单创建人：客服{{props.row.created_by}}
                                el-table.flight-expand__table(:data='props.row.air_orders', size='small')
                                    el-table-column(prop='contact_name', label='联系人姓名')
                                    el-table-column(prop='contact_phone', label='联系电话')
                                    el-table-column(label='乘机人', width='400')
                                        template(slot-scope='scope')
                                            el-table(:data='scope.row.contacts', size='mini')
                                                el-table-column(prop='name', label='乘客姓名')
                                                el-table-column(prop='birthday', label='出生日期', :formatter='birthdayForm')
                                                el-table-column(prop='card_type', label='证件类型', :formatter='cardTypeForm')
                                                el-table-column(prop='card_number', label='证件号码')
                                    el-table-column(label='航班信息', width='600')
                                        template(slot-scope='scope')
                                            el-table(:data='scope.row.flights', size='mini')
                                                el-table-column(label='起飞机场', :formatter='departForm')
                                                el-table-column(label='降落机场', :formatter='arriveForm')
                                                el-table-column(prop='departDate', label='起飞日期', :formatter='departDateForm')
                                                el-table-column(prop='flightNo', label='航班号')
                                                el-table-column(label='仓位', :formatter='cabinForm')
                                                el-table-column(prop='departTime', label='起飞时间')
                                                el-table-column(prop='arriveTime', label='降落时间')
                                                el-table-column(prop='flightTime', label='飞行时间')
                                                el-table-column(label='航空公司', :formatter='airlineForm')
                                                el-table-column(prop='plane', label='机型')
                            .flight-reschedule(v-if='props.row.air_orders[0].reschedules.length > 0')
                                .flight-expand__creater
                                    | 改签航班信息
                                el-table.flight-expand__table(:data='props.row.air_orders', size='small')
                                    el-table-column(prop='contact_name', label='联系人姓名')
                                    el-table-column(prop='contact_phone', label='联系电话')
                                    el-table-column(label='乘机人', width='400')
                                        template(slot-scope='scope')
                                            el-table(:data='scope.row.contacts', size='mini')
                                                el-table-column(prop='name', label='乘客姓名')
                                                el-table-column(prop='birthday', label='出生日期', :formatter='birthdayForm')
                                                el-table-column(prop='card_type', label='证件类型', :formatter='cardTypeForm')
                                                el-table-column(prop='card_number', label='证件号码')
                                    el-table-column(label='航班信息', width='600')
                                        template(slot-scope='scope')
                                            el-table(:data='scope.row.reschedules[0].items', size='mini')
                                                el-table-column(label='起飞机场', :formatter='newFlightDepartForm')
                                                el-table-column(label='降落机场', :formatter='newFlightArriveForm')
                                                el-table-column(label='起飞日期', :formatter='newFlightdepartDateForm')
                                                el-table-column(prop='newFlight.flightNo', label='航班号')
                                                el-table-column(label='仓位', :formatter='newFlightCabinForm')
                                                el-table-column(prop='newFlight.departTime', label='起飞时间')
                                                el-table-column(prop='newFlight.arriveTime', label='降落时间')
                                                el-table-column(prop='newFlight.flightTime', label='飞行时间')
                                                el-table-column(label='航空公司', :format='newFlightAirlineForm')
                                                el-table-column(prop='newFlight.plane', label='机型')
                        div.hotel-expand(v-if='props.row.hotel_orders.length > 0')
                            .hotel-expand__creater
                                p(v-if='props.row.created_by === props.row.owner.id') 订单创建人：手机创建
                                p(v-else) 订单创建人：客服{{props.row.created_by}}
                            el-table.flight-expand__table(:data='props.row.hotel_orders', size='small')
                                el-table-column(prop='hotelName', label='酒店名')
                                el-table-column(prop='hotelAddress', label='地址')
                                el-table-column(prop='hotelPhone', label='酒店电话')
                                el-table-column(prop='proName', label='房间类型')
                                el-table-column(prop='linkManName', label='联系人')
                                el-table-column(prop='linkManMobile', label='联系人电话')
                                el-table-column(prop='orderPassengerDetails', label='入住人', :formatter='passengerForm')
                                el-table-column(label='入住日期', width='200')
                                    template(slot-scope='scope')
                                        el-table(:data='scope.row.orderUseDateDetails', size='mini')
                                            el-table-column(label='当日价格', prop='checkPrice')
                                            el-table-column(label='日期', prop='useDate')
                                //- el-table-column(prop='arrivalDate', label='入住日期', :formatter='arrivalDateForm')
                                //- el-table-column(prop='departureDate', label='离店日期', :formatter='departureDateForm')
                        div(v-if='props.row.voucher_orders.length > 0')
                            el-form(label-position='left', inline)
                                el-row
                                    el-col(:span='6')
                                        el-form-item(label='订单类型：')
                                            span(v-if='props.row.voucher_orders[0].type === "201000111"') 贵宾厅订单
                                            span(v-else-if='props.row.voucher_orders[0].type === "201000105"') 休息室订单
                                            span(v-else-if='props.row.voucher_orders[0].type === "2010001"') 特殊通道订单
                                    el-col(:span='6')
                                        el-form-item(label='是否使用：')
                                            span(v-if='props.row.voucher_orders[0].used === false') 否
                                            span(v-else-if='props.row.voucher_orders[0].used === true') 是
                                    el-col(:span='6')
                                        el-form-item(label='二维码字符串：')
                                            span {{props.row.voucher_orders[0].code}}
                el-table-column(label='机主昵称', prop='owner.nickname')
                el-table-column(label='机主号码', prop='owner.phone')
                //- el-table-column(label='创建人', prop='created_by')
                el-table-column(label='订单类型')
                    template(slot-scope='scope')
                        span(v-if='scope.row.air_orders.length > 0')
                            img.order-logo(src='@/assets/flight.svg')
                            span 机票订单
                        span(v-else-if='scope.row.hotel_orders.length > 0')
                            img.order-logo(src='@/assets/hotel.svg')
                            span 酒店订单
                        span(v-else-if='scope.row.voucher_orders.length > 0')
                            img.order-logo(src='@/assets/iconfont-vip.svg')
                            //- | &nbsp;VIP订单
                            span(v-if='scope.row.voucher_orders[0].type === "201000111"') 贵宾厅订单
                            span(v-else-if='scope.row.voucher_orders[0].type === "201000105"') 休息室订单
                            span(v-else-if='scope.row.voucher_orders[0].type === "2010001"') 特殊通道订单
                        span(v-else-if='scope.row.mall_orders.length > 0')
                            img.order-logo(src='@/assets/mall.svg')
                            span 商城订单
                el-table-column(label='订单ID', prop='order_no')
                el-table-column(label='订单金额￥', prop='total')
                el-table-column(label='创建日期', prop='date_created', :formatter='dateCreatedForm', sortable)
                el-table-column(label='订单状态', prop='status')
                el-table-column(label='操作')
                    template(slot-scope='scope')
                        //- 订票流程
                        template(v-if='scope.row.air_orders.length > 0')
                            template(v-if='scope.row.status === "待确认"')
                                el-button(size='mini', type='text', @click='alertUserConfirm(scope.row.id)') 提醒用户确认
                            template(v-else-if='scope.row.status === "已取消"')
                                span(style='color: red') 订单终结
                            //- template(v-else-if='scope.row.status === "待支付" && scope.row.sub_status === 1')
                            //-     el-button(size='mini', type='text') 提醒用户支付
                            template(v-else-if='scope.row.status === "已出票" && scope.row.sub_status === 1')
                                el-button(size='mini', type='text', @click='reschedule(scope.row.air_orders, scope.row.id)') 改签
                                el-button(size='mini', type='text', @click='refundFlight(scope.row.id)') 退票
                            template(v-else-if='scope.row.status === "已退款" && scope.row.sub_status === 1')
                                span(style='color: red') 订单终结
                            template(v-else-if='scope.row.status === "退款失败" && scope.row.sub_status === 1')
                                span(style='color: red') 退款失败
                            //- 改签流程
                            template(v-else-if='scope.row.status === "改签失败" && scope.row.sub_status === 1')
                                el-button(size='mini', type='text', @click='refundFlight(scope.row.id)') 退票
                            template(v-else-if='scope.row.status === "改签失败" && scope.row.sub_status === 2')
                                span(style='color: red') 订单终结
                            template(v-else-if='scope.row.status === "改签失败" && scope.row.sub_status === 5')
                                el-button(size='mini', type='text', @click='refundFlight(scope.row.id)') 退票
                            template(v-else-if='scope.row.status === "改签失败" && scope.row.sub_status === 6')
                                span(style='color: red') 订单终结
                            template(v-else-if='scope.row.status === "已出票" && scope.row.sub_status === 3')
                                span(style='color: red') 订单终结
                            template(v-else-if='scope.row.status === "改签失败" && scope.row.sub_status === 7')
                                el-button(size='mini', type='text', @click='refundFlight(scope.row.id)') 退票
                            template(v-else-if='scope.row.status === "改签失败" && scope.row.sub_status === 8')
                                span(style='color: red') 订单终结
                            template(v-else-if='scope.row.status === "改签失败" && scope.row.sub_status === 9')
                                span(style='color: red') 改签失败
                            //- 退票流程
                            template(v-else-if='scope.row.status === "已退款" && scope.row.sub_status === 4')
                                span(style='color: red') 订单终结
                            template(v-else-if='scope.row.status === "退款失败" && scope.row.sub_status === 4')
                                span(style='color: red') 退款失败
                            template(v-else-if='scope.row.status === "退票失败" && scope.row.sub_status === 1')
                                el-button(size='mini', type='primary', @click='reschedule(scope.row.air_orders, scope.row.id)') 改签
                            template(v-else-if='scope.row.status === "退票失败" && scope.row.sub_status === 2')
                                span(style='color: red') 订单终结
                            //- template(v-else)
                            //-     span 无操作
                        //- el-button(type='text', size='mini', @click='orderDetail(scope.row.id)') 详情
                        template(v-if='scope.row.hotel_orders.length > 0')
                            //- span {{scope.row.status}}
                            template(v-if='scope.row.status === "待确认"')
                                el-button(size='mini', type='text', @click='alertUserConfirm(scope.row.id)') 提醒用户确认
                            template(v-else-if='scope.row.status === "处理中" || scope.row.status === "预定成功" || scope.row.status === "可入住"')
                                el-button(size='mini', type='text', @click='cancelHotelOrder(scope.row.id)') 取消}}
            .page-block
                el-pagination(layout='prev, pager, next', :page-count='page.total_pages', :current-page='page.page_num', @current-change='pageChange')
        el-dialog(title='改签确认', :visible.sync='rescheduleModal', width='30%', :before-close='handleRescheduleClose')
            div
                p(style='margin: 10px 0') 乘机人:
                    template(v-for='item in rescheduleShowData.user')
                        | &nbsp;&nbsp;
                        el-tag(type='success') {{item}}
                el-card(:body-style='{padding: "10px"}')
                    p(style='position: absolute; right: 30px; font-size: 20px; color: #409EFF;') 原航班
                    p {{rescheduleShowData.flight.depart}}-{{rescheduleShowData.flight.arrive}}
                    p {{rescheduleShowData.flight.time}}
                    p {{rescheduleShowData.flight.airline}}-{{rescheduleShowData.flight.flightNo}}
                    p {{rescheduleShowData.flight.departTerminal}}-{{rescheduleShowData.flight.arriveTerminal}}
                el-date-picker(v-model='rescheduleData.time', type='date', placeholder='选择改签日期', style='margin: 10px 10px 10px 0', value-format="yyyy-MM-dd")
                el-button(type='primary', @click='confirmReschedule') 选择航班
</template>

<script>
export default {
    data () {
        return {
            searchData: '',
            orderType: '0',
            orderData: [],
            page: {
                page_num: 1,
                total_pages: null,
                total_items: null
            },
            loading: false,
            cardType: new Map([
                ['NI', '身份证'],
                ['PP', '护照'],
                ['HX', '回乡证'],
                ['TB', '台胞证'],
                ['GA', '港澳通行证'],
                ['HY', '国际海员证'],
                ['ID', '其他']
            ]),
            cityMap: null,
            airline: new Map([['3U', '四川航空'], ['8L', '祥鹏航空'], ['9C', '春秋航空'], ['9H', '长安航空'], ['A6', '红土航空'], ['BK', '奥凯航空'], ['CA', '中国航空'], ['CN', '大新华航'], ['CZ', '南方航空'], ['DR', '瑞丽航空'], ['DZ', '东海航空'], ['EU', '成都航空'], ['FM', '上海航空'], ['FU', '福州航空'], ['G5', '华夏航空'], ['GJ', '长龙航空'], ['GS', '天津航空'], ['GT', '桂林航空'], ['GX', '北部弯航空'], ['GY', '多彩贵州航空'], ['HO', '吉祥航空'], ['HU', '海南航空'], ['JD', '首都航空'], ['JR', '幸福航空'], ['KN', '中联航空'], ['KY', '昆明航空'], ['LT', '龙江航空'], ['MF', '厦门航空'], ['MU', '东方航空'], ['NS', '河北航空'], ['OQ', '重庆航空'], ['PN', '西部航空'], ['QW', '青岛航空'], ['RY', '江西航空'], ['SC', '山东航空'], ['TV', '西藏航空'], ['UQ', '乌鲁木齐航空'], ['Y8', '扬子江快运航空'], ['YI', '英安航空'], ['ZH', '深圳航空']]),
            rescheduleModal: false,
            rescheduleShowData: {
                user: [],
                flight: {
                    depart: '',
                    arrive: '',
                    time: '',
                    airline: '',
                    flightNo: '',
                    departTerminal: '',
                    arriveTerminal: ''
                }
            },
            rescheduleData: {
                id: undefined,
                item: [],
                time: '',
                condition: {
                    airline: '',
                    level: '',
                    discount: undefined
                },
                depart: {
                    airportNameCN: '',
                    cityCode: '',
                    cityNameCN: ''
                },
                arrive: {
                    airportNameCN: '',
                    cityCode: '',
                    cityNameCN: ''
                }
            }
        }
    },
    filters: {
        dateFilter (value) {
            return 0
        }
    },
    watch: {
        orderType () {
            this.getOrderData(1)
        }
    },
    methods: {
        searchOrder () { // 搜索订单
            if (this.searchData !== '') {
                this.loading = true
                this.$http.get('/orders', {
                    params: {
                        phone: this.searchData
                    }
                }).then((res) => {
                    console.log(res.data)
                    this.loading = false
                    if (res.data.results.length === 0) {
                        this.$message('该用户没有订单')
                        return
                    }
                    this.orderData = res.data.results
                    this.page.page_num = res.data.page_num
                    this.page.total_pages = res.data.total_pages
                    this.page.total_items = res.data.total_items
                }).catch((error) => {
                    this.loading = false
                    console.log(error)
                })
            } else {
                this.$message.error('订单ID为空')
            }
        },
        dateCreatedForm (row, column) { // 尾缀带Form的都是element表格进行数据格式化的
            return row.date_created.substr(0, 10)
        },
        birthdayForm (row, column) {
            return row.birthday.substr(0, 10)
        },
        cardTypeForm (row, column) {
            return this.cardType.get(row.card_type)
        },
        arrivalDateForm (row, column) {
            return row.arrivalDate.substr(0, 10)
        },
        departureDateForm (row, column) {
            return row.departureDate.substr(0, 10)
        },
        passengerForm (row, column) {
            return row.orderPassengerDetails
        },
        departForm (row, column) {
            return (this.cityMap.get(row.depart)).split('+')[1] + row.departTerminal
        },
        newFlightDepartForm (row, column) {
            return (this.cityMap.get(row.newFlight.depart)).split('+')[1] + row.newFlight.departTerminal
        },
        arriveForm (row, column) {
            return (this.cityMap.get(row.arrive)).split('+')[1] + row.arriveTerminal
        },
        newFlightArriveForm (row, column) {
            return (this.cityMap.get(row.newFlight.arrive)).split('+')[1] + row.newFlight.arriveTerminal
        },
        departDateForm (row, column) {
            return row.departDate.substr(0, 10)
        },
        newFlightdepartDateForm (row, column) {
            return row.newFlight.departDate.substr(0, 10)
        },
        cabinForm (row, column) {
            if (row.serviceLevel === 'F') {
                return '头等' + row.cabin + '舱'
            } else if (row.serviceLevel === 'C') {
                return '商务' + row.cabin + '舱'
            } else {
                return '经济' + row.cabin + '舱'
            }
        },
        newFlightCabinForm (row, column) {
            if (row.newFlight.serviceLevel === 'F') {
                return '头等' + row.newFlight.cabin + '舱'
            } else if (row.newFlight.serviceLevel === 'C') {
                return '商务' + row.newFlight.cabin + '舱'
            } else {
                return '经济' + row.newFlight.cabin + '舱'
            }
        },
        airlineForm (row, column) {
            return this.airline.get(row.airline)
        },
        newFlightAirlineForm (row, column) {
            return this.airline.get(row.newFlight.airline)
        },
        getOrderData (pg) { // 请求订单列表
            let page = pg || this.page.page_num
            this.loading = true
            let url = ''
            if (this.orderType === '0') { // 通过不同的订单类型展示不同的订单列表
                url = '/orders'
            } else if (this.orderType === '1') {
                url = '/orders?type=air'
            } else if (this.orderType === '2') {
                url = '/orders?type=hotel'
            } else if (this.orderType === '3') {
                url = '/orders?type=voucher'
            } else if (this.orderType === '4') {
                url = '/orders?type=mall'
            } else {
                url = '/orders'
            }
            this.$http.get(url, {
                params: {
                    page: page
                }
            }).then((res) => {
                this.loading = false
                this.orderData = res.data.results
                this.page.page_num = res.data.page_num
                this.page.total_pages = res.data.total_pages
                this.page.total_items = res.data.total_items
            }).catch((error) => {
                console.log(error)
            })
        },
        pageChange (page) {
            this.getOrderData(page)
        },
        // orderDetail (id) {
        //     this.$router.push({path: '/orderDetail', query: {order_id: id}})
        // },
        refundFlight (id) {
            this.$confirm('确定申请退票？', '退票申请', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get('/orders/dps/refund/' + id)
                    .then((res) => {
                        this.$message({
                            message: '申请退票成功，请等待审核',
                            type: 'success'
                        })
                        this.getOrderData()
                    }).catch((error) => {
                        console.log(error)
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消申请'
                })
            })
        },
        reschedule (item, id) { // 预备改签订单
            this.rescheduleData.item = []
            for (let i of item[0].contacts) {
                let o = {}
                o.origContact = i.id
                o.newContact = i.id
                o.origFlight = item[0].flights[0].id
                this.rescheduleData.item.push(o)
            }
            this.rescheduleData.condition.airline = item[0].flights[0].airline
            this.rescheduleData.condition.level = item[0].prices[0].serviceLevel
            this.rescheduleData.condition.discount = item[0].prices[0].discount
            this.rescheduleData.id = id
            // this.rescheduleData.condition.depart = item[0].flights[0].depart
            // this.rescheduleData.condition.arrive = item[0].flights[0].arrive
            this.rescheduleCheck(item[0])
        },
        rescheduleCheck (item) { // 改签
            this.rescheduleModal = true
            console.log(item)
            this.rescheduleShowData.user = []
            for (let i of item.contacts) {
                this.rescheduleShowData.user.push(i.name)
            }
            this.rescheduleShowData.flight.depart = (this.cityMap.get(item.flights[0].depart)).split('+')[0]
            this.rescheduleShowData.flight.arrive = (this.cityMap.get(item.flights[0].arrive)).split('+')[0]
            this.rescheduleShowData.flight.time = item.flights[0].departDate.substr(0, 10) + ' ' + item.flights[0].departTime + '-' + item.flights[0].arriveTime
            this.rescheduleShowData.flight.airline = this.airline.get(item.flights[0].airline)
            this.rescheduleShowData.flight.flightNo = item.flights[0].flightNo
            this.rescheduleShowData.flight.departTerminal = (this.cityMap.get(item.flights[0].depart)).split('+')[1] + item.flights[0].departTerminal
            this.rescheduleShowData.flight.arriveTerminal = (this.cityMap.get(item.flights[0].arrive)).split('+')[1] + item.flights[0].arriveTerminal
            this.rescheduleData.depart.cityCode = item.flights[0].depart
            this.rescheduleData.depart.cityNameCN = (this.cityMap.get(item.flights[0].depart)).split('+')[0]
            this.rescheduleData.depart.airportNameCN = (this.cityMap.get(item.flights[0].depart)).split('+')[1]
            this.rescheduleData.arrive.cityCode = item.flights[0].arrive
            this.rescheduleData.arrive.cityNameCN = (this.cityMap.get(item.flights[0].arrive)).split('+')[0]
            this.rescheduleData.arrive.airportNameCN = (this.cityMap.get(item.flights[0].arrive)).split('+')[1]
        },
        handleRescheduleClose (done) {
            this.$confirm('取消改签？')
                .then(_ => {
                    done()
                }).catch(_ => {})
        },
        confirmReschedule () {
            if (this.rescheduleData.time === '') {
                this.$message({
                    type: 'warning',
                    message: '请选择改签日期'
                })
            } else {
                console.log(this.rescheduleData)
                this.$router.push({path: '/flightReschedule', query: this.rescheduleData})
            }
        },
        cancelHotelOrder (id) {
            this.$confirm('该操作将取消当前订单，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get('/orders/hotel/cancel/' + id)
                    .then(() => {
                        this.getOrderData(this.page.page_num)
                        this.$message({
                            type: 'success',
                            message: '取消成功'
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'error',
                            message: '取消失败，请稍后重试'
                        })
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '操作取消'
                })
            })
        },
        alertUserConfirm (id) {
            this.$http.get('/orders/push/' + id)
                .then(() => {
                    this.$message.success('发送成功')
                }).catch((error) => {
                    console.log(error)
                })
        }
    },
    created () {
        if (this.$route.query.order_id) {
            this.$http.get('/orders/' + this.$route.query.order_id)
                .then((res) => {
                    console.log(res.data)
                    this.orderData = [res.data]
                }).catch((error) => {
                    console.log(error)
                })
        } else {
            this.getOrderData()
        }
        this.$http.get('../../../static/cityMap.json', {
            local_data: true
        }).then((res) => {
            this.cityMap = new Map(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }
}
</script>

<style scoped>
    .page-block {
        text-align: center;
        margin-top: 10px;
    }
    .table-expand {
        background-color: #b6abc0;
        /* background-color: rebeccapurple !important; */
    }
    .table-expand .el-form-item {
        width: 15%;
        margin-bottom: 0;
    }
    .flight-expand {
        display: flex;
        align-items: center;
    }
    .flight-expand__creater {
        width: 170px;
    }
    .hotel-expand {
        display: flex;
        align-items: center;
    }
    .hotel-expand__creater {
        width: 170px;
    }
    .my-table th, .my-table td {
        min-width: 100px;
        text-align: center;
        padding: 6px 0;
        display: inline-block;
    }
    .my-table th {
        border-bottom: 1px solid black;
    }
    .flight-reschedule {
        display: flex;
        align-items: center;
    }
    .order-logo {
        width: 20px;
        display: inline-block;
        margin: 0 5px -4px 0;
    }
</style>
