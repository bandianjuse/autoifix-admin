<template>
  <div>
    <script :id="editorId" type="text/plain" style="height:200px;"></script>
  </div>
</template>

<script>
  export default {
    name: 'ueditor',

    data(){
      return {
        editor : '',
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
    watch : {
      '$store.state.content'(val,old){
        this.editor.setContent(val);
      }
    },
    props: ['editorId','content'],
    mounted() {
      UE.delEditor(this.editorId);
      let _this = this;

      this.editor = UE.getEditor(this.editorId,this.config);
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.$store.state.content);
      });
      this.editor.addListener('blur', function (editor) {
        _this.$store.commit('setContent',_this.editor.getContent());
      });



    }
  };
</script>
