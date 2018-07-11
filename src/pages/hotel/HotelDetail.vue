<template lang='pug'>
    div
        el-card(v-loading='loading')
            .head
                h3.head__title {{hotelDetail.resName}}
                    span.head__title_class &nbsp;{{hotelDetail.resGrade}}
                p.head__location {{hotelDetail.cityName}} {{hotelDetail.sectionName}} {{hotelDetail.location}} {{hotelDetail.address}}
            .photo
                //- template(v-for='item in hotelDetail.imgInfoList')
                .photo__first
                    img(:src='mainImg')
                .photo__second
                    .photo__second_item(v-for='(item, index) in hotelDetail.imgInfoList', v-if='index > 0 && index < 9')
                        img(:src='item.imageUrl')
            .eqpt
                .eqpt__service
                .eqpt__minprice
            .search-bar
                el-form(:inline='true', :model='formSearch')
                    el-form-item(label='日期选择')
                        el-date-picker(v-model='formSearch.rangeTime', type='daterange', range-separator='至', start-placeholder='入住日期', end-placeholder='离店日期', value-format="yyyy-MM-dd")
                    el-form-item
                        el-button(type='primary', @click='searchAgain') 重新查询
            .room-list
                el-table(:data='hotelDetail.proDetails', style='width: 99%')
                    el-table-column(type='expand')
                        template(slot-scope='props')
                            table.my-table
                                thead
                                    tr
                                        th 日期
                                        //- th 剩余库存
                                        //- th 是否开放售卖
                                        th 早餐信息
                                        th 是否有窗
                                        th 加床价
                                        th 当日售价
                                        th 状态
                                tbody
                                    tr(v-for='item in props.row.resProBaseInfoList[0].proSaleInfoDetailsTarget')
                                        td {{item.lastReserveTime}}
                                        //- td {{item.inventoryRemainder}}间
                                        //- td
                                        //-     template(v-if='item.openingSale === true')
                                        //-         | 开放售卖
                                        //-     template(v-else)
                                        //-         | 不可售
                                        td {{item.breakfastName}}
                                        td
                                            template(v-if='props.row.resProBaseInfoList[0].hasWindows === 0')
                                                | 无
                                            template(v-else-if='props.row.resProBaseInfoList[0].hasWindows === 1')
                                                | 有
                                            template(v-else-if='props.row.resProBaseInfoList[0].hasWindows === 2')
                                                | 部分有窗
                                        td ￥{{item.addBedAmount}}
                                        td ￥{{item.distributionSalePrice}}
                                        td
                                            template(v-if='item.inventoryStats === 0')
                                                | 即时
                                            template(v-else-if='item.inventoryStats === 1')
                                                | 正常
                                            template(v-else-if='item.inventoryStats === 1')
                                                | 不可售
                    el-table-column(type='index')
                    el-table-column(prop='resProName', label='房间类型')
                    el-table-column(label='房间设备')
                        template(slot-scope='scope')
                            span(v-if='scope.row.hasBroadband.indexOf("FreeWiredBroadband") !== -1', style='display: inline-block; width: 20px;')
                                img(src='@/assets/computer.svg', style='width: 100%')
                            span(v-if='scope.row.hasBroadband.indexOf("FreeWifi") !== -1', style='display: inline-block; width: 20px; margin-left: 5px;')
                                img(src='@/assets/wifi.svg', style='width: 100%')
                    el-table-column(prop='roomFloor', label='楼层')
                    el-table-column(prop='roomSize', label='面积大小(m2)')
                    el-table-column(label='操作')
                        template(slot-scope='scope')
                            el-button(type='text', @click='showFacilities(scope.row.roomFacilities)') 房间设施详情
                            el-button(type='primary', size='mini', @click='hotelOrder(scope.row)', :disabled='!scope.row.gmSaleable') 预定
                            //- el-button(type='primary', size='mini', @click='hotelOrder(scope.row)') 预定
        el-dialog(title='房间设备详情', :visible.sync='faciModal', width='30%')
            el-table(:data='showFaci', style='width: 100%')
                el-table-column(prop='facilityCategoryName', label='设施类型')
                el-table-column(prop='facilityServicesName', label='服务类型')
            span.dialog-footer(slot='footer')
                el-button(type='primary', @click='faciModal = false') 确定
        el-dialog(title='订单', :visible.sync='userModal', width='30%')
            .user-select
                el-form(:inline='true', label-width='100px', onsubmit='return false')
                    el-form-item(label='手机号码')
                        el-input(placeholder='输入手机号码查找用户', size='small', v-model='userQuery', @keyup.enter.native='userSearch')
                    el-form-item
                        el-button(type='danger', size='small', @click='userSearch') 查找
                el-form(:model='formCheckIn', :rules='ruleCheckIn', ref='formCheckIn', label-width='100px')
                    el-form-item(label='手机户主', prop='userName')
                        el-input(v-model='formCheckIn.userName', placeholder='通过手机号码添加用户', readonly)
                    el-form-item(label='房间数', prop='roomcount')
                        el-select(v-model.number='formCheckIn.roomCount')
                            el-option(key='1', label='1间', value='1')
                            el-option(key='2', label='2间', value='2')
                            el-option(key='3', label='3间', value='3')
                            el-option(key='4', label='4间', value='4')
                            el-option(key='5', label='5间', value='5')
                            el-option(key='6', label='6间', value='6')
                            el-option(key='7', label='7间', value='7')
                            el-option(key='8', label='8间', value='8')
                            el-option(key='9', label='9间', value='9')
                            el-option(key='10', label='10间', value='10')
                    el-form-item(v-for='(item, index) in formCheckIn.name', :key='index', :label='"入住人" + (index + 1)' :prop='"name." + index + ".value"', :rules='{required: true, message: "入住人不能为空", trigger: "blur"}')
                        el-input(v-model='item.value')
                    el-form-item(label='联系人性别', prop='sex')
                        el-radio-group(v-model='formCheckIn.sex')
                            el-radio(label='1') 男
                            el-radio(label='0') 女
                    el-form-item(label='联系手机', prop='mobile')
                        el-input(v-model='formCheckIn.mobile')
                    el-form-item(label='预计到店', prop='arrivalTime')
                        el-select(v-model='formCheckIn.arrivalTime')
                            el-option(key='1', label='18:00之前', value='18')
                            el-option(key='2', label='20:00之前', value='20')
                            el-option(key='3', label='24:00之前', value='24')
                            el-option(key='4', label='次日凌晨06:00之前', value='30')
                    el-form-item
                        el-button(type='primary', @click='submitOrder("formCheckIn")') 提交订单
                        el-button(@click='userModal = false') 取消
