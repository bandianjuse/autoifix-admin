<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="exchangeList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="exchange" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="缩略图" width="100">
        <template scope="scope">
          <img :src="scope.row.thumbnail" style="width: 50px;height:50px;margin-top:8px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" >
      </el-table-column>
      <el-table-column prop="integral" label="所需积分">
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imagePath">
          <el-upload
            class="avatar-uploader"
            name="file"
            action="/api/files/upload"
            :show-file-list="false"
            :on-success="handleAvatarScucess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="所需积分" prop="integral">
          <el-input v-model="editForm.integral" auto-complete="off" placeholder="请输入所需积分"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="editForm.content" :rows="8"></el-input>
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" auto-complete="off" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="imagePath">
          <el-upload
            class="avatar-uploader"
            name="file"
            action="/api/files/upload"
            :show-file-list="false"
            :on-success="handleAvatarScucess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="所需积分" prop="integral">
          <el-input v-model="addForm.integral" auto-complete="off" placeholder="请输入所需积分"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="addForm.content" :rows="8"></el-input>
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
  import {exchangeList, exchangeAdd, exchangeDel, exchangeUpdate } from '../../api/api';
  export default {
    data() {
      return {
        filters: {
          title: '',
        },
        exchange: [],
        total: 0,
        size: 20,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          integral: [
            { required: true, message: '请输入所需积分', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {},
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          integral: [
            { required: true, message: '请输入所需积分', trigger: 'blur' }
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
        this.exchangeList();

      },

      //获取列表
      exchangeList() {
        let para = {
          pageNo: this.page,
          pageSize: this.size,
          title: this.filters.title
        };
        this.listLoading = true;
        NProgress.start();
        exchangeList(para).then((res) => {
          this.total = res.data.totalPages;
          this.exchange = res.data.data;
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
          exchangeDel(para).then((res) => {
            this.listLoading = false;
            NProgress.done();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.exchangeList();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {

        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        if (this.editForm.thumbnail) {
          this.imageUrl =  this.editForm.thumbnail;
          this.imagesUrlServer = this.editForm.thumbnail;
        } else {
          this.imageUrl = "";
          this.editForm.imagePath = "";
        }
        this.editForm.integral = this.editForm.integral + '';
      },
      //显示新增界面
      handleAdd: function () {

        this.addFormVisible = true;
        this.addForm = {};
        this.imageUrl = '';
        this.imagesUrlServer = '';

      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              NProgress.start();
              let para = Object.assign({}, this.editForm);
              if (this.imagesUrlServer) para.thumbnail = this.imagesUrlServer;
              delete para['create_time'];
              exchangeUpdate(para).then((res) => {
                this.editLoading = false;
                NProgress.done();
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.exchangeList();
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
              if (this.imagesUrlServer) para.thumbnail = this.imagesUrlServer;
              exchangeAdd(para).then((res) => {
                this.addLoading = false;
                NProgress.done();
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.exchangeList();
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
          let para = { id: ids };

          exchangeDel(para).then((res) => {
            this.listLoading = false;
            NProgress.done();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.exchangeList();
          });
        }).catch(() => {

        });
      },
      //文件上传
      handleAvatarScucess(res, file){
        this.imageUrl = URL.createObjectURL(file.raw);
        this.imagesUrlServer = 'http://127.0.0.1:8360/static/upload/'+ res.data;
      },

      beforeAvatarUpload(file) {
        const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/svg+xml' || file.type === 'image/png';
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
        var createTime = util.formatDate.format(new Date(row.create_time), 'yyyy-MM-dd hh:mm:ss');
        return createTime;
      },

    },
    mounted() {
      this.exchangeList();
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

</style>
