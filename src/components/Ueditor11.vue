<template>
  <div>
    <script :id="editorId" type="text/plain" style="height:200px;"></script>
  </div>
</template>

<script>
  import vm from '../Vue.js'
  const UE = require('UE');
  export default {
    name: 'ueditor',

    data(){
      return {
        config: {
          toolbars: [
            [
              'source',
              'fontfamily', //字体
              'fontsize', //字号
              'forecolor', //字体颜色
              'backcolor', //背景色
              'bold', //加粗
              'italic', //斜体
              'simpleupload', //单图上传
              'insertimage', //多图上传
              'justifyleft', //居左对齐
              'justifyright', //居右对齐
              'justifycenter', //居中对齐
              'justifyjustify', //两端对齐
              'undo',
              'redo',

            ]
          ],
          initialFrameWidth: null
        }
      }
    },
    props: ['editorId','content'],
    mounted() {
      UE.delEditor(this.editorId);
      let _this = this;

      var ue = UE.getEditor(this.editorId,this.config);
      ue.addListener("ready", function () {

        ue.setContent(_this.content);
      });
      ue.addListener('blur', function (editor) {
        _this.$emit('getContent', { content: ue.getContent() });
      });

      vm.$on('setcontent', function (data) {
        ue.setContent(data);
      })


    },
    destroyed() {

    }
  };
</script>
