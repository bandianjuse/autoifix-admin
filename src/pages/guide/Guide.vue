<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.state" style="width:100px;" placeholder="状态"  @change="guideList">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="0"></el-option>
            <el-option label="通过" value="1"></el-option>
            <el-option label="不通过" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="guideList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>


    <!--列表-->
    <el-table :data="guide" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column label="缩略图" width="100">
        <template scope="scope">
          <img :src="scope.row.thumbnail" style="width: 50px;height:50px;margin-top:8px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" >
      </el-table-column>
      <el-table-column prop="thumbup_num" label="点赞" width="100" sortable>
      </el-table-column>
      <el-table-column prop="comments_num" label="评论"  width="100"  sortable>
      </el-table-column>
      <el-table-column  label="状态" >
        <template scope="scope">
          <span v-if="scope.row.state === 0">待审核</span>
          <span v-if="scope.row.state === 1" style="color:#13CE66">通过</span>
          <span v-if="scope.row.state === 2" style="color:#FF4949">不通过</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="发布时间"  :formatter="formatter" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.state === 0">审核</el-button>
          <el-button size="small"  @click="handleEdit(scope.$index, scope.row)" v-else>详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!--审核界面-->
    <el-dialog title="审核" v-model="editFormVisible" :close-on-click-modal="false">
      <div class="details-info">
        <div>用户：{{editForm.account}}</div>
        <div>标题：{{editForm.title}}</div>
        <div>缩略图：<img :src="editForm.thumbnail" class="pic" /></div>
        <div>类型：{{editForm.category_type}}</div>
        <div>车型：{{editForm.category_car}}</div>
        <div>工具配件：{{editForm.tool_name}}</div>
        <div>简介：{{editForm.introduce}}</div>
        <div v-if="editForm.details_type === 1">详情内容：{{editForm.details_content}}</div>
        <div v-if="editForm.details_type === 2">视频：{{editForm.details_video}}</div>
        <div v-if="editForm.details_type === 3">详情图文：{{editForm.details_imageatext}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="auditSubmit(1)" :loading="editLoading" v-if="editForm.state === 0">通过</el-button>
        <el-button type="danger" @click.native="auditSubmit(2)" :loading="editLoading" v-if="editForm.state === 0">不通过</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import {guideList , guideUpdate } from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          title: '',
          state: ''
        },
        guide: [],
        total: 0,
        size: 20,
        page: 1,
        listLoading: false,

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,

        //编辑界面数据
        editForm: {},

      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.guideList();

      },

      //获取列表
      guideList() {
        let para = {
          pageNo: this.page,
          pageSize: this.size,
          title: this.filters.title,
          state : this.filters.state
        };
        /*if (this.filters.categoryId) para.categoryId = this.filters.categoryId;*/
        this.listLoading = true;
        NProgress.start();
        guideList(para).then((res) => {
          this.total = res.data.totalPages;
          this.guide = res.data.data;
          this.listLoading = false;
          NProgress.done();
        });
      },
      //获取详情列表
      guideDetails(id) {
        let para = {
          all : 1,
          id: id,
        };
        NProgress.start();
        guideList(para).then((res) => {
          this.editForm = Object.assign({}, res.data);
          this.editForm.category_type = this.editForm.category[0].name;
          this.editForm.category_car = this.editForm.category[1].name;
          this.editForm.tool_name = this.editForm.tool.title;
          this.editForm.account = this.editForm.users.account;
          NProgress.done();
        });
      },
       //审核
      auditSubmit(val){
        let para = {
          id : this.editForm.id,
          state : val
        };
        guideUpdate(para).then((res) => {
          NProgress.done();
          this.$notify({
            title: '成功',
            message: '审核成功',
            type: 'success'
          });
          this.guideList();
          this.editFormVisible = false;
        });
      },
      //显示界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.guideDetails(row.id);


      },


      selsChange: function (sels) {
        this.sels = sels;
      },

      //时间格式化
      formatter(row, column){
        var createTime = util.formatDate.format(new Date(row.create_time), 'yyyy-MM-dd hh:mm:ss');
        return createTime;
      },

    },
    mounted() {
      this.guideList();
    }
  }

</script>
<style>
  .details-info .pic{
    width: 80px;
    height:80px;
    vertical-align: text-top;
  }
  .details-info div{
    padding:5px 20px;
  }


</style>
