<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="职位"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getJobList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="job" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="职位" width="480">
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" min-width="120" :formatter="formatter" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="职位" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imagePath">
          <el-upload
            class="avatar-uploader"
            action="/upload"
            :show-file-list="false"
            :on-success="handleAvatarScucess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="editForm.url" placeholder="请输入申请职位跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="正文">
          <ueditor editorId="editEditor"  ></ueditor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="职位" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入职位名称"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imagePath">
          <el-upload
            class="avatar-uploader"
            action="/upload"
            :show-file-list="false"
            :on-success="handleAvatarScucess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="addForm.url"  placeholder="请输入申请职位跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="正文">
          <ueditor editorId="addEditor" ></ueditor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import {getJobList,  addJob, editJob, removeJob, batchRemoveJob } from '../../api/api';
  import Ueditor from '../../components/Ueditor.vue'
  import vm from '../../Vue.js'
  export default {
    data() {
      return {
        filters: {
          name: '',
        },
        job: [],
        total: 0,
        size: 20,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入招聘职位', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {},
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, message: '请输入招聘职位', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {},

        //文件上传
        imageUrl: '',
        imagesUrlServer: '',

      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getJobList();

      },

      //获取列表
      getJobList() {
        let para = {
          page: this.page,
          size: this.size,
          name: this.filters.name,
        };
        this.listLoading = true;
        NProgress.start();
        getJobList(para).then((res) => {
          this.total = res.data.total;
          this.job = res.data.data;
          this.listLoading = false;
          NProgress.done();

        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          let para = { id: row.id };
          removeJob(para).then((res) => {
            this.listLoading = false;
            NProgress.done();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.getJobList();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {

        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        if (this.editForm.imagePath) {
          this.imageUrl =  this.editForm.imagePath;
          this.imagesUrlServer = this.editForm.imagePath;
        } else {
          this.imageUrl = "";
          this.editForm.imagePath = "";
        }
        this.$store.commit('setContent',this.editForm.content);
      },
      //显示新增界面
      handleAdd: function () {

        this.addFormVisible = true;
        this.addForm = {};
        this.imageUrl = '';
        this.imagesUrlServer = '';
        this.$store.commit('setContent','');


      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              NProgress.start();
              let para = Object.assign({}, this.editForm);
              if (this.imagesUrlServer) para.imagePath = this.imagesUrlServer;
              para.content = this.$store.state.content;
              editJob(para).then((res) => {
                this.editLoading = false;
                NProgress.done();
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getJobList();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              NProgress.start();
              let para = Object.assign({}, this.addForm);
              if (this.imagesUrlServer) para.imagePath = this.imagesUrlServer;
              para.content = this.$store.state.content;
              addJob(para).then((res) => {
                this.addLoading = false;
                NProgress.done();
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getJobList();
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          let para = { ids: ids };

          batchRemoveJob(para).then((res) => {
            this.listLoading = false;
            NProgress.done();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.getJobList();
          });
        }).catch(() => {

        });
      },
      //文件上传
      handleAvatarScucess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.imagesUrlServer = res.path;
      },

      beforeAvatarUpload(file) {
        const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/svg+xml';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPGorPNG) {
          this.$message.error('上传图片只能是 JPG 、 PNG 、SVG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPGorPNG && isLt2M;


      },

      //时间格式化
      formatter(row, column){
        var createTime = util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss');
        return createTime;
      }
    },
    components: {
      Ueditor,
    },
    mounted() {
      this.getJobList();
    }
  }

</script>
<style>
  .avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed #ddd;
    text-align: center;
    line-height: 100px;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader i {
    font-size: 28px;
  }

  .avatar-uploader img {
    width: 100%;
  }


  .el-form-item__content {
    line-height: 0 !important;
  }

  .chindClass {
    padding-left: 30px !important;
  }
</style>
