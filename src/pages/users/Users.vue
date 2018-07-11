<template lang='pug'>
    div
        el-card
            .clearfix(slot='header')
                span 用户信息列表
                    //- inputEdit(type='number', inputData='1324')
                .methods-right
                    el-input(v-model='searchData', style='width: 200px; margin-right: 10px;', size='small', type='tel', placeholder='输入机主号码搜索', @keyup.enter.native='searchUser')
                    el-button(type='success', size='small', @click='searchUser') 搜索机主
            .user-table
                .table-head
                    el-row(:gutter='10', style='width: 100%')
                        el-col(:span='2')
                            .table-head__item 昵称
                        el-col(:span='2')
                            .table-head__item 手机
                        //- el-col(:span='3')
                        //-     .table-head__item 身份证信息
                        el-col(:span='5')
                            .table-head__item 关联旅客
                        el-col(:span='3')
                            .table-head__item 通讯地址
                        el-col(:span='3')
                            .table-head__item 邮箱地址
                        el-col(:span='3')
                            .table-head__item 发票信息
                        el-col(:span='2')
                            .table-head__item 操作
                .table-body(v-loading='loading', v-if='userData.length > 0')
                    .table-body__block(v-if='(typeof userData) !== "string"')
                        .host-line(v-for='(item, index) in userData', :class='{"host-line__hide": item.hidden}')
                            el-row(:gutter='10', style='width: 100%')
                                el-col.host-line__element(:span='2')
                                    .host-line__item {{item.nickname}}
                                el-col.host-line__element(:span='2')
                                    .host-line__item {{item.phone}}
                                //- el-col.host-line__element(:span='3')
                                //-     .host-line__item {{item.thisID}}
                                el-col.host-line__element(:span='5')
                                    .host-line__item
                                        el-card.edit-card.friend(v-for='(item_ctc, index_ctc) in item.contacts', :key='index_ctc', :body-style="{padding: '10px'}")
                                            .friend__name.friend__item
                                                span.friend__item_label 姓名：
                                                span {{item_ctc.name}}
                                            .friend__phone.friend__item
                                                span.friend__item_label 手机：
                                                span {{item_ctc.phone}}
                                            .friend__id.friend__item
                                                span.friend__item_label ID：
                                                span {{item_ctc.card_number}}
                                            .edit-card__btn
                                                i.el-icon-edit-outline.icon_text(title='编辑', @click='editContact(item_ctc, item.id)')
                                        .add-friend
                                            el-button.btn-add(@click='addContact(item.id)')
                                                i.el-icon-plus
                                el-col.host-line__element(:span='3')
                                    .host-line__item
                                        .address(v-for='(item_addr, index_addr) in item.Address')
                                            span
                                                //- inputEdit(v-model='userData[index].Address[index_addr]')
                                                el-card.edit-card(:body-style="{padding: '10px'}") {{userData[index].Address[index_addr]}}
                                                    .edit-card__btn
                                                        i.el-icon-edit-outline.icon_text(title='编辑', @click='')
                                        .add-address
                                            el-button.btn-add(@click='addAddress(item)')
                                                i.el-icon-plus
                                el-col.host-line__element(:span='3')
                                    .host-line__item
                                        .host-line__item {{item.email}}
                                        //- .email(v-for='(item_email, index_email) in item.Email')
                                        //-     span
                                        //-         //- inputEdit(v-model='userData[index].Email[index_email]')
                                        //-         el-card.edit-card(:body-style="{padding: '10px'}") {{userData[index].Email[index_email]}}
                                        //-             .edit-card__btn
                                        //-                 i.el-icon-edit-outline.icon_text(title='编辑', @click='')
                                        //- .add-email
                                        //-     el-button.btn-add
                                        //-         i.el-icon-plus
                                el-col.host-line__element(:span='3')
                                    .host-line__item
                                        el-card.edit-card.invoice(v-for='(item_invo, index_invo) in item.Invoice', :body-style="{padding: '10px'}", :key='index_invo')
                                            .invoice__title
                                                span {{item_invo.Title}}
                                            .invoice__num
                                                span {{item_invo.taxNo}}
                                            .edit-card__btn
                                                i.el-icon-edit-outline.icon_text(title='编辑', @click='')
                                        .add-invoice
                                            el-button.btn-add
                                                i.el-icon-plus
                                el-col.host-line__element(:span='2')
                                    .host-line__item(style='float: left; min-width: 150px')
                                        el-button(type='danger', size='mini', @click='hostEdit(item)') 编辑
                                        el-button(type='warning', size='mini', @click='item.hidden=!item.hidden', v-if='item.contacts.length>0')
                                            span(v-if='item.hidden') 展开
                                            span(v-else) 收起
                        .page-block
                            el-pagination(layout='prev, pager, next', :page-count='page.total_pages', :current-page='page.page_num', @current-change='pageChange')
                div(v-else)
                    p 未找到相关用户信息，请检查输入信息是否有误
            el-dialog(title='编辑用户', :visible.sync='editModel', width='30%', close-on-click-modal=false)
                .content
                    el-form(ref='formEditUser', :model='formEditUser', :rules='ruleEditUser', label-width='80px', label-position='right')
                        el-form-item(label='手机', prop='phone')
                            el-input(v-model='formEditUser.phone', disabled)
                        el-form-item(label='昵称', prop='nickname')
                            el-input(v-model='formEditUser.nickname')
                        el-form-item(label='登录名', prop='username')
                            el-input(v-model='formEditUser.username', disabled)
                        el-form-item(label='Email', prop='email')
                            el-input(v-model='formEditUser.email')
                span.dialog-footer(slot='footer')
                    el-button(@click='editCancel') 取消
                    el-button(type='primary', @click='editConfirm("formEditUser")') 确定
            .user-model
                el-dialog(title='联系人', :visible.sync='modelData.editContact', width='30%')
                    el-form(ref='formContact', :model='formContact', :rules='ruleContact', label-width='80px')
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
                        el-button(@click='ctcDelete', v-if='formContact.id') 删除
                        el-button(type='primary', @click='ctcConfirm("formContact")') 保存
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
                callback(new Error('电话号码格式错误，请仔细核对'))
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
            show: false,
            loading: false,
            userData: [],
            editModel: false,
            modelData: {
                editContact: false,
                addressEdit: false,
                emailEdit: false,
                invoiceEdit: false
            },
            formEditUser: {
                email: ''
            },
            ruleEditUser: {
                email: [
                    {type: 'email', required: false, message: '邮箱格式错误', trigger: 'blur'}
                ]
            },
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
            },
            page: {
                page_num: null,
                total_pages: null,
                total_items: null
            },
            searchData: ''
        }
    },
    methods: {
        searchUser () { // 搜索用户
            if (this.searchData !== '') {
                this.loading = true
                this.$http.get('/users', {
                    params: {
                        phone: this.searchData
                    }
                }).then((res) => {
                    console.log(res.data)
                    let temp = res.data.results
                    for (let i in temp) {
                        temp[i].hidden = true
                    }
                    this.userData = temp
                    this.loading = false
                    this.page.page_num = res.data.page_num
                    this.page.total_pages = res.data.total_pages
                    this.page.total_items = res.data.total_items
                }).catch((error) => {
                    console.log(error)
                })
            } else {
                // this.$message('请输入机主手机号码')
                this.getUserData()
            }
        },
        hostEdit (item) { // 准备编辑机主信息
            this.editModel = true
            this.formEditUser = Object.assign({}, item)
        },
        getUserData (page = 1) { // 获取用户列表
            let _this = this
            this.loading = true
            this.$http.get('/users', {
                params: {
                    page: page
                }
            }).then((res) => {
                console.log(res.data)
                let temp = res.data.results
                for (let i in temp) {
                    temp[i].hidden = true
                }
                _this.userData = temp
                _this.loading = false
                _this.page.page_num = res.data.page_num
                _this.page.total_pages = res.data.total_pages
                _this.page.total_items = res.data.total_items
            }).catch((error) => {
                console.log(error)
            })
        },
        pageChange (page) {
            this.getUserData(page)
        },
        editConfirm (name) { // 机主信息编辑确认
            let _this = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$http.patch('/users/' + _this.formEditUser.id, {
                        nickname: _this.formEditUser.nickname,
                        email: _this.formEditUser.email
                    }).then((res) => {
                        _this.editModel = false
                        _this.loading = true
                        _this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                        _this.getUserData(_this.page.page_num)
                    }).catch((error) => {
                        console.log(error)
                    })
                } else {
                    this.$message('邮箱格式错误')
                }
            })
        },
        editCancel (name) { // 取消编辑
            this.formEditUser = {}
            this.editModel = false
            this.$message('取消编辑')
        },
        editContact (item, id) { // 编辑联系人
            if (this.$refs['formContact']) {
                this.$refs['formContact'].resetFields()
            }
            this.modelData.editContact = true
            this.formContact.host_id = id
            this.formContact.id = item.id
            this.formContact.phone = item.phone
            this.formContact.name = item.name
            this.formContact.sex = item.sex
            this.formContact.card_type = item.card_type
            this.formContact.card_number = item.card_number
            this.formContact.birthday = item.birthday.substr(0, 10)
        },
        addContact (id) { // 增加联系人
            if (this.$refs['formContact']) {
                this.$refs['formContact'].resetFields()
            }
            this.modelData.editContact = true
            this.formContact.host_id = id
            this.formContact.id = ''
            this.formContact.phone = ''
            this.formContact.name = ''
            this.formContact.sex = 1
            this.formContact.card_type = 'NI'
            this.formContact.card_number = ''
            this.formContact.birthday = ''
        },
        ctcConfirm (name) { // 确认增加联系人
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.formContact.card_type === 'NI') {
                        let d = this.formContact.card_number.substring(6, 10) + '-' + this.formContact.card_number.substring(10, 12) + '-' + this.formContact.card_number.substring(12, 14)
                        this.formContact.birthday = new Date(d)
                        console.log(this.formContact.birthday, d)
                    }
                    if (this.formContact.id) {
                        console.log('====================', this.formContact.birthday)
                        this.$http.patch('/users/contacts/' + this.formContact.id, {
                            name: this.formContact.name,
                            phone: this.formContact.phone || null,
                            card_type: this.formContact.card_type,
                            card_number: this.formContact.card_number,
                            sex: this.formContact.sex,
                            birthday: this.formContact.birthday + 'T00:00',
                            owner: this.formContact.host_id
                        }).then((res) => {
                            this.modelData.editContact = false
                            this.loading = true
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.getUserData(this.page.page_num)
                        }).catch((error) => {
                            console.log(error)
                        })
                    } else {
                        this.$http.post('/users/contacts', {
                            name: this.formContact.name,
                            phone: this.formContact.phone || null,
                            card_type: this.formContact.card_type,
                            card_number: this.formContact.card_number,
                            sex: this.formContact.sex,
                            birthday: this.formContact.birthday + 'T00:00',
                            owner: this.formContact.host_id
                        }).then((res) => {
                            this.modelData.editContact = false
                            this.loading = true
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            this.getUserData(this.page.page_num)
                        }).catch((error) => {
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
                            this.modelData.editContact = false
                            this.loading = true
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.getUserData(this.page.page_num)
                        }).catch((error) => {
                            console.log(error)
                        })
                }).catch((error) => {
                    console.log(error)
                })
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
                console.log('false No.1')
                return false
            }
            const cs = cardNo.toUpperCase().split('')
            let power = 0
            for (let i = 0; i < cs.length; i++) {
                if (i === cs.length - 1 && cs[i] === 'X') {
                    break
                }
                if (cs[i] < '0' || cs[i] > '9') {
                    console.log('false No.2')
                    return false
                }
                if (i < cs.length - 1) {
                    power += (cs[i] - '0') * POWER_LIST[i]
                }
            }
            // 校验区位码
            if (!zoneNum.has(parseInt(cardNo.substring(0, 2)))) {
                console.log('false No.3')
                return false
            }
            // 校验年份
            const year = parseInt(cardNo.substring(6, 10))
            const nowYear = (new Date()).getFullYear()
            if (year < 1900 || year > nowYear) {
                console.log('false No.4')
                return false
            }
            // 校验月份
            const month = parseInt(cardNo.substring(10, 12))
            if (month < 1 || month > 12) {
                console.log('false No.5')
                return false
            }
            // 校验天数
            const day = parseInt(cardNo.substring(12, 14))
            if (day < 1 || day > 31) {
                console.log('false No.6')
                return false
            }
            // 校验’校验码‘
            console.log('false No.7', cs[cs.length - 1], PARITYBIT[power % 11])
            return cs[cs.length - 1] === PARITYBIT[power % 11]
        }
    },
    created () {
        this.getUserData()
    }
}
</script>

