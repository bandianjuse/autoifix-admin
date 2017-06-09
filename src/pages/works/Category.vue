<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText" style="width:300px">
      </el-input>
      <el-button type="primary"  @click="handleAdd">新增分类</el-button>
    </el-col>

    <!--列表-->
    <el-col :span="24" class="toolbar" v-loading="listLoading">
      <el-tree
        class="filter-tree"
        :data="category"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        :render-content="renderContent"
        ref="tree">
      </el-tree>
    </el-col>

    <!--新增界面-->
    <el-dialog title="新增分类" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑分类" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import { getCategoryList , addCategory , removeCategory , editCategory} from '../../api/api';
  export default {
    watch: {
      filters : {

      },
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      return {
        filterText: '',
        category: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        listLoading: false,
        addForm : {},
        addFormRules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        editFormVisible :false,
        editLoading: false,
        editForm : {},
        editFormRules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
      }
    },
    methods: {
      //过滤节点
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //分类树形数据重组
      categoryTree(data){
      let newCategory = [];
      for (let i = 0; i < data.length; i++) {
        if (!data[i].parentId) {
          var id = data[i].id;
          var newCategoryChind = [];
          for (let j = 0; j < data.length; j++) {
            if (id == data[j].parentId) {
              newCategoryChind.push(data[j]);
              data[i].children = newCategoryChind;
            }
          }
          newCategory.push(data[i]);
        }
      }
      return newCategory;
    },
      //获取分类列表
      getCategoryList() {
        let para = {
          page: 1,
          size: 100
        };
        this.listLoading = true;
        NProgress.start();
        getCategoryList(para).then((res) => {
          let categoryArr = res.data.data;
          this.category = this.categoryTree(categoryArr);
          this.listLoading = false;
          NProgress.done();
        });

      },

      //显示新增分类
      handleAdd(){
        this.addFormVisible = true;
        this.addForm = {};
      },

      //新增分类
      addSubmit(){
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              NProgress.start();
              let para = Object.assign({}, this.addForm);
              addCategory(para).then((res) => {
                this.addLoading = false;
                NProgress.done();
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getCategoryList();
              });
            });
          }
        });
      },

      //编辑分类
      editSubmit(){
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              NProgress.start();
              let para = Object.assign({}, this.editForm);
              editCategory(para).then((res) => {
                this.editLoading = false;
                NProgress.done();
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getCategoryList();
              });
            });
          }
        });
      },

      append(store, data) {
        this.addFormVisible = true;
        this.addForm.parentId = data.id;
      },

      remove(store, data) {
        let msm = '确认删除该记录吗?';
        if(!data.parentId) msm = '确认删除该父类以及它的子类记录吗?';
        this.$confirm(msm, '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
        NProgress.start();
        let para = { id: data.id };
        removeCategory(para).then((res) => {
          this.listLoadg = false;
        NProgress.done();
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        });
        this.getCategoryList();
      });
      }).catch(() => {

        });
      },
      editor(store, data) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, data);
      },
      renderContent(h, { node, data, store }) {
        return  (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button size="small" style = {data.parentId ? 'display:none' : '' }  on-click={ () => this.append(store, data) }>添加</el-button>
              <el-button  size="small" on-click={ () => this.editor(store, data) }>编辑</el-button>
              <el-button type="danger" size="small" on-click={ () => this.remove(store, data) }>删除</el-button>
            </span>
        </span>
        )
      }
    },

    mounted() {
      this.getCategoryList();
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

  .quill-editor {
    height: 150px !important;
  }

  .ql-snow .ql-picker {
    height: 35px !important;
  }

  .el-form-item__content {
    line-height: 0 !important;
  }

  .chindClass {
    padding-left: 30px !important;
  }
</style>
