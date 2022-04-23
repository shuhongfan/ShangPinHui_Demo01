<template>
  <div>
<!--    按钮-->
    <el-button @click="addTradeMark" icon="el-icon-plus" type="primary" style="margin:10px 0">添加</el-button>

<!--    表格组件-->
    <el-table
      border
      stripe
      :data="records"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" width="100px" height="100px"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="{row,$index}">
          <el-button @click="updateTradeMark(row)" type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button @click="deleteTradeMark(row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px;text-align: center;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper,->, total, sizes "
      :total="total">
    </el-pagination>

<!--    嵌套表单的 Dialog-->
    <el-dialog  :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="addOrUpdateTradeMarkForm"   width="80%" :model="tmForm">
        <el-form-item prop="tmName" label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data(){
    var validateTmName = (rule, value, callback) => {
      if (value.length<2 || value.length>10) {
        callback(new Error('品牌名称2-10位'));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 5,
      total: 0,
      pages: 0,
      records: [],
      // 对话框显示与隐藏
      dialogFormVisible: false,
      tmForm:{
        logoUrl: "",
        tmName: ""
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        // 品牌的logo验证规则
        logoUrl: [
          { required: true, message: '请选择品牌的图片'}
        ]
      },
    }
  },
  // 组件挂载完毕发送请求
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList(pager=1){
      this.page=pager
      const {page,limit} = this
      let result = await this.$API.tradeMark.reqTradeMarkList(page,limit)
      // console.log(result)
      if (result.code==200){
        this.records = result.data.records
        this.total = result.data.total
        this.pages = result.data.pages
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit=val
      this.getPageList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getPageList(val)
    },
    addTradeMark(){
      this.dialogFormVisible = true
      this.tmForm={
        logoUrl: "",
        tmName: ""
      }
    },
    // 更新
    updateTradeMark(row){
      this.dialogFormVisible = true
      this.tmForm = {...row}
      this.getPageList(this.tmForm.id?this.page:1)
    },
    handleAvatarSuccess(res, file) {
      console.log(res,file)
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    addOrUpdateTradeMark(){
      this.$refs[addOrUpdateTradeMarkForm].validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          console.log(result)
          if (result.code === 200){
            // 弹出信息
            this.$message({type:'success',message:this.tmForm.id ? '修改品牌成功' : '添加品牌成功'})
            // 添加或者修改品牌成功后,需要再次获取
            this.getPageList()
          }
        } else {
          this.$message.error('error submit!!');
          return false;
        }
      });
    },
    deleteTradeMark(row){
      this.$confirm(`此操作将永久删除${row.tmName}品牌, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        if (result.code==200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 再次获取品牌列表数据
          this.getPageList(this.list.length>1?this.page:this.page-1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
