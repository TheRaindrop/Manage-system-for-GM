<template lang='pug'>
    div
        el-card.search(:class="{'search-hide': searchHide}")
            el-form(:inline='true', :model='hotel')
                el-form-item(label='目的地')
                    hotelCityCard(v-model='hotel.destination', @citySelect='hotelCitySelect', @scenicSelect='scenicSelect', cityWidth='200', scenicWidth='300')
                el-form-item(label='日期选择')
                    el-date-picker(v-model='hotel.rangeTime', type='daterange', range-separator='至', start-placeholder='入住日期', end-placeholder='离店日期', value-format="yyyy-MM-dd")
                el-form-item
                    el-button(type='primary', @click='getHotelData()') 查询
        el-card.screening
            el-form(size='mini')
                .screening__line
                    p.screening__line_cdt 价格范围
                    p.screening__line_clear(:class='{"screening__line_selected": condi.price !== ""}', @click='condi.price = ""') 不限
                    el-radio-group(v-model='condi.price')
                        el-radio(label='0-200') 200以下
                        el-radio(label='200-300') 200-300
                        el-radio(label='300-500') 300-500
                        el-radio(label='500-100000') 500以上
                    //- span(style='margin-left: 20px') 自定义:
                    //- el-input(size='mini', style='width: 70px; padding: 0 3px', maxlength='5')
                    //- span -
                    //- el-input(size='mini', style='width: 70px; padding: 0 3px', maxlength='5')
                .screening__line
                    p.screening__line_cdt 酒店级别
                    p.screening__line_clear(:class='{"screening__line_selected": condi.level.length}', @click='condi.level = []') 不限
                    el-checkbox-group(v-model='condi.level')
                        el-checkbox(label='27', name='type') 二星级/其他
                        el-checkbox(label='26', name='type') 三星级/舒适
                        el-checkbox(label='24', name='type') 四星级/高档
                        el-checkbox(label='23', name='type') 五星级/豪华
                .screening__line
                    p.screening__line_cdt 排序方式
                    p.screening__line_clear(:class='{"screening__line_selected": condi.orderBy !== ""}', @click='condi.orderBy = ""') 不限
                    el-select(v-model='condi.orderBy', placeholder='默认排序', size='small', style='width: 200px')
                        el-option(key='1', value='resGradeId_desc', label='低星级优先')
                        el-option(key='2', value='resGradeId_asc', label='高星级优先')
                        el-option(key='3', value='minPrice_desc', label='低价优先')
                        el-option(key='4', value='minPrice_asc', label='高价优先')
                .screening__line
                    p.screening__line_cdt 酒店关键字
                    p.screening__line_clear(:class='{"screening__line_selected": condi.keyword !== ""}', @click='condi.keyword = ""') 不限
                    el-input(style='width: 200px', size='small', v-model='condi.keyword', placeholder='请输入酒店品牌关键字')
                //- .screening__line
                //-     p.screening__line_cdt 连锁品牌
                //-     p.screening__line_clear(:class='{"screening__line_selected": condi.brand.length}', @click='condi.brand=[]') 不限
                //-     el-checkbox-group(v-model='condi.brand')
                //-         el-checkbox(label='1', name='type') 维也纳酒店
                //-         el-checkbox(label='2', name='type') 7天酒店
                //-         el-checkbox(label='3', name='type') 如家快捷酒店
                //-         el-checkbox(label='4', name='type') 汉庭酒店
                //-         el-checkbox(label='5', name='type') 城市便捷酒店
        .loading-block(v-if='loading', v-loading='loading', element-loading-text='若加载时间过长，请重新搜索')
        .main-data(v-else)
            template(v-if='hotelData !== null')
                template(v-for='(item, index) in hotelData')
                    hotelCard(:singleHotel='item', :index='index + 1', :startTime='startTime', :endTime='endTime')
                    div.hotel-hr
            template(v-else)
                div.error 没找到相关酒店信息......
        .page-block
            el-pagination(layout='prev, pager, next', :page-count='page.total_pages', :current-page='page.page_num', @current-change='pageChange')
</template>

