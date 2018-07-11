<template lang='pug'>
    div
        el-card
            .clearfix(slot='header')
                span G币机型设置
                span.authority-alert (提示：只有超级管理员可以进行操作)
                .methods-right
                    el-button(type='success', size='small', @click='addType') 新增手机型号
            .gcoin-table
                el-table(:data='gcoinData', style='100%', v-loading='gTableLoading')
                    el-table-column(prop='type', label='手机型号', align='center')
                    el-table-column(prop='initial_g', label='初始G币', align='center')
                    el-table-column(prop='air_benefit', label='机票补贴', align='center')
                    el-table-column(prop='hotel_benefit', label='酒店补贴', align='center')
                    el-table-column(prop='free_voucher_times', label='贵宾厅免费使用次数', align='center')
                    el-table-column(prop='withdrawal_days', label='入住后几天返现', align='center')
                    el-table-column(label='操作', align='center', width='200')
                        template(slot-scope='scope')
                            el-button(type='primary', size='mini', @click='modifyType(scope.row)') 修改
                            el-button(type='danger', size='mini', @click='deleteType(scope.row.id)') 删除机型
        el-dialog(:title='dialogTitle', :visible.sync='dialogGcoin', width='30%')
            el-form(ref='formGcoin', :model='formGcoin', label-width='80px', label-position='top')
                el-form-item(label='手机型号', prop='type')
                    el-input(v-model='formGcoin.type')
                el-form-item(label='初始G币', prop='initial_g')
                    el-input(v-model.number='formGcoin.initial_g', type='number')
                el-form-item(label='机票补贴', prop='air_benefit')
                    el-input(v-model.number='formGcoin.air_benefit', type='number')
                el-form-item(label='酒店补贴', prop='hotel_benefit')
                    el-input(v-model.number='formGcoin.hotel_benefit', type='number')
                el-form-item(label='贵宾厅免费使用次数', prop='free_voucher_times')
                    el-input(v-model.number='formGcoin.free_voucher_times', type='number')
                el-form-item(label='入住后几天返现', prop='withdrawal_days')
                    el-input(v-model.number='formGcoin.withdrawal_days', type='number')
            span(slot='footer', class='dialog-footer')
                el-button(@click='dialogGcoin = false') 取消
                template(v-if='dialogTitle === "增加机型"')
                    el-button(@click='addConfirm', type='primary') 确认添加
                template(v-else-if='dialogTitle === "修改设置"')
                    el-button(@click='modifyConfirm', type='primary') 确认修改
</template>

<script>
export default {
    data () {
        return {
            gTableLoading: false,
            dialogGcoin: false,
            dialogTitle: '',
            gcoinData: [],
            formGcoin: {
                id: '',
                type: '',
                initial_g: 0,
                air_benefit: 0,
                hotel_benefit: 0,
                free_voucher_times: 0,
                withdrawal_days: 0
            }
        }
    },
    methods: {
        operateSuccess () { // 成功提示
            this.$message({
                message: '操作成功',
                type: 'success'
            })
        },
        getGcoinData () { // 获取G币数据
            this.gTableLoading = true
            this.$http.get('/mobiles')
                .then((res) => {
                    this.gcoinData = res.data
                    this.gTableLoading = false
                }).catch((error) => {
                    console.log(error)
                })
        },
        addType () { // 添加机型
            Reflect.deleteProperty(this.formGcoin, 'id')
            // this.formGcoin.id = ''
            this.dialogTitle = '增加机型'
            this.formGcoin.type = ''
            this.formGcoin.initial_g = 0
            this.formGcoin.air_benefit = 0
            this.formGcoin.hotel_benefit = 0
            this.formGcoin.free_voucher_times = 0
            this.formGcoin.withdrawal_days = 0
            this.dialogGcoin = true
            // this.$http.post('/mobiles', {
            //     id: ''
            // })
        },
        deleteType (id) { // 删除机型
            this.$confirm('确认删除？')
                .then(() => {
                    this.$http.delete('/mobiles/' + id)
                        .then((res) => {
                            this.getGcoinData()
                            this.operateSuccess()
                        }).catch((error) => {
                            console.log(error)
                        })
                }).catch(() => {})
        },
        modifyType (item) { // 修改配置
            this.dialogTitle = '修改设置'
            this.formGcoin.id = item.id
            this.formGcoin.type = item.type
            this.formGcoin.initial_g = item.initial_g
            this.formGcoin.air_benefit = item.air_benefit
            this.formGcoin.hotel_benefit = item.hotel_benefit
            this.formGcoin.free_voucher_times = item.free_voucher_times
            this.formGcoin.withdrawal_days = item.withdrawal_days
            this.dialogGcoin = true
            console.log('modify', item)
        },
        addConfirm () { // 弹出确认框
            this.$confirm('确认添加？')
                .then(() => {
                    this.$http.post('/mobiles', this.formGcoin)
                        .then((res) => {
                            this.dialogGcoin = false
                            this.getGcoinData()
                            this.operateSuccess()
                        }).catch((error) => {
                            console.log(error)
                        })
                }).catch(() => {})
        },
        modifyConfirm () {
            this.$confirm('确认修改？')
                .then(() => {
                    this.$http.patch('/mobiles/' + this.formGcoin.id, {
                        type: this.formGcoin.type,
                        initial_g: this.formGcoin.initial_g,
                        air_benefit: this.formGcoin.air_benefit,
                        hotel_benefit: this.formGcoin.hotel_benefit,
                        free_voucher_times: this.formGcoin.free_voucher_times,
                        withdrawal_days: this.formGcoin.withdrawal_days
                    }).then((res) => {
                        this.dialogGcoin = false
                        this.getGcoinData()
                        this.operateSuccess()
                    }).catch((error) => {
                        console.log(error)
                    })
                }).catch(() => {})
        }
    },
    created () {
        this.getGcoinData()
    }
}
</script>

<style scoped>
.methods-right {
    float: right;
}
.authority-alert {
    font-size: 13px;
    margin-left: 10px;
    color: red;
}
</style>
