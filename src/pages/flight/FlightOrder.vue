<template lang='pug'>
    div.main-content(v-loading='loading')
        el-card.order-left
            .search-block
                span 用户选择
                |&nbsp;&nbsp;&nbsp;&nbsp;
                el-select(v-model='userNo', filterable, style='width: 200px', @change='selectUser', placeholder='手机号码选择乘机用户')
                    el-option(v-for='(item, index) in userList', :value='index', :key='index', :label='item.phone + " - " + item.nickname')
            .friend-block
                h3.friend-block__head 机主关联乘客
                    span.friend-block__head_sub (跟机主关联的所有乘客)
                el-card.friend-block__card
                    p.friend-block__card_host(v-if='userNo!==null') {{userList[userNo].nickname}}(机主)
                    p.age-alert(v-show='babyAlert') (2周岁以下婴儿订票需有成人陪同)
                    p.age-alert(v-show='chdAlert') (儿童只可单独订票)
                    p.age-alert(v-show='stockNum') (已超过订单最大购票人数)
                    el-checkbox-group(v-model='friendNo')
                        el-checkbox(v-for='(item, index) in friends', :value='index', :label='index', :key='item.id') {{item.name}}
                el-button(type='primary', icon='el-icon-plus', style='margin-top: 10px;', @click='addContact(userList[userNo].id)', :disabled='userNo===null') 新增联系人
            .passenger-block
                h3.passenger-block__head 乘机人信息
                .passenger-block__card(v-for='item in friendNo')
                    .passenger-block__card_left
                        p: i.el-icon-edit(@click='editContact(friends[item], userList[userNo].id)')
                    .passenger-block__card_middle
                        p.line
                            span.label 姓名:
                            span.detail {{friends[item].name}}
                        p.line
                            span.label 证件类型:
                            span.detail {{cardType.get(friends[item].card_type)}}
                        p.line
                            span.label 证件号码:
                            span.detail {{friends[item].card_number}}
                        //- p.line
                            span.label 电话:
                            span.detail {{friends[item].phone}}
                    .passenger-block__card_right
                        p.line
                            span.detail(v-if='friends[item].age === null') 身份证信息遗漏，请重新编辑
                            span.detail(v-else-if='friends[item].age>=12') 成人：￥{{Math.trunc(cardObj.price.minSalePrice)}}
                            span.detail(v-else-if='friends[item].age>=2') 儿童：￥{{cardObj.price.theprice*0.5}}
                            span.detail(v-else) 婴儿：￥{{roundOff(cardObj.price.theprice*0.1)}}
            .select-block
                .select-block__choice
                    p.select-block__choice_line
                        el-checkbox(v-model='insurance', size='large') 航空意外险
                //- .select-block__choice
                //-     p.select-block__choice_line
                //-         el-checkbox(v-model='invoice', size='large') 报销凭证(到付)
        el-card.order-right
            el-card.ticket-card
                .ticket-card__head
                    h3.ticket-card__head_title
                        span {{cardObj.departDate}}
                        span {{cardObj.departCityName}} - {{cardObj.arriveCityName}}
                    p.ticket-card__head_sub
                        span {{cardObj.airline}}
                        span {{cardObj.no}}
                        span(v-if='cardObj.level.toUpperCase() === "Y"') 经济{{cardObj.cabin}}舱
                        span(v-else-if='cardObj.level.toUpperCase() === "F"') 头等{{cardObj.cabin}}舱
                        span(v-else-if='cardObj.level.toUpperCase() === "C"') 商务{{cardObj.cabin}}舱
                .ticket-card__journey
                    .ticket-card__journey_left
                        h3.clock {{cardObj.departTime}}
                        p.airport {{cardObj.departPort}}
                    .ticket-card__journey_middle
                        p.last {{cardObj.flightTime}}
                        p.line
                    .ticket-card__journey_right
                        h3.clock {{cardObj.arriveTime}}
                        p.airport {{cardObj.arrivePort}}
                hr
                .ticket-card__content(v-if='adtMsg.num || chdMsg.num || babyMsg.num')
                    .ticket-card__content_line(v-if='adtMsg.num')
                        p.line
                            span.line_label 成人票
                            span.line_price ￥{{Math.trunc(cardObj.price.minSalePrice)}} X {{adtMsg.num}}
                    .ticket-card__content_line(v-if='chdMsg.num')
                        p.line
                            span.line_label 儿童票
                            span.line_price ￥{{this.cardObj.price.theprice}} X {{chdMsg.num}} X 0.5
                    .ticket-card__content_line(v-if='babyMsg.num')
                        p.line
                            span.line_label 婴儿票
                            span.line_price ￥{{roundOff(this.cardObj.price.theprice * 0.1)}} X {{babyMsg.num}}
                    .ticket-card__content_line(v-if='adtMsg.num || chdMsg.num || babyMsg.num')
                        p.line
                            span.line_label 机建费
                            span.line_price
                                span(v-if='!adtMsg.num && !chdMsg.num') ￥0
                                span(v-else)
                                    span.line_price_adt(v-if='adtMsg.num') ￥{{cardObj.price.taxFee}} X {{adtMsg.num}}
                                    span.line_price_add(v-if='adtMsg.num && chdMsg.num') +
                                    span.line_price_chd(v-if='chdMsg.num') {{roundOff(cardObj.price.taxFee * 0.5)}} X {{chdMsg.num}}
                    .ticket-card__content_line(v-if='adtMsg.num || chdMsg.num || babyMsg.num')
                        p.line
                            span.line_label 燃油费
                            span.line_price ￥{{cardObj.price.fuelFee * friendNo.length}}
                    hr
                    .ticket-card__content_line(v-if='insurance')
                        p.line
                            span.line_label 航空意外险
                            span.line_price ￥5 X {{friendNo.length}}
                    .ticket-card__content_line(v-if='invoice')
                        p.line
                            span.line_label 报销凭证
                            span.line_price 到付
                    .ticket-card__content_line
                        p.total-price
                            |￥{{totalPrice}}
                .ticket-card__confirm(v-if='adtMsg.num || chdMsg.num || babyMsg.num')
                    el-button(type='primary', style='width: 100%', @click='confirmSend', :disabled='babyAlert || chdAlert || stockNum') 发给用户确认并自动预定
        .user-model
            el-dialog(title='联系人', :visible.sync='ctcModel', width='30%')
                el-form(ref='formContact', :model='formContact', :rules='ruleContact', label-width='80px', v-loading='ctcModelLoading')
                    el-form-item(label='姓名', prop='name')
                        el-input(v-model='formContact.name')
                    el-form-item(label='电话', prop='phone')
                        el-input(v-model='formContact.phone')
                    el-form-item(label='性别')
                        el-radio-group(v-model.number='formContact.sex')
                            el-radio(:label='1') 男
                            el-radio(:label='2') 女
                    el-form-item(label='证件类型', prop='card_type')
                        el-select(v-model='formContact.card_type')
                            el-option(value='NI', label='身份证(默认)')
                            el-option(value='PP', label='护照')
                            el-option(value='HX', label='回乡证')
                            el-option(value='TB', label='台胞证')
                            el-option(value='GA', label='港澳通行证')
                            el-option(value='HY', label='国际海员证')
                            el-option(value='ID', label='其他')
                    el-form-item(label='证件号码', prop='card_number')
                        el-input(v-model='formContact.card_number')
                    el-form-item(label='出生日期', prop='birthday', v-if='formContact.card_type!=="NI"')
                        el-date-picker(v-model='formContact.birthday', type='date', placeolder='选择出生日期', value-format='yyyy-MM-dd')
                span.dialog-footer(slot='footer')
                    el-button(@click='ctcDelete', v-if='formContact.id', :disabled='ctcModelLoading') 删除
                    el-button(type='primary', @click='ctcConfirm("formContact")', :disabled='ctcModelLoading') 保存
