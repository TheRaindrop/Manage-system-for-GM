webpackJsonp([10],{GtXS:function(e,t){},nMdY:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o("mvHQ"),a=o.n(n),s={components:{hotelCityCard:o("OSo9").a},data:function(){return{form:{key:"",token:""},file_img_url:[],obj:{print:function(){console.log("aaaaaaaaaaaaaa")}}}},methods:{handleSuccess:function(e,t,o){console.log("上传图片成功的回调>>>"+a()(e)),this.file_img_url=o},handleRemove:function(e,t){console.log("删除图片的请求>>>"+a()(t)),this.file_img_url=t},handlePreview:function(e){console.log("handlePreview",e)},beforeUpload:function(e){var t=this,o=new Date,n=e.name,a=encodeURI(""+o.getFullYear()+o.getMonth()+o.getDate()+"_"+o.getHours()+o.getMinutes()+o.getSeconds()+n);return this.getImageToken().then(function(e){console.log("getImageToken === Success >>> key = "+a+", token = "+e.token),t.form.key=a,t.form.token=e.token}).catch(function(e){console.log("beforeUpload error",e)})},getImageToken:function(){return this.$http.post("http://test.zoom178.com/qn-token",{},{local_data:!0,auth:{username:"shop",password:"aaabbb"}}).then(function(e){return e.data}).catch(function(e){return console.log("getImageToken error",e)})},success:function(){this.$message.error("21343215213")}},beforeDestory:function(){console.log("beforeDestory")},destoryed:function(){console.log("destoryed")},created:function(){this.$http.post(" https://easy-mock.com/mock/5a587cf93dcb200788d2d06f/web/upload",{},{local_data:!0}).then(function(e){console.log(e.data)}).catch(function(e){console.log(e)}),this.obj.print()}},c={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("el-card",[o("el-upload",{attrs:{action:"http://upload-z2.qiniup.com","on-success":e.handleSuccess,"on-preview":e.handlePreview,"on-remove":e.handleRemove,"before-upload":e.beforeUpload,"file-list":e.file_img_url,"list-type":"picture",data:e.form}},[o("el-button",{attrs:{size:"small"}},[e._v("点击上传")]),o("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("只能上传jpg/png文件，且不超过500kb")])],1)],1),o("el-card",[o("div",{staticClass:"choose"},[o("label",[o("input",{attrs:{type:"checkbox"}}),e._v("苹果")]),o("label",[o("input",{attrs:{type:"checkbox"}}),e._v("香蕉")]),o("label",[o("input",{attrs:{type:"checkbox"}}),e._v("梨")]),o("label",[o("input",{attrs:{type:"checkbox"}}),e._v("柿子")]),o("label",[o("input",{attrs:{type:"checkbox"}}),e._v("桃子")])]),o("p",[o("span",{staticClass:"count"})])]),o("el-card",[o("div",{staticClass:"space"},[o("div",{staticClass:"wheel"},[o("span",{staticClass:"line"})])])]),o("el-button",{attrs:{type:"success"},on:{click:e.success}},[e._v("success")])],1)},staticRenderFns:[]};var l=o("VU/8")(s,c,!1,function(e){o("GtXS")},"data-v-9f5d4944",null);t.default=l.exports}});
//# sourceMappingURL=10.f784d7e0a8d247653be9.js.map