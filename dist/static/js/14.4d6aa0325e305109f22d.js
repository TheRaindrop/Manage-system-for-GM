webpackJsonp([14],{QAjR:function(t,e){},Sxtf:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={data:function(){return{loading:!1,dateRange:[],returnDetail:[],amount:0,pickerOptions:{shortcuts:[{text:"最近一周",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-6048e5),t.$emit("pick",[a,e])}},{text:"最近一个月",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-2592e6),t.$emit("pick",[a,e])}},{text:"最近三个月",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-7776e6),t.$emit("pick",[a,e])}}]}}},methods:{accountForm:function(t,e){return t.account.length>12?"微信openid":t.account},dateForm:function(t,e){return t.date_created.substr(0,10)},resultForm:function(t,e){return!0===t.succeeded?"成功":"失败"},typeForm:function(t,e){return 1===t.type?"微信":2===t.type?"支付宝":"其他"},amountForm:function(t,e){return"￥"+t.amount},getWithdraw:function(){var t=this;this.loading=!0,null===this.dateRange&&(this.dateRange=[]),this.$http.get("/users/withdrawal",{params:{start_time:this.dateRange[0],end_time:this.dateRange[1]}}).then(function(e){t.returnDetail=e.data.details,t.amount=e.data.amount,t.loading=!1}).catch(function(e){t.loading=!1,console.log(e)})}},created:function(){this.getWithdraw()}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"div1"},[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("返现提现总额")]),a("div",{staticClass:"search-bar",staticStyle:{float:"right"}},[a("span",{staticStyle:{"margin-right":"10px"}},[t._v("时间范围")]),a("el-date-picker",{attrs:{size:"small",type:"daterange",align:"right","unlink-panels":"unlink-panels","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":t.pickerOptions,"value-format":"yyyy-MM-dd"},on:{change:t.getWithdraw},model:{value:t.dateRange,callback:function(e){t.dateRange=e},expression:"dateRange"}})],1)]),a("el-card",{staticStyle:{width:"400px","background-color":"#409EFF"}},[a("h3",{staticClass:"title"},[t._v("累计返现")]),a("p",{staticClass:"amount"},[a("span",{staticClass:"amount__logo"},[t._v("￥")]),a("span",{staticClass:"amount__num"},[t._v(t._s(t.amount))])])]),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.returnDetail}},[a("el-table-column",{attrs:{label:"目标用户",prop:"name",align:"center"}}),a("el-table-column",{attrs:{label:"账户",prop:"account",formatter:t.accountForm,align:"center"}}),a("el-table-column",{attrs:{label:"创建日期",prop:"date_created",formatter:t.dateForm,align:"center"}}),a("el-table-column",{attrs:{label:"提现总额",prop:"amount",formatter:t.amountForm,align:"center"}}),a("el-table-column",{attrs:{label:"目标账户类型",prop:"type",formatter:t.typeForm,align:"center"}}),a("el-table-column",{attrs:{label:"提现结果",prop:"succeeded",formatter:t.resultForm,align:"center"}})],1)],1)],1)},staticRenderFns:[]};var i=a("VU/8")(n,r,!1,function(t){a("QAjR")},"data-v-0a6846de",null);e.default=i.exports}});
//# sourceMappingURL=14.4d6aa0325e305109f22d.js.map