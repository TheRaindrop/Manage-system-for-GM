<template lang='pug'>
    div.selector
        .select-input
            input#city(@click='showCityCard', @input='showCitySearchCard', :value='value', :placeholder="placeholder", @keyup='cityListSelect', @keyup.enter='citySelect(cityResultList[cityResultChosen])', autocomplete='off')
        el-collapse-transition
            .city-card(v-show='cityCard', @click='stopProp')
                el-card(style='width: 570px')
                    el-tabs(v-model='activeName', type='card')
                        el-tab-pane(label='热门城市', name='hot')
                            .city-list
                                ul.list
                                    li.cityList.cityLi(v-for='item in hot', @click='citySelect(item)') {{item.cityNameCN}}
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
                    .city__close(@click='cityCard=false')
                        i.el-icon-close
        el-collapse-transition
            .city-search-card(v-show='citySearchCard', @click='stopProp')
                el-card(style='width: 200px', :body-style='{padding: "10px 0"}', v-if='cityResultList.length > 0')
                    .city-search-card__list(v-for='(item, index) in cityResultList', @click='citySelect(item)', @mouseover='cityListHover(index)', :class='{"active": index === cityResultChosen}')
                        | {{item.cityNameCN}}
                el-card(style='width: 570px', v-else)
                    div
                        | 查询不到搜索的城市
</template>

<script>
// 航班搜索框，只有一个Input框
export default {
    data () {
        return {
            activeName: 'hot', // 默认激活tab
            cityCard: false, // 控制选择框的展示
            citySearchCard: false, // 控制搜索框的展示
            cityResultList: [], // 配合cityResultChosen用于选择搜索到的城市
            cityResultChosen: 0,
            citys: [],
            hot: [],
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
        placeholder: '',
        value: ''
    },
    methods: {
        showCityCard () { // 显示城市列表
            this.cityCard = !this.cityCard
            this.citySearchCard = false
            this.cityResultChosen = 0
            event.stopPropagation()
        },
        stopProp () { // 阻止冒泡
            event.stopPropagation()
        },
        citySelect (item) { // 选择并向父级组件传递选择信息
            this.cityCard = false
            this.citySearchCard = false
            this.$emit('citySelect', item)
            // this.$emit('input', item.cityNameCN + '(' + item.cityCode + ')')
            this.cityResultChosen = 0
            event.preventDefault()
        },
        showCitySearchCard () { // 显示根据输入内容展示的搜索结果
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
            let length = this.citys.length
            for (let i = 0, n = 0; i < length; i++) {
                if (this.citys[i].cityPinyin.search(s) !== -1 || this.citys[i].cityNameCN.search(s) !== -1 || this.citys[i].cityNameEN.toLowerCase().search(s) !== -1) {
                    this.cityResultList.push(this.citys[i])
                    n++
                }
                if (n >= 10) {
                    break
                }
            }
        },
        cityListHover (index) { // 鼠标浮动效果
            this.cityResultChosen = index
        },
        cityListSelect () { // 根据键盘的 ↑ ↓ 选择搜索列表
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
        }
    },
    created () {
        let _this = this
        this.$http.get('../../../static/city.json', { // 获取放在本地的城市json数据
            local_data: true
        }).then((response) => {
            this.citys = response.data
            for (let i = 0; i < this.citys.length; i++) {
                if (this.citys[i].isHot === 'Y') {
                    this.hot.push(this.citys[i])
                }
                let fPy = this.citys[i].cityPy.substr(0, 1)
                switch (fPy) {
                case 'a': this.cityList.cityA.push(this.citys[i])
                    break
                case 'b': this.cityList.cityB.push(this.citys[i])
                    break
                case 'c': this.cityList.cityC.push(this.citys[i])
                    break
                case 'd': this.cityList.cityD.push(this.citys[i])
                    break
                case 'e': this.cityList.cityE.push(this.citys[i])
                    break
                case 'f': this.cityList.cityF.push(this.citys[i])
                    break
                case 'g': this.cityList.cityG.push(this.citys[i])
                    break
                case 'h': this.cityList.cityH.push(this.citys[i])
                    break
                case 'i': this.cityList.cityI.push(this.citys[i])
                    break
                case 'j': this.cityList.cityJ.push(this.citys[i])
                    break
                case 'k': this.cityList.cityK.push(this.citys[i])
                    break
                case 'l': this.cityList.cityL.push(this.citys[i])
                    break
                case 'm': this.cityList.cityM.push(this.citys[i])
                    break
                case 'n': this.cityList.cityN.push(this.citys[i])
                    break
                case 'o': this.cityList.cityO.push(this.citys[i])
                    break
                case 'p': this.cityList.cityP.push(this.citys[i])
                    break
                case 'q': this.cityList.cityQ.push(this.citys[i])
                    break
                case 'r': this.cityList.cityR.push(this.citys[i])
                    break
                case 's': this.cityList.cityS.push(this.citys[i])
                    break
                case 't': this.cityList.cityT.push(this.citys[i])
                    break
                case 'u': this.cityList.cityU.push(this.citys[i])
                    break
                case 'v': this.cityList.cityV.push(this.citys[i])
                    break
                case 'w': this.cityList.cityW.push(this.citys[i])
                    break
                case 'x': this.cityList.cityX.push(this.citys[i])
                    break
                case 'y': this.cityList.cityY.push(this.citys[i])
                    break
                case 'z': this.cityList.cityZ.push(this.citys[i])
                    break
                default: alert('default')
                }
            }
        }).catch((error) => {
            console.log(error)
        })
        document.querySelector('body').addEventListener('click', function () { // 页面点击隐藏搜索框
            _this.cityCard = false
            _this.citySearchCard = false
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
        width: 100%;
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
    .city-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        position: relative;
        border-bottom: 1px solid #dfdfdf;
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
        display: inline-block;
    }
    .city-list > ul > li:hover {
        color: #2d8cf0;
        cursor: pointer;
    }
    .city__close {
        position: absolute;
        top: 0;
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

</style>
