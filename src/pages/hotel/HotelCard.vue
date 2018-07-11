<template lang='pug'>
    div
        .hotel-card
            .hotel-card__photo
                el-carousel(trigger='click', height='180px', :autoplay='false', v-if='imgShow.length > 0')
                    el-carousel-item(v-for='(item, index) in imgShow', :key='item.index')
                        img(:src='item.imageUrl', width='100%')
                div(style='height: 180px; background-color: rgb(220, 220, 220);', v-else)
                    p(style='text-align: center; padding-top: 80px; font-size: 20px; font-family: "youyuan"; font-weight: bold;') 暂无图片
            .hotel-card__info
                div.hotel-card__info_header
                    span.index {{index}}
                    span.name {{singleHotel.resName}}
                    span.grade {{singleHotel.resGrade}}
                div.hotel-card__info_detail
                    p.info(v-html='singleHotel.shortIntro')
                    el-button(type='text', size='mini', @click='showDetail(singleHotel.intro)') 显示详情
                    //- p.prepaid
                        span.prepaid__title 入住说明：
                        span.prepaid__detail {{singleHotel.depositAndPrepaid}}
                    .label
                        template(v-for='item of singleHotel.hotelThemeRelationInfo')
                            el-tag(type='success') {{item.themeName}}
                            | &nbsp;
            div.hotel-card__syn
                .hotel-card__eqpt
                    el-button(type='text', @click='showFacilities(singleHotel.resFacilities)') 酒店设施详情
                .hotel-card__price(@click='hotelDetal')
                    span.logo ￥
                    span.price {{singleHotel.minPrice}}
                    span.char 起>
        el-dialog(title='酒店设备详情', :visible.sync='faciModal', width='30%')
            el-table(:data='showFaci', style='width: 100%')
                //- el-table-column(prop='description', label='描述')
                el-table-column(prop='facilityCategoryName', label='设施类型')
                el-table-column(prop='facilityServicesName', label='服务类型')
            span.dialog-footer(slot='footer')
                el-button(type='primary', @click='faciModal = false') 确定
</template>

<script>
export default {
    props: {
        singleHotel: {},
        index: null,
        startTime: '',
        endTime: ''
    },
    data () {
        return {
            showFaci: [],
            faciModal: false
            // startTime: '2018-04-01',
            // endTime: '2018-04-02'
        }
    },
    computed: {
        imgShow () {
            let arr = []
            let i = 0
            for (let item of this.singleHotel.imgInfoList) {
                arr.push(item)
                i++
                if (i >= 3) {
                    break
                }
            }
            return arr
        }
    },
    methods: {
        showDetail (text) { // 显示酒店详情
            this.$alert(text, {
                title: '酒店详情',
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true
            })
        },
        showFacilities (faci) { // 显示酒店设施详情
            this.showFaci = faci
            this.faciModal = true
        },
        hotelDetal () { // 跳转到酒店预定页面
            this.$router.push({path: 'hotelDetail', query: {resId: this.singleHotel.resId, startTime: this.startTime, endTime: this.endTime}})
            // this.$router.push({path: 'hotelDetail', query: {resId: encodeURIComponent(this.singleHotel.resId), startTime: encodeURIComponent(this.startTime), endTime: encodeURIComponent(this.endTime)}})
        }
    }
}
</script>

<style scoped>
    .hotel-card {
        display: flex;
        align-items: flex-start;
        height: 180px;
        overflow-y: hidden;
        background-color: white;
    }
    .hotel-card:hover {
        background-color: rgb(252, 252, 252)
    }
    .hotel-card__photo {
        width: 270px;
        flex-shrink: 0;
    }
    .hotel-card__info {
        box-sizing: border-box;
        padding: 0 10px;
        width: 560px;
    }
    .hotel-card__info_header {
        margin: 3px 0;
        font-size: 16px;
    }
    .hotel-card__info_header > .index {
        background-color: black;
        color: white;
        display: inline-block;
        text-align: center;
        width: 17px;
        height: 17px;
    }
    .hotel-card__info_header > .name {
        margin: 0 10px 0 5px;
        color: red;
    }
    .hotel-card__info_header > .grade {
        color: gray;
        font-size: 14px;
    }
    .hotel-card__info_detail {
        font-size: 14px;
    }
    .hotel-card__info_detail > .info {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    /* .hotel-card__info_detail > .info::after {
        content: '...';
        position: absolute;
        bottom: 0;
        right: 0;
        padding-left: 40px;
    } */
    .prepaid {
        margin-bottom: 5px;
    }
    .prepaid__title {
        color: red;
    }
    .hotel-card__syn {
        box-sizing: border-box;
        width: 150px;
        flex-shrink: 0;
        border-left: #ececec 1px solid;
        padding-left: 10px;
    }
    .hotel-card__eqpt {
        height: 70px;
    }
    .hotel-card__price {
        height: 110px;
        color: red;
        cursor: pointer;
    }
    .hotel-card__price > .logo {
        font-size: 16px;
    }
    .hotel-card__price > .price {
        font-size: 35px;
    }
    .hotel-card__price > .char {
        font-size: 16px;
    }
</style>