</template>

<script>
export default {
    data () {
        let validatePhone = (rule, value, callback) => {
            let reg = /^1[345789]\d{9}$/
            if (value === null || value === '') {
                callback()
            } else if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('电话号码格式错误'))
            }
        }
        let validateID = (rule, value, callback) => {
            // let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
            if (this.formContact.card_type === 'NI') {
                if (value === null || value === '') {
                    callback(new Error('身份证号不能为空'))
                // } else if (reg.test(value)) {
                } else if (this.isIDCard(value)) {
                    callback()
                } else {
                    callback(new Error('身份证号码格式错误'))
                }
            } else if (this.formContact.card_type !== 'ID') {
                if (value === null || value === '') {
                    callback(new Error('证件号码不能为空'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            ctcModelLoading: false,
            userList: [],
            userNo: null,
            friends: [],
            friendNo: [],
            insurance: false,
            invoice: false,
            cardObj: {},
            orderObj: {},
            ctcModel: false,
            loading: false,
            formContact: {
                host_id: '',
                id: '',
                name: '',
                phone: '',
                sex: 1,
                card_type: 'NI',
                card_number: '',
                birthday: ''
            },
            ruleContact: {
                name: [
                    {required: true, message: '请填写联系人姓名', trigger: 'blur'}
                ],
                phone: [
                    {validator: validatePhone, trigger: 'blur'}
                ],
                card_number: [
                    {validator: validateID, trigger: 'blur'}
                ],
                birthday: [
                    {required: true, message: '请填写出生日期', trigger: 'blur'}
                ]
            }
        }
    },
    computed: {
        cardType () {
            return new Map([
                ['NI', '身份证'],
                ['PP', '护照'],
                ['HX', '回乡证'],
                ['TB', '台胞证'],
                ['GA', '港澳通行证'],
                ['HY', '国际海员证'],
                ['ID', '其他']
            ])
        },
        babyAlert () { // 婴儿不能单独订购，不满足条件时显示提醒
            if (this.babyMsg.num > 0 && this.adtMsg.num < 1) {
                return true
            } else {
                return false
            }
        },
        chdAlert () { // 儿童只能同类型订购，不满足条件时显示提醒
            if (this.chdMsg.num > 0 && (this.adtMsg.num > 0 || this.babyMsg.num > 0)) {
                return true
            } else {
                return false
            }
        },
        adtMsg () { // 订票成人信息，包括人数与价格
            let price = 0
            let num = 0
            for (let value of this.friendNo) {
                if (this.friends[value].age >= 12) {
                    price += this.cardObj.price.minSalePrice
                    num++
                }
            }
            price = Math.trunc(price)
            return {price, num}
        },
        chdMsg () { // 订票儿童信息，包括人数与价格
            let price = 0
            let num = 0
            for (let value of this.friendNo) {
                if (this.friends[value].age < 12 && this.friends[value].age >= 2) {
                    price += this.cardObj.price.theprice * 0.5
                    num++
                }
            }
            return {price, num}
        },
        babyMsg () { // 订票婴儿信息，包括人数与价格
            let price = 0
            let num = 0
            for (let value of this.friendNo) {
                if (this.friends[value].age < 2 && this.friends[value].age !== null) {
                    price += this.roundOff(this.cardObj.price.theprice * 0.1)
                    num++
                }
            }
            return {price, num}
        },
        totalPrice () { // 总价
            let price = this.adtMsg.price + this.chdMsg.price + this.babyMsg.price + this.cardObj.price.taxFee * this.adtMsg.num + this.roundOff(this.cardObj.price.taxFee * 0.5) * this.chdMsg.num + this.cardObj.price.fuelFee * this.adtMsg.num + this.cardObj.price.fuelFee * this.chdMsg.num * 0.5
            if (this.insurance) {
                price += 5 * this.friendNo.length
            }
            return price
        },
        stockNum () { // 仓位剩余座位数
            if ((this.adtMsg.num + this.babyMsg.num) > this.cardObj.stock || this.chdMsg.num > this.cardObj.stock) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        getContacts () { // 获取相关联系人信息
            let temp = []
            this.friendNo = []
            this.friends = []
            this.$http.get('/users/' + this.userList[this.userNo].id)
                .then((res) => {
                    this.loading = false
                    console.log(res.data)
                    temp = res.data.contacts
                    for (let item in temp) {
                        if (temp[item].birthday) {
                            temp[item].age = this.getCtcAge(temp[item].birthday)
                        } else {
                            alert('没填写出生日期吗？')
                        }
                    }
                    this.friends = temp
                }).catch((error) => {
                    console.log(error)
                })
        },
        selectUser () { // 选择机主
            this.getContacts()
        },
        getCtcAge (birthday) { // 根据生日与乘机日期获取乘机人坐飞机当天的年龄
            let birthDay = new Date(birthday)
            if (birthDay !== null) {
                let nowDate = new Date(this.cardObj.departDate)
                let month = nowDate.getMonth() + 1
                let day = nowDate.getDate()
                let age = nowDate.getFullYear() - birthDay.getFullYear() - 1
                // if (birthDay.substring(10, 12) < month || (birthDay.substring(10, 12) === month && birthDay.substring(12, 14) <= day)) {
                if (birthDay.getMonth() + 1 < month || (birthDay.getMonth() + 1 === month && birthDay.getDate() <= day)) {
                    age++
                }
                return age
            } else {
                return null
            }
        },
        addContact (id) { // 添加联系人
            if (this.$refs['formContact']) {
                this.$refs['formContact'].resetFields()
            }
            this.ctcModel = true
            this.formContact.host_id = id
            this.formContact.id = ''
            this.formContact.phone = ''
            this.formContact.name = ''
            this.formContact.sex = 1
            this.formContact.card_type = 'NI'
            this.formContact.card_number = ''
            this.formContact.birthday = ''
        },
        editContact (item, id) { // 编辑联系人
            if (this.$refs['formContact']) {
                this.$refs['formContact'].resetFields()
            }
            this.ctcModel = true
            this.formContact.host_id = id
            this.formContact.id = item.id
            this.formContact.phone = item.phone
            this.formContact.name = item.name
            this.formContact.sex = item.sex
            this.formContact.card_type = item.card_type
            this.formContact.card_number = item.card_number
            this.formContact.birthday = (item.birthday).substr(0, 10)
        },
        ctcConfirm (name) { // 确认添加
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.formContact.card_type === 'NI') {
                        let d = this.formContact.card_number.substring(6, 10) + '-' + this.formContact.card_number.substring(10, 12) + '-' + this.formContact.card_number.substring(12, 14)
                        this.formContact.birthday = d
                    }
                    if (this.formContact.id) {
                        this.ctcModelLoading = true
                        this.$http.patch('/users/contacts/' + this.formContact.id, {
                            name: this.formContact.name,
                            phone: this.formContact.phone || null,
                            sex: this.formContact.sex,
                            card_type: this.formContact.card_type,
                            card_number: this.formContact.card_number,
                            birthday: this.formContact.birthday + 'T00:00',
                            owner: this.formContact.host_id
                        }).then((res) => {
                            this.ctcModelLoading = false
                            this.ctcModel = false
                            this.loading = true
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.getContacts()
                        }).catch((error) => {
                            this.ctcModelLoading = false
                            console.log(error)
                        })
                    } else {
                        this.ctcModelLoading = true
                        this.$http.post('/users/contacts', {
                            name: this.formContact.name,
                            phone: this.formContact.phone || null,
                            card_type: this.formContact.card_type,
                            card_number: this.formContact.card_number,
                            sex: this.formContact.sex,
                            birthday: this.formContact.birthday + 'T00:00',
                            owner: this.formContact.host_id
                        }).then((res) => {
                            this.ctcModelLoading = false
                            this.ctcModel = false
                            this.loading = true
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            this.getContacts()
                        }).catch((error) => {
                            this.ctcModelLoading = false
                            console.log(error)
                        })
                    }
                } else {
                    this.$message({
                        message: '格式不正确',
                        type: 'error'
                    })
                }
            })
        },
        ctcDelete () { // 删除联系人
            this.$confirm('确认删除？')
                .then(() => {
                    this.$http.delete('/users/contacts/' + this.formContact.id)
                        .then((res) => {
                            this.ctcModel = false
                            this.loading = true
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.getContacts()
                        }).catch((error) => {
                            console.log(error)
                        })
                }).catch(() => {
                    console.log('no')
                })
        },
        confirmSend () { // 发送订单
            // let flight = this.orderObj.flights[0]
            // this.orderObj.flights = []
            this.loading = true
            this.orderObj.insurance = this.insurance
            this.orderObj.name = this.userList[this.userNo].nickname
            this.orderObj.phone = this.userList[this.userNo].phone
            this.orderObj.user_id = this.userList[this.userNo].id
            this.orderObj.travelers = []
            for (let i of this.friendNo) {
                this.orderObj.travelers.push(this.friends[i].id)
            }
            if (this.adtMsg.num > 0 && this.babyMsg.num > 0) { // 婴儿订票必须有成人陪同，所以作此判断
                this.orderObj.prices[1] = Object.assign({}, this.orderObj.prices[0])
                this.orderObj.prices[0].ageType = 'ADT'
                Reflect.deleteProperty(this.orderObj.prices[1], 'policyId')
                // this.orderObj.prices[1].policyId = ''
                this.orderObj.prices[1].cabin = this.orderObj.prices[1].serviceLevel
                this.orderObj.prices[1].ageType = 'INF'
                this.orderObj.prices[1].fuelFee = 0
                this.orderObj.prices[1].taxFee = 0
                this.orderObj.prices[1].parPrice = this.roundOff(this.orderObj.prices[1].originPrice * 0.1) // 别问我为啥都选择originPrice，我也不知道
                this.orderObj.prices[1].salePrice = this.roundOff(this.orderObj.prices[1].originPrice * 0.1)
                this.orderObj.prices[1].fdPrice = this.roundOff(this.orderObj.prices[1].originPrice * 0.1)
                this.orderObj.prices[1].buyPrice = this.roundOff(this.orderObj.prices[1].originPrice * 0.1)
                // this.orderObj.prices[1].parPrice = this.roundOff(this.orderObj.prices[1].parPrice * 0.1)
                // this.orderObj.prices[1].salePrice = this.roundOff(this.orderObj.prices[1].salePrice * 0.1)
                // this.orderObj.prices[1].fdPrice = this.roundOff(this.orderObj.prices[1].fdPrice * 0.1)
                // this.orderObj.prices[1].buyPrice = this.roundOff(this.orderObj.prices[1].buyPrice * 0.1)
                this.$http.post('/orders/orderPolicy', { // 获取sign，只有婴儿不需要
                    ageType: 'ADT',
                    lowestPrice: 'true',
                    policys: this.cardObj.policys
                }).then(res => {
                    console.log(res)
                    let sign = ''
                    for (let key in res.data.ow_data) {
                        sign = res.data.ow_data[key].cabins[0].salePrices[0].sign
                        break
                    }
                    this.orderObj.prices[0].sign = sign
                    this.postOrder()
                }).catch(err => {
                    console.log(err)
                })
            } else if (this.chdMsg.num > 0) { // 儿童只能同类型订购
                this.orderObj.prices[0].ageType = 'CHD'
                this.orderObj.prices[0].fuelFee = 0
                this.orderObj.prices[0].taxFee = this.orderObj.prices[0].taxFee
                this.orderObj.prices[0].parPrice = this.roundOff(this.orderObj.prices[0].originPrice * 0.5)
                this.orderObj.prices[0].salePrice = this.roundOff(this.orderObj.prices[0].originPrice * 0.5)
                this.orderObj.prices[0].fdPrice = this.roundOff(this.orderObj.prices[0].originPrice * 0.5)
                this.orderObj.prices[0].buyPrice = this.roundOff(this.orderObj.prices[0].originPrice * 0.5)
                // this.orderObj.prices[0].parPrice = this.roundOff(this.orderObj.prices[0].parPrice * 0.5)
                // this.orderObj.prices[0].salePrice = this.roundOff(this.orderObj.prices[0].salePrice * 0.5)
                // this.orderObj.prices[0].fdPrice = this.roundOff(this.orderObj.prices[0].fdPrice * 0.5)
                // this.orderObj.prices[0].buyPrice = this.roundOff(this.orderObj.prices[0].buyPrice * 0.5)
                this.$http.post('/orders/orderPolicy', {
                    ageType: 'CHD',
                    lowestPrice: 'true',
                    policys: this.cardObj.policys
                }).then(res => {
                    console.log(res)
                    let sign = ''
                    for (let key in res.data.ow_data) {
                        sign = res.data.ow_data[key].cabins[0].salePrices[0].sign
                        break
                    }
                    this.orderObj.prices[0].sign = sign
                    this.postOrder()
                }).catch(err => {
                    console.log(err)
                })
            } else { // 所以总共有三种订票形式，成人订票，成人加婴儿，儿童
                this.orderObj.prices[0].ageType = 'ADT'
                this.$http.post('/orders/orderPolicy', {
                    ageType: 'ADT',
                    lowestPrice: 'true',
                    policys: this.cardObj.policys
                }).then(res => {
                    console.log(res)
                    let sign = ''
                    for (let key in res.data.ow_data) {
                        sign = res.data.ow_data[key].cabins[0].salePrices[0].sign
                        break
                    }
                    this.orderObj.prices[0].sign = sign
                    this.postOrder()
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        postOrder () { // 发送订票请求
            console.log(this.orderObj)
            this.$http.post('/orders/dps', this.orderObj)
                .then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        this.$router.replace({path: '/order'})
                        // this.$router.replace({path: '/orderDetail', query: {order_id: res.data.order_id}})
                    } else {
                        this.loading = false
                        this.$message(res.data.message)
                    }
                }).catch((error) => {
                    this.loading = false
                    this.$message.error(error)
                    console.log(error)
                })
        },
        roundOff (n) { // 腾邦那边要求的数据格式，舍掉个位数
            return Math.round(n / 10) * 10
        },
        isIDCard (cardNo) { // 判断是否为身份证号码
            let zoneNum = new Map([
                [11, '北京'],
                [12, '天津'],
                [13, '河北'],
                [14, '山西'],
                [15, '内蒙古'],
                [21, '辽宁'],
                [22, '吉林'],
                [23, '黑龙江'],
                [31, '上海'],
                [32, '江苏'],
                [33, '浙江'],
                [34, '安徽'],
                [35, '福建'],
                [36, '江西'],
                [37, '山东'],
                [41, '河南'],
                [42, '湖北'],
                [43, '湖南'],
                [44, '广东'],
                [45, '广西'],
                [46, '海南'],
                [50, '重庆'],
                [51, '四川'],
                [52, '贵州'],
                [53, '云南'],
                [54, '西藏'],
                [61, '陕西'],
                [62, '甘肃'],
                [63, '青海'],
                [64, '新疆'],
                [71, '台湾'],
                [81, '香港'],
                [82, '澳门'],
                [91, '外国']
            ])
            const PARITYBIT = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
            const POWER_LIST = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            if (cardNo === null || cardNo.length !== 18) {
                return false
            }
            const cs = cardNo.toUpperCase().split('')
            let power = 0
            for (let i = 0; i < cs.length; i++) {
                if (i === cs.length - 1 && cs[i] === 'X') {
                    break
                }
                if (cs[i] < '0' || cs[i] > '9') {
                    return false
                }
                if (i < cs.length - 1) {
                    power += (cs[i] - '0') * POWER_LIST[i]
                }
            }
            // 校验区位码
            if (!zoneNum.has(parseInt(cardNo.substring(0, 2)))) {
                return false
            }
            // 校验年份
            const year = parseInt(cardNo.substring(6, 10))
            const nowYear = (new Date()).getFullYear()
            if (year < 1900 || year > nowYear) {
                return false
            }
            // 校验月份
            const month = parseInt(cardNo.substring(10, 12))
            if (month < 1 || month > 12) {
                return false
            }
            // 校验天数
            const day = parseInt(cardNo.substring(12, 14))
            if (day < 1 || day > 31) {
                return false
            }
            // 校验’校验码‘
            return cs[cs.length - 1] === PARITYBIT[power % 11]
        }
    },
    created () {
        let queryObj = this.$route.query
        this.cardObj = JSON.parse(decodeURIComponent(queryObj.cardObj))
        this.orderObj = JSON.parse(decodeURIComponent(queryObj.orderObj))
        // this.cardObj = JSON.parse(queryObj.cardObj)
        // this.orderObj = JSON.parse(queryObj.orderObj)
        this.$http.get('/users', {
            params: {
                page_size: 10000
            }
        }).then((res) => {
            this.userList = res.data.results
        }).catch((error) => {
            console.log(error)
        })
    },
    beforeDestory () {
        console.log('leaving--------------------')
    }
}
</script>

