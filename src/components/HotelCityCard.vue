<template lang='pug'>
    div.selector
        .select-input
            input#city(@click='showCityCard', @input='showCitySearchCard', :value='value', placeholder="输入目标城市", @keyup='cityListSelect', @keyup.enter='citySelect(cityResultList[cityResultChosen])', :style='{width: cityWidth + "px"}', autocomplete='off')
            input#scenic(@click='showScenicCard', @input='showScenicSearchCard', @blur='zoneScenic', v-model='scenic', placeholder='地标、商圈', @keyup='scenicListSelect', @keyup.enter='scenicSelect(scenicResultList[scenicResultChosen])', :style='{width: scenicWidth + "px"}', autocomplete='off')
        el-collapse-transition
            .city-card(v-show='cityCard', @click='stopProp')
                el-card(style='width: 570px')
                    el-tabs(v-model='activeName', type='card')
                        el-tab-pane(label='热门城市', name='hot')
                            .city-list
                                ul.list
                                    li.city_li(v-for='item in hot', @click='citySelect(item)') {{item.cityNameCN}}
                        el-tab-pane(label='ABCDE', name='abcde')
                            .city-list
                                p.title A
                                ul.list
                                    li(v-for='item in cityList.cityA', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title B
                                ul.list
                                    li(v-for='item in cityList.cityB', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title C
                                ul.list
                                    li(v-for='item in cityList.cityC', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title D
                                ul.list
                                    li(v-for='item in cityList.cityD', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title E
                                ul.list
                                    li(v-for='item in cityList.cityE', @click='citySelect(item)') {{item.cityNameCN}}

                        el-tab-pane(label='FGHJ', name='fghj')
                            .city-list
                                p.title F
                                ul.list
                                    li(v-for='item in cityList.cityF', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title G
                                ul.list
                                    li(v-for='item in cityList.cityG', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title H
                                ul.list
                                    li(v-for='item in cityList.cityH', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title J
                                ul.list
                                    li(v-for='item in cityList.cityJ', @click='citySelect(item)') {{item.cityNameCN}}
                        el-tab-pane(label='KLMNP', name='klmnp')
                            .city-list
                                p.title K
                                ul.list
                                    li(v-for='item in cityList.cityK', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title L
                                ul.list
                                    li(v-for='item in cityList.cityL', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title M
                                ul.list
                                    li(v-for='item in cityList.cityM', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title N
                                ul.list
                                    li(v-for='item in cityList.cityN', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title P
                                ul.list
                                    li(v-for='item in cityList.cityP', @click='citySelect(item)') {{item.cityNameCN}}
                        el-tab-pane(label='QRSTW', name='qrstw')
                            .city-list
                                p.title Q
                                ul.list
                                    li(v-for='item in cityList.cityQ', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title R
                                ul.list
                                    li(v-for='item in cityList.cityR', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title S
                                ul.list
                                    li(v-for='item in cityList.cityS', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title T
                                ul.list
                                    li(v-for='item in cityList.cityT', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title W
                                ul.list
                                    li(v-for='item in cityList.cityW', @click='citySelect(item)') {{item.cityNameCN}}
                        el-tab-pane(label='XYZ', name='xyz')
                            .city-list
                                p.title X
                                ul.list
                                    li(v-for='item in cityList.cityX', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title Y
                                ul.list
                                    li(v-for='item in cityList.cityY', @click='citySelect(item)') {{item.cityNameCN}}
                            .city-list
                                p.title Z
                                ul.list
                                    li(v-for='item in cityList.cityZ', @click='citySelect(item)') {{item.cityNameCN}}
                    .city__close(@click='cityCard = false')
                        i.el-icon-close
        el-collapse-transition
            .city-search-card(v-show='citySearchCard', @click='stopProp')
                el-card(style='width: 200px', :body-style='{padding: "10px 0"}', v-if='cityResultList.length > 0')
                    div.city-search-card__list(v-for='(item, index) in cityResultList', @click='citySelect(item)', @mouseover='cityListHover(index)', :class='{"active": index === cityResultChosen}')
                        | {{item.cityNameCN}}
                el-card(style='width: 570px', v-else)
                    div
                        | 查询不到搜索的城市
        el-collapse-transition
            .scenic-card(v-show='scenicCard', @click='stopProp')
                el-card(style='width: 400px', v-if='scenicResult', v-loading='scenicLoad')
                    .scenic__area
                        p.scenic__title
                            |行政区
                        p.scenic__line
                            template(v-for='(item, index) in scenicData.cityArea')
                                el-button.scenic__line_item(type='text', size='mini', @click='scenicSelect(item)', v-if='index < 20')
                                    | {{item}}
                    .scenic__air_railway
                        p.scenic__title
                            |机场车站
                        p.scenic__line
                            template(v-for='(item, index) in scenicData.cityAirRailWay')
                                el-button.scenic__line_item(type='text', size='mini', @click='scenicSelect(item)', v-if='index < 20')
                                    | {{item}}
                    .scenic__business_section_info
                        p.scenic__title
                            |热门品牌
                        p.scenic__line
                            template(v-for='(item, index) in scenicData.cityBusinessSectionInfo')
                                el-button.scenic__line_item(type='text', size='mini', @click='scenicSelect(item)', v-if='index < 20')
                                    | {{item}}
                    .scenic__scenic
                        p.scenic__title
                            |热门景点
                        p.scenic__line
                            template(v-for='(item, index) in scenicData.cityScenic')
                                el-button.scenic__line_item(type='text', size='mini', @click='scenicSelect(item)', v-if='index < 20')
                                    | {{item}}
                    .scenic__subway
                        p.scenic__title
                            |地铁周边
                        p.scenic__line
                            template(v-for='(item, index) in scenicData.citySubWay')
                                el-button.scenic__line_item(type='text', size='mini', @click='scenicSelect(item)', v-if='index < 20')
                                    | {{item}}
                el-card(style='width: 400px', v-else, v-loading='scenicLoad')
                    div
                        | 未找到城市相关信息
        el-collapse-transition
            .scenic-search-card(v-show='scenicSearchCard', @click='stopProp')
                el-card(style='width: 200px', :body-style='{padding: "10px 0"}', v-if='scenicResultList.length > 0')
                    div.scenic-search-card__list(v-for='(item, index) in scenicResultList', @click='scenicSelect(item)', @mouseover='scenicListHover(index)', :class='{"active": index === scenicResultChosen}')
                        | {{item}}
                el-card(style='width: 200px', v-else)
                    div 未找到相关商圈信息
</template>

<script>
// 酒店搜索框，包括两个Input框，一个是city，一个是scenic
export default {
    data () {
        return {
            activeName: 'hot',
            cityCard: false,
            citySearchCard: false,
            cityData: [],
            cityResultList: [],
            cityResultChosen: 0,
            scenic: '',
            scenicCard: false,
            scenicSearchCard: false,
            scenicData: {},
            scenicResultList: [],
            scenicResultChosen: 0,
            hot: [],
            scenicLoad: false,
            cityList: {
                cityA: [],
                cityB: [],
                cityC: [],
                cityD: [],
                cityE: [],
                cityF: [],
                cityG: [],
                cityH: [],
                cityI: [],
                cityJ: [],
                cityK: [],
                cityL: [],
                cityM: [],
                cityN: [],
                cityO: [],
                cityP: [],
                cityQ: [],
                cityR: [],
                cityS: [],
                cityT: [],
                cityU: [],
                cityV: [],
                cityW: [],
                cityX: [],
                cityY: [],
                cityZ: []
            }
        }
    },
    props: {
        value: '',
        cityWidth: {
            type: String,
            default: '200'
        },
        scenicWidth: {
            type: String,
            default: '200'
        }
    },
    watch: {
        cityResultChosen () { // 监听选择
            let index = this.cityResultChosen
            this.$emit('input', this.cityResultList[index].cityNameCN)
        }
    },
    computed: {
        scenicResult () { // 判断是否存在scenic数据
            if (this.scenicData.cityScenic) {
                if (this.scenicData.cityAirRailWay.length === 0 && this.scenicData.cityBusinessSectionInfo.length === 0 && this.scenicData.cityScenic.length === 0 && this.scenicData.citySubWay.length === 0) {
                    return false
                } else {
                    return true
                }
            }
        }
    },
    methods: {
        zoneScenic () { // 当scenic框失去焦点时提交
            this.$emit('scenicSelect', this.scenic, this.scenicClass)
        },
        stopProp () {
            event.stopPropagation()
        },
        showCityCard () { // 名字起的很清楚
            this.cityCard = !this.cityCard
            this.citySearchCard = false
            this.scenicCard = false
            this.scenicSearchCard = false
            event.stopPropagation()
        },
        citySelect (item) {
            this.citySearchCard = false
            this.cityCard = false
            this.scenic = ''
            this.$emit('citySelect', item)
            this.$emit('input', item.cityNameCN)
            this.scenicLoad = true
            this.$http.get('/web/jd/searchScenic', {
                params: {
                    cityName: item.cityNameCN
                }
            }).then((res) => {
                this.scenicLoad = false
                // console.log('changing the scenicLoad to false', this.scenicLoad)
                this.scenicData = res.data.data
            }).catch((error) => {
                console.log(error)
            })
        },
        showCitySearchCard () {
            this.cityCard = false
            this.citySearchCard = true
            this.cityResultList = []
            let s = this.$el.querySelector('#city').value
            this.$emit('input', s)
            if (s === '') {
                this.citySearchCard = false
                this.cityCard = true
                return
            }
            let length = this.cityData.length
            for (let i = 0, n = 0; i < length; i++) {
                if (this.cityData[i].cityPinyin.search(s) !== -1 || this.cityData[i].cityNameCN.search(s) !== -1) {
                    this.cityResultList.push(this.cityData[i])
                    n++
                }
                if (n >= 10) {
                    break
                }
            }
            if (this.cityResultChosen + 1 > this.cityResultList.length) {
                this.cityResultChosen = 0
            }
        },
        cityListHover (index) {
            this.cityResultChosen = index
        },
        cityListSelect () {
            if (event.keyCode !== 38 && event.keyCode !== 40) {
                return
            }
            let length = this.cityResultList.length - 1
            if (event.keyCode === 38) {
                if (this.cityResultChosen === 0) {
                    this.cityResultChosen = length
                } else {
                    this.cityResultChosen--
                }
            } else if (event.keyCode === 40) {
                if (this.cityResultChosen === length) {
                    this.cityResultChosen = 0
                } else {
                    this.cityResultChosen++
                }
            }
            event.preventDefault()
        },
        showScenicCard () {
            this.scenicCard = !this.scenicCard
            this.scenicSearchCard = false
            this.cityCard = false
            this.citySearchCard = false
            event.stopPropagation()
        },
        scenicSelect (item) {
            this.scenicSearchCard = false
            this.scenicCard = false
            this.scenic = item
            let scenicClass
            for (let i in this.scenicData) {
                if (this.scenicData[i].includes(item)) {
                    scenicClass = i
                    break
                }
            }
            this.$emit('scenicSelect', item, scenicClass)
        },
        showScenicSearchCard () {
            this.scenicSearchCard = true
            this.scenicCard = false
            this.scenicResultList = []
            // let s = this.$el.querySelector('#scenic').value
            if (this.scenic === '') {
                this.scenicSearchCard = false
                this.scenicCard = true
                return
            }
            let n = 0
            for (let item in this.scenicData) {
                for (let i of this.scenicData[item]) {
                    if (i.search(this.scenic) !== -1) {
                        this.scenicResultList.push(i)
                        n++
                    }
                    if (n >= 10) {
                        break
                    }
                }
                if (n >= 10) {
                    break
                }
            }
        },
        scenicListHover (index) {
            this.scenicResultChosen = index
        },
        scenicListSelect () {
            if (event.keyCode !== 38 && event.keyCode !== 40) {
                return
            }
            let length = this.scenicResultList.length - 1
            if (event.keyCode === 38) {
                if (this.scenicResultChosen === 0) {
                    this.scenicResultChosen = length
                } else {
                    this.scenicResultChosen--
                }
            } else if (event.keyCode === 40) {
                if (this.scenicResultChosen === length) {
                    this.scenicResultChosen = 0
                } else {
                    this.scenicResultChosen++
                }
            }
            this.scenic = this.scenicResultList[this.scenicResultChosen]
            event.preventDefault()
        }
    },
    created () {
        let _this = this
        this.$http.get('../../../static/hotelHotCitys.json', { // 获取本地的hotel的json数据
            local_data: true
        }).then((res) => {
            let citys = res.data
            this.hot = citys['热门']
            for (let i of citys['ABCD']) {
                let cPy = i.cityPinyin.substr(0, 1)
                switch (cPy) {
                case 'a': this.cityList.cityA.push(i)
                    break
                case 'b': this.cityList.cityB.push(i)
                    break
                case 'c': this.cityList.cityC.push(i)
                    break
                case 'd': this.cityList.cityD.push(i)
                    break
                default: alert('default')
                }
            }
            for (let i of citys['EFGH']) {
                let cPy = i.cityPinyin.substr(0, 1)
                switch (cPy) {
                case 'e': this.cityList.cityE.push(i)
                    break
                case 'f': this.cityList.cityF.push(i)
                    break
                case 'g': this.cityList.cityG.push(i)
                    break
                case 'h': this.cityList.cityH.push(i)
                    break
                default: alert('default')
                }
            }
            for (let i of citys['JKLM']) {
                let cPy = i.cityPinyin.substr(0, 1)
                switch (cPy) {
                case 'j': this.cityList.cityJ.push(i)
                    break
                case 'k': this.cityList.cityK.push(i)
                    break
                case 'l': this.cityList.cityL.push(i)
                    break
                case 'm': this.cityList.cityM.push(i)
                    break
                default: alert('default')
                }
            }
            for (let i of citys['NOPQRS']) {
                let cPy = i.cityPinyin.substr(0, 1)
                switch (cPy) {
                case 'n': this.cityList.cityN.push(i)
                    break
                case 'o': this.cityList.cityO.push(i)
                    break
                case 'p': this.cityList.cityP.push(i)
                    break
                case 'q': this.cityList.cityQ.push(i)
                    break
                case 'r': this.cityList.cityR.push(i)
                    break
                case 's': this.cityList.cityS.push(i)
                    break
                default: alert('default')
                }
            }
            for (let i of citys['TUVWX']) {
                let cPy = i.cityPinyin.substr(0, 1)
                switch (cPy) {
                case 't': this.cityList.cityT.push(i)
                    break
                case 'u': this.cityList.cityU.push(i)
                    break
                case 'v': this.cityList.cityV.push(i)
                    break
                case 'w': this.cityList.cityW.push(i)
                    break
                case 'x': this.cityList.cityX.push(i)
                    break
                default: alert('default')
                }
            }
            for (let i of citys['YZ']) {
                let cPy = i.cityPinyin.substr(0, 1)
                switch (cPy) {
                case 'y': this.cityList.cityY.push(i)
                    break
                case 'z': this.cityList.cityZ.push(i)
                    break
                default: alert('default')
                }
            }
        }).catch((error) => {
            console.log(error)
        })
        this.$http.get('../../static/hotelCity.json', {
            local_data: true
        }).then((res) => {
            this.cityData = res.data
        }).catch((error) => {
            console.log(error)
        })
        this.scenicLoad = true
        this.$http.get('/web/jd/searchScenic', {
            params: {
                cityName: this.value
            }
        }).then((res) => {
            this.scenicLoad = false
            this.scenicData = res.data.data
        }).catch((error) => {
            console.log(error)
        })
        document.querySelector('body').addEventListener('click', function () {
            _this.cityCard = false
            _this.citySearchCard = false
            _this.scenicCard = false
            _this.scenicSearchCard = false
        }, false)
    }
}
</script>

<style scoped>
    .selector {
        position: relative;
        z-index: 20;
    }
    .city-card {
        position: absolute;
        margin-top: 3px;
        z-index: 2001;
    }
    input {
        /* width: 100%; */
        border-radius: 4px;
        height: 40px;
        line-height: 1.5;
        padding: 0 15px;
        box-sizing: border-box;
        border: 1px solid #dcdfe6;
        background-color: #fff;
        color: #606266;
        line-height: 1;
        outline: 0;
        font-size: inherit;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    input:focus {
        border-color: #409EFF;
        outline: 0;
    }
    #city {
        margin-right: 5px;
    }
    .city-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        position: relative;
        border-bottom: 1px solid #dfdfdf;
        margin-top: 10px;
        padding-bottom: 10px;
    }
    .city-list > .title {
        position: absolute;
        font-size: 20px;
        color: red;
    }
    .city-list > ul.list {
        margin-left: 30px;
        font-size: 12px;
        display: flex;
        flex-wrap: wrap;
    }
    .city-list > ul > li {
        /* width: 110px; */
        width: 90px;
        height: 25px;
        text-align: left;
        display: inline-block;
    }
    .city-list > ul > li:hover {
        color: #2d8cf0;
        cursor: pointer;
    }
    .city__close {
        position: absolute;
        top: 0;
        line-height: 40px;
        right: 12px;
        cursor: pointer;
    }
    .city-search-card {
        position: absolute;
        margin-top: 3px;
        z-index: 2001;
    }
    .city-search-card__list {
        font-size: 14px;
        padding: 0 20px;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;
    }
    .city-search-card__list.active {
        background-color: #f5f7fa;
    }
    /* .city-search-card__list:hover {
        background-color: #f5f7fa;
    } */
    .scenic-card {
        position: absolute;
        margin-top: 3px;
        z-index: 2001;
        left: 205px;
    }
    .scenic__title {
        text-align: left;
    }
    .scenic__line {
        font-size: 12px;
        line-height: 22px;
        text-align: left;
        margin-bottom: 8px;
        padding-bottom: 8px;
        word-spacing: 6px;
    }
    .scenic__line_item {
        padding: 2px 0;
        margin-left: 10px;
    }
    .scenic-search-card {
        position: absolute;
        margin-top: 3px;
        z-index: 2001;
        left: 205px;
    }
    .scenic-search-card__list {
        font-size: 14px;
        padding: 0 20px;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;
    }
    .scenic-search-card__list.active {
        background-color: #f5f7fa;
    }
</style>
