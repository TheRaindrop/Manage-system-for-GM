<template lang='pug'>
    div.input-edit
        input.input(:disabled='!editable',
            :type='type', :style='{width: inputWidth + "px"}',
            @focusout='focusOut', :value='value',
            @keyup.enter='focusOut')
        span(@click='editInput')
            i.el-icon-edit-outline.icon_text(title='编辑')
</template>

<script>
// ?????????
export default {
    data () {
        return {
            editable: false
        }
    },
    props: {
        type: {
            type: String,
            default: 'text'
        },
        inputWidth: {
            type: Number,
            default: 150
        },
        value: {
            type: String,
            required: true
        }
    },
    methods: {
        editInput () {
            let _this = this
            this.editable = true
            window.setTimeout(function () {
                _this.$el.querySelector('.input').focus()
            }, 0)
            event.stopPropagation()
        },
        focusOut () {
            this.editable = false
            this.$emit('input', event.target.value)
            event.stopPropagation()
        },
        // stopProp () {
        //     console.log('stop')
        //     event.stopPropagation()
        // },
        test () {
            console.log(123)
        }
    },
    mounted () {
        // let _this = this
        // document.querySelector('body').addEventListener('click', () => {
        //     console.log('body')
        //     _this.focusOut()
        // }, false)
    }
}
</script>

<style scoped>
    .input-edit {
        margin: 4px 0;
    }
    .input {
        height: 28px;
        border: 1px solid #dfdfdf;
    }
    .input:focus {
        border-color: #409EFF;
        outline: 0;
    }
    .input:disabled {
        background-color: rgb(240, 240, 240)
    }
    .icon_text {
        margin-left: 2px;
        font-size: 26px;
        vertical-align: top;
    }
    .icon_text:hover {
        color: #2db7f5;
        cursor: pointer;
    }
</style>
