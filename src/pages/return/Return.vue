<template lang='pug'>
    div.div1
        el-card
            .clearfix(slot='header')
                span 返现提现总额
                .search-bar(style='float: right')
                    span(style='margin-right: 10px') 时间范围
                    el-date-picker(v-model='dateRange', @change='getWithdraw', size='small', type='daterange', align='right', unlink-panels, range-separator='至', start-placeholder='开始日期', end-placeholder='结束日期', :picker-options='pickerOptions', value-format='yyyy-MM-dd')
            el-card(style='width: 400px; background-color: #409EFF')
                h3.title 累计返现
                p.amount
                    span.amount__logo ￥
                    span.amount__num {{amount}}
            el-table(:data='returnDetail', v-loading='loading', style='width: 100%')
                el-table-column(label='目标用户', prop='name', align='center')
                el-table-column(label='账户', prop='account', :formatter='accountForm', align='center')
                //- el-table-column(label='订单ID', prop='order_no', align='center')
                el-table-column(label='创建日期', prop='date_created', :formatter='dateForm', align='center')
                el-table-column(label='提现总额', prop='amount', :formatter='amountForm', align='center')
                el-table-column(label='目标账户类型', prop='type', :formatter='typeForm', align='center')
                el-table-column(label='提现结果', prop='succeeded', :formatter='resultForm', align='center')
</template>

<script>
export default {
    data () {
        return {
            loading: false,
            dateRange: [],
            returnDetail: [],
            amount: 0,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }
        }
    },
    methods: {
        accountForm (row, column) { // 尾缀带Form的都是element表格进行数据格式化的
            if (row.account.length > 12) {
                return '微信openid'
            } else {
                return row.account
            }
        },
        dateForm (row, column) {
            return row.date_created.substr(0, 10)
        },
        resultForm (row, column) {
            if (row.succeeded === true) {
                return '成功'
            } else {
                return '失败'
            }
        },
        typeForm (row, column) {
            if (row.type === 1) {
                return '微信'
            } else if (row.type === 2) {
                return '支付宝'
            } else {
                return '其他'
            }
        },
        amountForm (row, column) {
            return '￥' + row.amount
        },
        getWithdraw () { // 获取返现信息
            this.loading = true
            if (this.dateRange === null) this.dateRange = []
            this.$http.get('/users/withdrawal', {
                params: {
                    start_time: this.dateRange[0],
                    end_time: this.dateRange[1]
                }
            }).then(res => {
                this.returnDetail = res.data.details
                this.amount = res.data.amount
                this.loading = false
            }).catch(error => {
                this.loading = false
                console.log(error)
            })
        }
    },
    created () {
        this.getWithdraw()
    }
}
</script>

<style scoped>
.title {
    font-weight: bold;
    margin-bottom: 10px;
}
.amount__num {
    font-size: 30px;
}
</style>
