<template lang='pug'>
    div
        el-container
            el-header
                v-head
            el-container
                el-aside(width='200px')
                    v-sidebar
                el-main
                    el-collapse-transition
                        router-view

</template>

<script>
import vHead from './Header.vue'
import vSidebar from './Sidebar.vue'
export default {
    components: {
        vHead,
        vSidebar
    },
    mounted () {
        // document.getElementById('card').scrollIntoView(false)
    }
}
</script>

<style scoped>
    .el-header {
        padding: 0;
    }
    .el-aside {
        flex-shrink: 0;
    }
    .el-main {
        overflow: visible;
        width: 100%;
    }
</style>