</template>

<script>
export default {
    data () {
        let validateMobile = (rule, value, callback) => {
            let reg = /^1[345789]\d{9}$/
            // if (value === null || value === '') {
            //     callback(new Error('请输入联系人手机号码'))
            // } else
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('电话号码格式错误'))
            }
        }
        return {
            loading: false,
            hotelDetail: {},
            faciModal: false,
            showFaci: [],
            formSearch: {
                resId: '',
                rangeTime: []
            },
            userModal: false,
            userQuery: '',
            formCheckIn: {
                userName: '',
                userId: '',
                roomCount: 1,
                arrivalTime: 18,
                mobile: '',
                name: [{
                    value: ''
                }],
                sex: '1'
            },
            ruleCheckIn: {
                mobile: [
                    {required: true, message: '请填写入住人联系手机号码', trigger: 'blur'},
                    {validator: validateMobile, trigger: 'blur'}
                ],
                userName: [
                    {required: true, message: '手机户主必填', trigger: 'blur'}
                ]
                // name: [
                //     {required: true, message: '请填写入住人姓名', trigger: 'blur'}
                // ]
            },
            minRemainder: 0,
            orderData: {}
        }
    },
    computed: {
        mainImg () {
            if (this.hotelDetail.imgInfoList) {
                return this.hotelDetail.imgInfoList[0].imageUrl
            }
        },
        startTime () {
            return this.formSearch.rangeTime[0]
        },
        endTime () {
            return this.formSearch.rangeTime[1]
        }
    },
    watch: {
        'formCheckIn.roomCount' () {
            this.formCheckIn.name = []
            for (let i = 0; i < this.formCheckIn.roomCount; i++) {
                this.formCheckIn.name.push({
                    value: ''
                })
            }
        }
    },
    methods: {
        showFacilities (faci) { // 显示房间设备
            this.showFaci = faci
            this.faciModal = true
        },
        searchHotelDetail () {
            this.loading = true
            this.$http.get('/web/jd/searchHotelDetail', {
                params: {
                    resId: this.formSearch.resId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }).then((res) => {
                this.loading = false
                console.log(res.data)
                let item = res.data.data
                for (let i in item.proDetails) {
                    if (item.proDetails[i].bookStatus === 0 || item.proDetails[i].resProBaseInfoList[0].proSaleInfoDetailsTarget === null) {
                        item.proDetails[i].gmSaleable = false
                    } else {
                        item.proDetails[i].gmSaleable = true
                    }
                    // if (item.proDetails[i].resProBaseInfoList[0].proSaleInfoDetailsTarget[j].inventoryRemainder > 0 && item.proDetails[i].resProBaseInfoList[0].proSaleInfoDetailsTarget[j].inventoryStats !== 4 && item.proDetails[i].resProBaseInfoList[0].proSaleInfoDetailsTarget[j].openingSale === true) {
                }
                this.hotelDetail = res.data.data
            }).catch((error) => {
                this.loading = false
                console.log(error)
            })
        },
        searchAgain () { // 重新搜索
            this.searchHotelDetail()
        },
        userSearch () { // 通过手机号码搜索用户
            if (this.userQuery === '') {
                this.$message('搜索条件为空')
            } else {
                this.$http.get('/users', {
                    params: {
                        phone: this.userQuery
                    }
                }).then((res) => {
                    console.log(res.data.results)
                    if (res.data.results.length === 0) {
                        this.$message.error('未找到相关用户，请确认后重新搜索')
                    } else {
                        this.formCheckIn.userName = res.data.results[0].nickname
                        this.formCheckIn.userId = res.data.results[0].id
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        hotelOrder (item) { // 填写酒店订单
            this.formCheckIn.roomCount = 1
            this.formCheckIn.arrivalTime = 18
            this.formCheckIn.mobile = ''
            this.formCheckIn.name = [{value: ''}]
            this.formCheckIn.sex = '1'
            this.userModal = true
            let orderUseDateDetails = []
            for (let i in item.resProBaseInfoList[0].proSaleInfoDetailsTarget) {
                orderUseDateDetails.push({
                    checkPrice: item.resProBaseInfoList[0].proSaleInfoDetailsTarget[i].distributionSalePrice, // 酒店在该日期的卖价
                    useDate: i // 酒店的使用日期
                })
            }
            let arr = []
            for (let i in item.resProBaseInfoList[0].proSaleInfoDetailsTarget) {
                arr.push(item.resProBaseInfoList[0].proSaleInfoDetailsTarget[i].inventoryRemainder)
            }
            this.minRemainder = Math.min(...arr)
            let orderObj = {
                arrivalTime: 18,
                isPay: false,
                linkManMobile: '',
                linkManName: '',
                linkManSex: '',
                orderAdults: 1,
                bookCount: 1, // 预定份数
                hotelName: this.hotelDetail.resName,
                // orderPassengerDetails: [ // list<travlePassengerInfo>
                //     {
                //         mobile: '', // 客人姓名
                //         name: '' // 客人手机号
                //     }
                // ],
                orderPassengerDetails: [],
                orderUseDateDetails: orderUseDateDetails, // list<ResourceUseDateDetail>
                paymentSign: 2, // 支付模式： 1.预付；2.现付
                proId: item.proId,
                productUniqueId: item.resProBaseInfoList[0].productUniqueId,
                resId: this.hotelDetail.resId,
                beforeTotalPrice: null, // 总价
                breakfastCount: item.resProBaseInfoList[0].breakfastCount,
                dbCancelRule: '', // 取消规则
                dbOrderType: '无担保类型', // 担保类型
                hotelAddress: this.hotelDetail.address,
                hotelPhone: this.hotelDetail.resPhone,
                orderType: 1, // 订单类型： 1内；2国际
                proName: item.resProName,
                // supplierCode: '103',
                supplierNo: this.hotelDetail.supplierNo,
                totalRebateRateProfit: item.resProBaseInfoList[0].rebateRateProfit
            }
            for (let i in item.resProBaseInfoList[0].proSaleInfoDetailsTarget) {
                let t = item.resProBaseInfoList[0].proSaleInfoDetailsTarget[i].guaranteeCode
                switch (t) {
                case 16:
                    orderObj.dbOrderType = 5
                    break
                case 32:
                    orderObj.dbOrderType = 3
                    break
                case 1:
                    orderObj.dbOrderType = 1
                    break
                case 0:
                    orderObj.dbOrderType = 0
                    break
                case 2:
                    orderObj.dbOrderType = 2
                    break
                case 4:
                    orderObj.dbOrderType = 3
                    break
                case 8:
                    orderObj.dbOrderType = 4
                    break
                default:
                    console.log('What happend?')
                }
                break
            }
            this.orderData = orderObj
        },
        submitOrder (name) { // 提交订单
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.orderData.user_id = this.formCheckIn.userId
                    this.orderData.linkManMobile = this.formCheckIn.mobile
                    this.orderData.linkManName = this.formCheckIn.name[0].value
                    this.orderData.linkManSex = this.formCheckIn.sex === '1' ? 1 : 0
                    this.orderData.arrivalTime = this.formCheckIn.arrivalTime
                    this.orderData.orderAdults = this.formCheckIn.roomCount
                    this.orderData.bookCount = this.formCheckIn.roomCount
                    for (let i of this.orderData.orderUseDateDetails) {
                        this.orderData.beforeTotalPrice += i.checkPrice * this.formCheckIn.roomCount
                    }
                    this.orderData.totalRebateRateProfit = parseInt(this.orderData.totalRebateRateProfit * this.orderData.beforeTotalPrice)
                    for (let i of this.formCheckIn.name) {
                        this.orderData.orderPassengerDetails.push(i.value)
                    }
                    this.loading = true
                    this.userModal = false
                    console.log(this.orderData)
                    this.$http.post('/orders/hotel', this.orderData)
                        .then((res) => {
                            if (res.status >= 200 && res.status < 300) {
                                // this.$router.push({path: '/orderDetail', query: {order_id: res.data.order_id}})
                                this.$message.success('预定成功')
                                this.$router.push({path: '/order'})
                            } else {
                                this.$message.error(res.data.message)
                            }
                            this.loading = false
                        }).catch((error) => {
                            this.loading = false
                            console.log(error)
                        })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '数据格式不正确'
                    })
                }
            })
        }
    },
    created () {
        let query = this.$route.query
        this.formSearch.resId = query.resId
        this.formSearch.rangeTime[0] = query.startTime
        this.formSearch.rangeTime[1] = query.endTime
        this.searchHotelDetail()
    }
}
</script>

<style scoped>
    .head__title {
        font-size: 28px;
        font-weight: bold;
    }
    .head__title_class {
        font-size: 20px;
        font-weight: normal;
    }
    .head__location {
        margin: 10px 0;
    }
    .photo {
        display: flex;
        font-size: 0;
        width: 950px;
    }
    .photo__first {
        width: 300px;
        height: 300px;
        overflow: hidden;
        flex-shrink: 0;
    }
    .photo__first > img {
        height: 100%;
        /* margin-left: -48px; */
    }
    .photo__second {
        height: 300px;
        padding-left: 1px;
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
    }
    .photo__second_item {
        box-sizing: border-box;
        height: 150px;
        width: 150px;
        overflow: hidden;
        margin-left: 1px;
        padding: 0.5px 0;
    }
    .photo__second_item > img {
        height: 100%;
        /* margin-left: -25px; */
    }
    .search-bar {
        margin: 10px 0;
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
</style>