<style scoped>
    .main-content {
        display: flex;
        padding: 10px;
    }
    .order-left, .order-right {
        flex-grow: 1;
        margin: 0 5px;
    }
    .search-block {
        border-bottom: 1px solid #Dfdfdf;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }
    .friend-block__head, .passenger-block__head {
        font-weight: bold;
    }
    .friend-block__head_sub {
        font-weight: normal;
        font-size: 15px;
    }
    .friend-block__card {
        border-radius: 0;
        background-color: #f5f5f5;
        margin: 5px 0;
    }
    .friend-block__card_host {
        margin-bottom: 5px;
        font-size: 18px;
    }
    .passenger-block {
        margin-top: 20px;
    }
    .passenger-block__card {
        border-radius: 0;
        background-color: rgb(250, 232, 232);
        padding: 15px;
        margin: 5px;
        display: flex;
        align-items: center;
        /* justify-content: space-between; */
    }
    .passenger-block__card:hover {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        position: relative;
    }
    .passenger-block__card_left {
        flex-grow: 1;
    }
    .passenger-block__card_middle {
        flex-grow: 6;
    }
    .passenger-block__card_right {
        flex-grow: 3;
    }
    .passenger-block__card_middle > .line {
        margin: 10px 0;
    }
    .passenger-block__card_middle > .line > .label {
        display: inline-block;
        width: 100px;
    }
    .passenger-block__card_middle > .line > .detail {
        margin-left: 5px;
        display: inline-block;
        width: 200px;
        border-bottom: 1px solid black;
    }
    .passenger-block__card_right > .line > .type {
        margin-right: 10px;
    }
    .select-block__choice {
        margin: 10px;
    }
    .ticket-card {
        width: 450px;
        background-color: #f4f8f9;
        border: 1px solid #d7dce0;
        border-radius: 0;
        text-align: center;
        padding-top: 10px;
    }
    .ticket-card__head_title > span {
        margin: 10px;
        font-size: 24px;
        font-weight: bold;
    }
    .ticket-card__head_sub {
        margin: 5px 0;
        font-size: 16px;
    }
    .ticket-card__head_sub > span {
        color: #88949a;
        margin: 0 3px;
    }
    .ticket-card__journey {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .ticket-card__journey_left > .clock, .ticket-card__journey_right > .clock {
        font-size: 30px;
    }
    .ticket-card__journey_left > .airport, .ticket-card__journey_right > .airport {
        font-size: 12px;
    }
    .ticket-card__journey_middle {
        padding: 0 20px;
        margin-top: -10px;
        flex-grow: 1;
    }
    .ticket-card__journey_middle > .line {
        border-top: 1px solid black;
        width: 100%;
    }
    .ticket-card__journey_middle > .line::after {
        content: '';
        display: block;
        float: right;
        width: 10px;
        border-top: inherit;
        transform: rotate(30deg);
        margin-top: -3px
    }
    .ticket-card__content {
        background: white;
        margin: 20px;
        padding: 10px;
    }
    .ticket-card__content_line {
        margin: 10px;
        height: 30px;
        line-height: 30px;
    }
    .ticket-card__content_line > .line {
        font-size: 18px;
        display: flex;
        justify-content: space-between;
    }
    .ticket-card__content_line > p.total-price {
        text-align: right;
        font-size: 30px;
        color: red;
    }
    .el-icon-edit:hover {
        cursor: pointer;
        color: red;
    }
    .age-alert {
        font-size: 14px;
        color: red;
        float: right;
    }
</style>
