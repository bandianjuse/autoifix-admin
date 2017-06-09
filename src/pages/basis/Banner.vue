<template>
  <div class="banner" style="padding:20px 0;">
    <el-form ref="formBanner"  label-width="150px">
      <el-form-item label="首页焦点图：">
        <el-upload
          class="upload-demo"
          action="/api/files/upload"
          :on-success = "handleSuccessLeft"
          :file-list="banner.filelist"
          list-type="picture"
          ref="upload"
          style="width:400px;">
          <el-button type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="URL链接：">
        <el-input placeholder="请输入内容" v-model="banner.url" style="width:400px;">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="bannerSubmit" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import { configList , configUpdate  } from '../../api/api';
  import NProgress from 'nprogress'
  export default {
    data() {
      return {
        loading : false,
        listLoading: false,
        banner : {}

      }
    },
    methods: {
      handleSuccessLeft(response, file, fileList){
        let path =  'http://127.0.0.1:8360/static/upload/' + response.data;
        let name = file.name;
        this.banner.filelist = [
          {
            name : name,
            url : path
          }
        ];
      },

      bannerSubmit(){
        let para = {
          id : 1,
          content : JSON.stringify(this.banner)
        };
        this.loading = true;
        configUpdate(para).then((res) => {
          this.loading = false;
          NProgress.done();
          this.$notify({
            title: '成功',
            message: '提交成功',
            type: 'success'
          });
        });
      },
      configList(){
        this.listLoading = true;
        NProgress.start();
        configList({}).then((res) => {
          this.listLoading = false;
          let confing = res.data;
          this.banner = JSON.parse(confing[0].content);

          NProgress.done();
        });
      },
    },
    mounted() {
      this.configList();
    }
  }

</script>
<style>
  .el-upload__tip {
    padding: 10px 0;
  }
  .el-tabs__nav-prev{
    display: none;
  }
  .el-tabs__nav-next{
    display: none;
  }
</style>