<style scoped>
    .methods-right {
        float: right;
    }
    .methods::after {
        content: '';
        display: block;
        clear: both;
    }

    .table-head, .host-line {
        display: flex;
        /* justify-content: space-between; */
    }
    .table-head {
        padding-bottom: 5px;
        margin-bottom: 15px;
        font-size: 18px;
        font-weight: bold;
        border-bottom: 1px solid black
    }
    .table-head__item {
        /* background-color: red; */
        text-align: center;
    }
    /* table-body */
    .host-line {
        padding: 10px 0;
        border-bottom: 1px solid #dfdfdf;
        transition: all 200ms linear 0ms;
    }
    .host-line:hover {
        position: relative;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)
    }
    .host-line__hide {
        height: 24px;
        overflow: hidden;
    }
    .host-line__item {
        text-align: center;
        /* background-color: red; */
    }
    .host-line__element {
        min-height: 10px;
    }
    .friend {
        /* display: flex; */
        position: relative;
        /* margin-bottom: 5px; */
    }
    .friend__item {
        margin-bottom: 2px;
    }
    .friend__item_label {
        width: 50px;
        display: inline-block;
    }
    .friend > .friend__name {
        width: 60px;
    }
    .friend > .friend__phone {
        width: 100px;
    }
    .friend > .friend__id {
        width: 120px;
    }
    .btn-add {
        padding: 2px 10px;
    }
    .edit-card {
        cursor: pointer;
        margin-bottom: 5px;
        background: #fdfdfd;
        font-size: 15px;
        position: relative;
        padding-right: 20px;
        text-align: left;
    }
    .edit-card__btn > .icon_text {
        font-size: 20px;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
    }
    .edit-card__btn > .icon_text:hover {
        color: #2db7f5;
    }
    .page-block {
        text-align: center;
        margin-top: 10px;
    }
</style>
