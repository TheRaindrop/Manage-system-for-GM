<template lang='pug'>
    div
        el-card
            el-breadcrumb(separator-class='el-icon-arrow-right')
                el-breadcrumb-item(to='/order') 订单
                el-breadcrumb-item 订单详情
        el-card(v-if='orderDetail !== {} && orderDetail.owner !== undefined')
            p.title(v-if='orderDetail.air_orders')
                span(v-if='orderDetail.air_orders.length > 0') 机票订单
                span(v-else-if='orderDetail.hotel_orders.length > 0') 酒店订单
                span(v-else) 订单类型未知
            el-row.order-row(:gutter='10')
                el-col(:span='3')
                    span 订单状态
                el-col(:span='3')
                    span {{orderDetail.status}}
            el-row.order-row(:gutter='10')
                el-col(:span='3')
                    span 机主昵称
                el-col(:span='3')
                    span {{orderDetail.owner.nickname}}
            el-row.order-row(:gutter='10')
                el-col(:span='3')
                    span 机主手机
                el-col(:span='3')
                    span {{orderDetail.owner.phone}}
            el-row.order-row(:gutter='10')
                el-col(:span='3')
                    span 创建日期
                el-col(:span='3', v-if='orderDetail.date_created')
                    span {{orderDetail.date_created.substr(0, 10)}}
            el-row.order-row(:gutter='10')
                el-col(:span='3')
                    span 创建人
                el-col(:span='3')
                    span {{orderDetail.created_by}}
            el-row.order-row(:gutter='10')
                el-col(:span='3')
                    span 订单ID
                el-col(:span='3')
                    span {{orderDetail.order_no}}
            el-row.order-row(:gutter='10')
                el-col(:span='3')
                    span 订单总额
                el-col(:span='3')
                    span {{orderDetail.payAmount}}
            el-row.order-row(:gutter='10', v-if='orderDetail.canceled_by !== null')
                el-col(:span='3')
                    span 取消人
                el-col(:span='3')
                    span {{orderDetail.canceled_by}}
            el-row.order-row(:gutter='10', v-if='orderDetail.canceled_date !== null')
                el-col(:span='3')
                    span 取消日期
                el-col(:span='3')
                    span {{orderDetail.canceled_date.substr(0, 10)}}
</template>

<script>
// 废弃了
export default {
    data () {
        return {
            orderDetail: {}
        }
    },
    methods: {
    },
    created () {
        let query = this.$route.query
        console.log(query)
        this.$http.get('/orders/' + query.order_id)
            .then((res) => {
                this.orderDetail = res.data
            }).catch((error) => {
                console.log(error)
            })
    }
}
</script>

<style scoped>
    .order-row {
        background: #dcdfe6;
        margin: 2px 0;
        padding: 12px;
        border-radius: 6px;
    }
    .title {
        font-size: 25px;
        margin-bottom: 15px;
    }
</style>
