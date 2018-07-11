<template lang='pug'>
    div.login-wrap
        transition(name='form-fade', mode='in-out')
            section(v-show='showLogin')
                .gm-title 客服管理系统
                .gm-login(v-loading='loading')
                    el-form.demo-ruleForm(ref='formCustom', :model='formCustom', :rules='ruleCustom')
                        el-form-item(prop='username')
                            el-input(type='text', v-model='formCustom.username', placeholder='请输入用户名', autofocus)
                        el-form-item(prop='passwd')
                            el-input(type='password', v-model='formCustom.passwd', placeholder='请输入密码', @keyup.enter.native='handleSubmit("formCustom")')
                        el-form-item(prop='remberMe')
                            el-checkbox(v-model='remember') 记住账号
                        el-form-item
                            el-button(type='success', @click='handleSubmit("formCustom")', size='medium', style='width: 100%;') 登录

</template>

<script>
export default {
    data () {
        const validateUser = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('用户名不能为空'))
            } else {
                callback()
            }
        }
        const validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'))
            } else {
                callback()
            }
        }

        return {
            loading: false,
            formCustom: {
                username: '',
                passwd: ''
            },
            ruleCustom: {
                username: [
                    {validator: validateUser, trigger: 'blur'}
                ],
                passwd: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            },
            remember: true,
            showLogin: false
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$http.post('/users/token', {}, {
                        auth: {
                            username: this.formCustom.username,
                            password: this.formCustom.passwd
                        }
                    }).then((res) => {
                        window.localStorage.setItem('Token', res.data.token)
                        this.$message({
                            message: '登录成功',
                            type: 'success'
                        })
                        if (this.remember === true) {
                            localStorage.setItem('gm_username', this.formCustom.username)
                        }
                        this.$router.push('/home')
                    }).catch((error) => {
                        this.loading = false
                        // this.$message.error('服务器错误，请联系管理员')
                        console.log('Error from Login.vue page:', error)
                    })
                } else {
                    this.$message({
                        message: '格式不正确',
                        type: 'error'
                    })
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields()
        }
    },
    created () {
        if (localStorage.gm_username) {
            this.formCustom.username = localStorage.gm_username
        }
    },
    mounted () {
        this.showLogin = true
        let ele = document.getElementById('app')
        ele.style.height = '100%'
    },
    destroyed () {
        let ele = document.getElementById('app')
        ele.style.height = ''
    }
}
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(#fb3, #58a)
    }
    .gm-title{
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -220px;
        text-align: center;
        font-size: 30px;
        color: #fff
    }
    .gm-login{
        position: absolute;
        width: 320px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 40px;
        border-radius: 5px;
        background: #fff
    }
    .gm-login > .lg-item {
        margin: 15px 0;
    }
</style>
