<template lang='pug'>
    div
        el-tabs(type='border-card')
            el-tab-pane(label='待处理发票')
                el-table(:data='waitInvo', style='width: 100%')
                    el-table-column(prop='name', label='申请人')
                    el-table-column(prop='phone', label='联系电话')
                    el-table-column(prop='sum', label='发票金额')
                    el-table-column(prop='content', label='发票内容')
                    el-table-column(prop='address', label='邮寄地址')
                    el-table-column(prop='email', label='邮箱')
                    el-table-column(prop='orderNo', label='关联订单号')
                    el-table-column(label='发票处理')
                        template(slot-scope='scope')
                            el-button(size='small', type='primary') 操作
            el-tab-pane(label='未到期发票') 未到期发票
            el-tab-pane(label='全部发票') 全部发票
</template>

<script>
// import hotelCity from '../../../../static/hotelCity.js'
export default {
    data () {
        return {
            waitInvo: [
                {
                    name: '张宗昌',
                    phone: '123333333',
                    sum: 899,
                    content: '大炮开兮',
                    address: '大东北',
                    email: '234@qq.com',
                    orderNo: '3241321421'
                },
                {
                    name: '张宗昌',
                    phone: '123333333',
                    sum: 899,
                    content: '大炮开兮',
                    address: '大东北',
                    email: '234@qq.com',
                    orderNo: '3241321421'
                },
                {
                    name: '张宗昌',
                    phone: '123333333',
                    sum: 899,
                    content: '大炮开兮',
                    address: '大东北',
                    email: '234@qq.com',
                    orderNo: '3241321421'
                },
                {
                    name: '张宗昌',
                    phone: '123333333',
                    sum: 899,
                    content: '大炮开兮',
                    address: '大东北',
                    email: '234@qq.com',
                    orderNo: '3241321421'
                }
            ],
            hot: null
        }
    },
    created () {
        // console.log(hotelCity)
        // let hc = hotelCity.hotelCity
        // let hot = hotelCity.hotelCity_hotData
        // let arr1 = hc.split('@')
        // let citys = []
        // let hotCitys = {}
        // for (let item of arr1) {
        //     if (item === '') {
        //         continue
        //     } else {
        //         let ob = {}
        //         let arr = item.split('|')
        //         ob.cityPinyin = arr[0]
        //         ob.cityNameCN = arr[1]
        //         ob.cityCode = arr[3]
        //         citys.push(ob)
        //     }
        // }
        // console.log(citys)
        // document.write(citys)
        // for (let item in hot) {
        //     let arr = hot[item].split('@')
        //     hotCitys[item] = []
        //     for (let i of arr) {
        //         if (i === '') {
        //             continue
        //         } else {
        //             let ob = {}
        //             let arr2 = i.split('|')
        //             ob.cityPinyin = arr2[0]
        //             ob.cityNameCN = arr2[1]
        //             hotCitys[item].push(ob)
        //         }
        //     }
        // }
        // this.hot = hotCitys
        // console.log(hotCitys)
        // this.$http.post('/dssf', {
        //     hotCitys
        // })
    }
}
</script>

<style scoped>

</style>
