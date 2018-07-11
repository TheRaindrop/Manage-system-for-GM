<template lang='pug'>
    div
        el-card
            .clearfix(slot='header')
                span VIP价格设置
                span.authority-alert (提示：只有超级管理员可以进行操作)
            template(v-for='(value, key) in vipData')
                el-card(style='width: 400px')
                    span.title(v-if='key === "voucher_price_1"') 特殊通道价格:
                    span.title(v-else-if='key === "voucher_price_2"') 休息室价格:
                    span.title(v-else-if='key === "voucher_price_3"') 贵宾厅价格:
                    span &nbsp{{value}}&nbsp;G币
                    el-button.operation(size='mini', type='success', @click='modifyVipData(value, key)') 编辑
        el-dialog(:title='dialogTitle', :visible.sync='dialogVip', width='30%', :before-close='handleClose')
            el-input(v-model.number='editData', type='number')
            span(slot='footer')
                el-button(@click='dialogVip = false') 取消
                el-button(@click='modifyConfirm', type='primary') 确定
</template>

<script>
export default {
    data () {
        return {
            vipData: {},
            dialogTitle: '',
            dialogVip: false,
            editData: 0,
            editProp: '',
            modifyData: {}
        }
    },
    methods: {
        getVipData () { // 获取贵宾厅数据
            this.$http.get('/sysinfo')
                .then((res) => {
                    console.log(res.data)
                    this.vipData = res.data
                }).catch((error) => {
                    console.log(error)
                })
        },
        modifyVipData (value, key) { // 编辑
            this.dialogVip = true
            switch (key) {
            case 'voucher_price_1':
                this.dialogTitle = '快速通道价格编辑'
                break
            case 'voucher_price_2':
                this.dialogTitle = '休息室价格编辑'
                break
            case 'voucher_price_3':
                this.dialogTitle = '全套价格编辑'
                break
            default:
                this.dialogTitle = '编辑'
            }

            this.editProp = key
            this.editData = value
        },
        modifyConfirm () { // 上传修改
            let o = {}
            o[this.editProp] = this.editData
            this.$http.patch('/sysinfo', o)
                .then((res) => {
                    this.dialogVip = false
                    this.getVipData()
                    console.log(res)
                }).catch((error) => {
                    console.log(error)
                })
        },
        handleClose () {
            this.$confirm('取消编辑？')
                .then(() => {
                    this.dialogVip = false
                }).catch(() => {})
        }
    },
    created () {
        this.getVipData()
    }
}
</script>

<style scoped>
.title {
    display: inline-block;
    width: 110px;
    text-align: right;
}
.operation {
    margin-left: 20px;
}
.authority-alert {
    font-size: 13px;
    margin-left: 10px;
    color: red;
}
</style>
