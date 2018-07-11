<template lang='pug'>
    .sidebar
        el-menu(:default-active='defaultActive', style='min-height: 100%;', text-color='#bfcbd9', active-text-color='yellow', background-color='#324057', router=true)
            el-menu-item(index='/home')
                i.el-icon-star-on
                span(slot='title') 首页
            el-submenu(index='1')
                template(slot='title')
                    i.el-icon-upload
                    span 机票
                el-menu-item(index='/flight') 机票查询
                //- el-menu-item(index='/flightContact') 机票预定
            el-submenu(index='2')
                template(slot='title')
                    i.el-icon-location
                    span 酒店
                el-menu-item(index='/hotel') 酒店查询
                //- el-menu-item(index='/2-2') 酒店订单2
            el-submenu(index='3')
                template(slot='title')
                    i.el-icon-document
                    span 订单
                el-menu-item(index='/order') 订单查询
            el-submenu(index='4')
                template(slot='title')
                    i.el-icon-bell
                    span 用户管理
                el-menu-item(index='/users') 用户列表
            el-submenu(index='5')
                template(slot='title')
                    i.el-icon-message
                    span G币贵宾厅
                el-menu-item(index='/gCoin') G币机型设置
                el-menu-item(index='/vipHall') 贵宾厅管理
            el-submenu(index='7')
                template(slot='title')
                    i.el-icon-printer
                    span 返现提现
                el-menu-item(index='/return') 返现总额
                el-menu-item(index='/returnDetail') 用户返现明细
            //- el-menu-item(index='/insurance')
            //-     i.el-icon-star-on
            //-     span(slot='title') Mytest

</template>

<script>
export default {
    data () {
        return {
        }
    },
    computed: {
        defaultActive () {
            return this.$route.path
        }
    },
    created () {
        // console.log(store.state.collapse)
    }
}
</script>

<style scoped>
    .sidebar {
        position: fixed;
        top: 60px;
        bottom: 0;
        left: 0;
        width: 200px;
        /* border-right: 1px solid #2a3542; */
        /* background-color: #324057; */
        z-index: 100;
    }
    .el-menu {
        border-right: none;
    }
    .el-submenu .el-menu .el-menu-item {
        background-color: #1f2d3d !important
    }
</style>