<script>
import hotelCard from './HotelCard.vue'
import hotelCityCard from '@/components/HotelCityCard.vue'
export default {
    components: {hotelCard, hotelCityCard},
    data () {
        return {
            searchHide: false,
            hotel: {},
            condi: {
                price: '',
                level: [],
                brand: [],
                orderBy: '',
                keyword: ''
            },
            hotelData: {},
            page: {
                page_num: 1,
                total_pages: 0,
                total_items: 0
            },
            loading: false
        }
    },
    computed: {
        startTime () {
            let time = new Date(this.hotel.rangeTime[0])
            return time.getFullYear() + '-' + (String(time.getMonth() + 1).length === 1 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + (String(time.getDate()).length === 1 ? ('0' + time.getDate()) : (time.getDate()))
        },
        endTime () {
            let time = new Date(this.hotel.rangeTime[1])
            return time.getFullYear() + '-' + (String(time.getMonth() + 1).length === 1 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + (String(time.getDate()).length === 1 ? ('0' + time.getDate()) : (time.getDate()))
        },
        priceList () {
            let arr = []
            if (this.condi.price !== '') {
                let o = {}
                o.priceFrom = parseInt(this.condi.price.split('-')[0])
                o.priceTo = parseInt(this.condi.price.split('-')[1])
                o.rate = 0
                arr.push(o)
            }
            return arr
        }
    },
    methods: {
        getHotelData (page = 1) { // 酒店信息分页，默认获取第一页
            this.loading = true
            this.$http.post('/web/jd/searchHotel', {
                cityCode: this.hotel.destination,
                sectionName: this.hotel.scenicClass === 'cityArea' ? this.hotel.scenic : '',
                businessSectionInfo: this.hotel.scenicClass === 'cityBusinessSectionInfo' ? this.hotel.scenic : '',
                cityScenic: this.hotel.scenicClass === 'cityScenic' ? this.hotel.scenic : '',
                airRailWay: this.hotel.scenicClass === 'cityAirRailWay' ? this.hotel.scenic : '',
                subWay: this.hotel.scenicClass === 'citySubWay' ? this.hotel.scenic : '',
                begin: this.startTime,
                end: this.endTime,
                pageCount: page,
                rowCount: 20,
                saleStatus: 1,
                orderBy: [this.condi.orderBy],
                keyword: this.condi.keyword,
                searchCondition: {
                    brandList: [],
                    hotelLevelList: this.condi.level,
                    priceFromToList: this.priceList
                }
            }).then((res) => {
                // this.hotelData = res.data.data.responseResult
                // this.loading = false
                console.log(res)
                const data = JSON.parse(JSON.stringify(res.data))
                if (Reflect.has(data, 'data')) {
                    this.hotelData = data.data.responseResult ? data.data.responseResult : null
                    this.page.page_num = data.data.pageNumber
                    this.page.total_pages = data.data.totalPatge
                    this.page.total_items = data.data.totalCount
                }
                this.loading = false
            }).catch((error) => {
                console.log(error)
                this.loading = false
                this.hotelData = null
            })
        },
        pageChange (page) { // 页面改动时触发
            this.getHotelData(page)
        },
        hotelCitySelect (item) {
            this.hotel.scenic = ''
        },
        scenicSelect (item, scenicClass) {
            this.hotel.scenic = item
            this.hotel.scenicClass = scenicClass
        }
    },
    created () {
        this.hotel = this.$store.state.hotel
        // this.hotel.scenic = ''
        // this.hotel.scenicClass = ''
        if (this.hotel.rangeTime.length === 0) {
            let now = new Date()
            this.hotel.rangeTime[0] = new Date()
            this.hotel.rangeTime[1] = new Date(now.setDate(now.getDate() + 1))
        }
        this.getHotelData()
    },
    mounted () {
        let _this = this
        function scroll () {
            return {
                left: window.pageXOffset,
                top: window.pageYOffset
            }
        }
        window.onscroll = (function () {
            let sTop = scroll().top
            return function () {
                if (sTop > scroll().top) {
                    // console.log('向上滚动')
                    _this.searchHide = false
                    sTop = scroll().top
                } else if (sTop < scroll().top) {
                    // console.log('向下滚动')
                    _this.searchHide = true
                    sTop = scroll().top
                }
            }
        })()
    },
    beforeDestroy () {
        this.$store.commit('saveHotel', this.hotel)
        window.onscroll = null
    }
}
</script>

<style scoped>
    .search {
        min-width: 1120px;
        margin: 0 auto 10px;
        overflow: visible;
        text-align: center;
        position: fixed;
        left: 200px;
        right: 0px;
        border-radius: 0;
        box-sizing: border-box;
        top: 60px;
        z-index: 1000;
        height: 100px;
        transition: transform 300ms;
    }
    .search-hide {
        transition: transform 300ms;
        transform: translate(0px, -100px)
    }
    .screening {
        width: 1000px;
        margin: 0 auto;
        border-radius: 0;
        margin-top: 100px;
        padding: 3px 14px;
        box-sizing: border-box;
    }
    .screening__line {
        margin-bottom: 10px;
        font-size: 14px;
        /* display: flex; */
    }
    .screening__line > .el-checkbox-group {
        margin: -19px 0 0 130px;
    }
    .screening__line .el-checkbox {
        width: 130px;
        margin-left: 0;
    }
    .screening__line_cdt {
        width: 80px;
        display: inline-block;
        cursor: default;
        color: #999;
    }
    .screening__line_clear {
        cursor: default;
        width: 50px;
        color: #999;
        display: inline-block;
    }
    .screening__line_clear.screening__line_selected {
        color: #409EFF;
        cursor: pointer;
    }
    .main-data {
        width: 1000px;
        margin: 0 auto;
        background-color: white;
        padding: 10px;
        box-sizing: border-box;
    }
    .page-block {
        text-align: center;
        margin-top: 10px;
    }
    .hotel-hr {
        border-top: 1px solid red;
        margin: 10px 0;
    }
    .loading-block {
        height: 200px;
        width: 1000px;
        margin: 0 auto;
    }
    .error {
        text-align: center;
        height: 100px;
        margin-top: 80px;
        font-size: 25px;
        font-family: 'youyuan';
        color: red;
    }
</style>
