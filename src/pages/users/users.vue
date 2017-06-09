<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.account" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="usersList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading"
              style="width: 100%;">
      <el-table-column label="头像" width="100">
        <template scope="scope">
          <img :src="scope.row.avatar" style="width: 50px;height:50px;margin-top:8px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账号" >
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" >
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" >
      </el-table-column>
      <el-table-column prop="sex" label="性别" :formatter="formatterSex">
      </el-table-column>
      <el-table-column prop="birthday" label="生日" >
      </el-table-column>
      <el-table-column prop="integral" label="积分" >
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="120" :formatter="formatter" sortable>
      </el-table-column>
      <!--<el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>


  </section>
</template>

<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import { usersList  } from '../../api/api';
  export default {
    data() {
      return {
        filters: {
          account: '',
        },
        users: [],
        total: 0,
        size: 20,
        page: 1,
        listLoading: false
      }
    },
    methods: {

      handleCurrentChange(val) {
        this.page = val;
        this.usersList();

      },

      //获取列表
      usersList() {
        let para = {
          page: this.page,
          pageSize: this.size,
          account: this.filters.account
        };
        this.listLoading = true;
        NProgress.start();
        usersList(para).then((res) => {
          this.total = res.data.totalPages;
          this.users = res.data.data;
          this.listLoading = false;
          NProgress.done();
        });
      },

      //时间格式化
      formatter(row, column){
        var createTime = util.formatDate.format(new Date(row.create_time), 'yyyy-MM-dd hh:mm:ss');
        return createTime;
      },
      //格式性别
      formatterSex(row, column){
        let sex = row.sex;
        let sexStr = '未知';
        if(sex === 0){
          sexStr = '男';
        }else if(sex == 1){
          sexStr = '女';
        }
        return sexStr;

      }

    },
    mounted() {
      this.usersList();
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
