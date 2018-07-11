<template lang='pug'>
    div
        el-card
            el-upload(action='http://upload-z2.qiniup.com', :on-success='handleSuccess', :on-preview='handlePreview', :on-remove='handleRemove', :before-upload='beforeUpload', :file-list="file_img_url", list-type="picture", :data='form')
                el-button(size='small') 点击上传
                div(slot="tip", class="el-upload__tip") 只能上传jpg/png文件，且不超过500kb
        el-card
            .choose
                label
                    input(type='checkbox')
                    |苹果
                label
                    input(type='checkbox')
                    |香蕉
                label
                    input(type='checkbox')
                    |梨
                label
                    input(type='checkbox')
                    |柿子
                label
                    input(type='checkbox')
                    |桃子
            p
                span.count
        el-card
            .space
                .wheel
                    span.line
        el-button(type='success', @click='success') success
        el-card
          .my-scroll
            .my-scroll__item 1
            .my-scroll__item 2
            .my-scroll__item 3
            .my-scroll__item 4
            .my-scroll__item 5
            .my-scroll__item 6
            .my-scroll__item 7
</template>

<script>
// 这个页面对项目没有意义，只是个人测试页面
import hotelCityCard from '@/components/HotelCityCard.vue'
// import * as qiniu from '@/../static/qiniu.min.js'
export default {
    components: {hotelCityCard},
    data () {
        const innerPrint = () => {
            console.log('aaaaaaaaaaaaaa')
        }
        return {
            form: {
                key: '',
                token: ''
            },
            file_img_url: [],
            obj: {
                print: innerPrint
            },
            seats: 1000,
            halfSeats: this.seats * 0.5
        }
    },
    methods: {
        handleSuccess (response, file, fileList) {
            console.log('上传图片成功的回调>>>' + JSON.stringify(response))
            this.file_img_url = fileList
        },
        handleRemove (file, fileList) {
            console.log('删除图片的请求>>>' + JSON.stringify(fileList))
            this.file_img_url = fileList
        },
        handlePreview (file) {
            console.log('handlePreview', file)
        },
        beforeUpload (file) {
            let now = new Date()
            let suffix = file.name
            let key = encodeURI(`${now.getFullYear()}${now.getMonth()}${now.getDate()}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}${suffix}`)
            return this.getImageToken().then(res => {
                console.log('getImageToken === Success >>> key = ' + key + ', token = ' + res.token)
                this.form.key = key
                this.form.token = res.token
            }).catch(err => {
                console.log('beforeUpload error', err)
            })
        },
        getImageToken () {
            return this.$http.post('http://test.zoom178.com/qn-token', {}, {
                local_data: true,
                auth: {
                    username: 'shop',
                    password: 'aaabbb'
                }
            }).then(res => res.data).catch(err => console.log('getImageToken error', err))
        },
        success () {
            // this.$message.success('sdafgsd')
            this.$message.error('21343215213')
            // this.$router.replace('/order')
        },
        change (c, r) {
            this.seats[c][r]++
            console.log(this.seats[c][r])
        }
    },
    beforeDestory () {
        console.log('beforeDestory')
    },
    destoryed () {
        console.log('destoryed')
    },
    created () {
        this.$http.post(' https://easy-mock.com/mock/5a587cf93dcb200788d2d06f/web/upload', {}, {
            local_data: true
        }).then(res => { console.log(res.data) }).catch(err => { console.log(err) })
        this.obj.print()
    }
}
</script>

<style scoped>
    .choose {
        counter-reset: fruit;
    }
    .choose input:checked {
        counter-increment: fruit;
    }
    .count::before {
        content: counter(fruit)
    }
    .space {
        background-color: black;
        height: 300px;
        width: 1200px;
        border-bottom: 4px solid red;
    }
    .wheel {
        height: 200px;
        width: 200px;
        border: 2px solid white;
        border-radius: 50%;
        position: relative;
    }
    .line {
        border-top: 1px solid white;
        width: 100px;
        position: absolute;
        top: 50%;
        left: 0;
    }
    .wheel {
        animation: move 6s linear infinite;
    }
    @keyframes move {
        50% {
            transform: translateX(1000px) rotate(572.96deg)
        }
        100% {
            transform: translateX(0px) rotate(0deg)
        }
    }
    .row-single {
      display: inline-block;
      width: 40px;
      height: 40px;
    }
    .my-scroll {
      height: 200px;
      white-space: nowrap;
      overflow-x: auto;
      width: 400px;
      -webkit-overflow-scrolling: touch
  }
  .my-scroll__item {
      height: 100px;
      width: 300px;
      display: inline-block;
  }
</style>
