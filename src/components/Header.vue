<template lang='pug'>
    div.header
        .header-logo
            i.el-icon-menu
        .header-title
            router-link(to='/home')
                p.header-title__spec GEM
                    span RY
        .header-nav
            //- .people-icon
            //-     img(src='http://thevectorlab.net/flatlab/img/avatar1_small.jpg')
            el-dropdown(@command='handleCommand')
                span.el-dropdown-link {{currentUser}}
                    i.el-icon-arrow-down.el-icon--right
                el-dropdown-menu(slot='dropdown')
                    el-dropdown-item(command='logout') 退出

</template>
<script>
export default {
    data () {
        return {
            currentUser: ''
        }
    },
    created () { // 显示登录管理员账户
        this.currentUser = localStorage.gm_username
    },
    mounted () {
        // console.log('mounted:', this)
    },
    methods: {
        handleCommand (command) {
            switch (command) {
            case 'logout':
                this.$confirm('确认退出系统？', '提示', {
                    confirmButtonText: '',
                    cancelButtonText: '',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/users/logout')
                        .then((res) => {
                            console.log(this)
                            this.$message({
                                type: 'success',
                                message: '退出成功'
                            })
                            window.localStorage.removeItem('Token')
                            this.$router.push('/')
                        }).catch((err) => {
                            console.log(err)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消退出'
                    })
                })
                break
            default:
                this.$message('what the fuck')
            }
        }
    }
}
</script>
<style scoped>
    .header {
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 2000;
        background: #fff;
        height: 60px;
        border-bottom: 1px solid #f1f2f7;
        box-sizing: border-box;
        padding: 0 15px;
        display: flex;
        align-items: center;
    }
    .header-logo > i {
        font-size: 30px;
    }
    .header-logo > i:hover {
        cursor: pointer;
        color: rgb(58, 63, 70);
    }
    .header-notice {
        margin-left: 80px
    }
    .header-notice__list {
        display: inline-block;
    }
    .header-notice__list_link {
        display: block;
        padding: 3px 6px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        margin-right: 10px;
        width: 16px
    }
    .header-notice__list_link:hover {
        cursor: pointer;
    }
    .btn-img {
        width: 100%;
    }
    .header-title__spec {
        margin-left: 10px;
        font-size: 25px;
        color: #2e2e2e;
    }
    .header-title__spec > span {
        color: #FF6C60;
    }
    .header-nav {
        margin: 0 auto;
        margin-right: 0;
        border: 1px solid #f0f0f8;
        padding: 6px;
        border-radius: 4px;
        color: #666666;
        font-size: 16px;
        display: flex;
        align-items: center;
    }
    .el-dropdown-link {
        margin-left: 10px;
        cursor: pointer;
    }
</style>
