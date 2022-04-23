<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect :isShowTable="scene==0" @getCategoryId="getCategoryId"/>
    </el-card>

    <el-card>
      <div v-show="scene===0">
        <el-button @click="addSpu" :disabled="!category3Id" type="primary" icon="el-icon-plus">添加SPU</el-button>
        <el-table
          :data="records"
          border
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称">
          </el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="{row,$index}">
              <hint-button @click="addSku(row)" title="添加SKU" type="success" icon="el-icon-plus" size="mini"></hint-button>
              <hint-button @click="updateSpu(row)" :disabled="!category3Id"  title="修改SPU" type="warning" icon="el-icon-edit" size="mini"></hint-button>
              <hint-button @click="showSpu(row)" title="查看当前SPU全部SKU列表" type="info" icon="el-icon-info" size="mini"></hint-button>
              <el-popconfirm @coConfirm="deleteSpu(row)" :title="`确定删除${row.spuName}吗？`">
                <hint-button slot="reference" @click="deleteSpu(row)" title="删除" type="danger" icon="el-icon-delete" size="mini"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,total, sizes"
          :total="total">
        </el-pagination>
      </div>
      <SpuForm ref="spuForm" @changeScene="changeScene" v-show="scene===1"></SpuForm>
      <SkuForm ref="skuForm" @changeScenes="changeScenes" v-show="scene===2"></SkuForm>
    </el-card>

    <el-dialog :before-close="dialogClose" v-loading="loading" :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible">
      <el-table :data="skuList">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格" width="200"></el-table-column>
        <el-table-column property="weight" label="重量" width="200"></el-table-column>
        <el-table-column property="" label="默认图片">
          <template slot-scope="{row,$index}">
            <img style="{width:100px;height:100px;}" :src="row.skuDefaultImg"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {reqDeleteSpu, reqSkuList, reqSpuList} from "@/api/product/spu";
import SpuForm from "@/views/product/Spu/SpuForm";
import SkuForm from "@/views/product/Spu/SkuForm";

export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm
  },
  data(){
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      isShowTable: true,
      page:1,
      limit: 10,
      total: 0,
      records:[],
      scene:0, // 0 代表展示SPU列表数据 1 添加spu|修改spu  2 添加sku
      dialogTableVisible: false,
      skuList: [],
      spu:{},
      loading: true
    }
  },
  methods: {
    getCategoryId({categoryId,level}){
      if (level==1){
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level==2){
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 获取spu列表数据进行展示
        this.getSpuList()
      }
    },
    // 获取spu列表方法
    async getSpuList(p=1){
      this.page = p
      const {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      // console.log(result)
      if (result.code==200){
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    handleSizeChange(limit){
      this.page = 1
      this.limit = limit
      this.getSpuList()
    },
    addSpu(){
      this.scene = 1
      this.$refs.spuForm.addSpuData(this.category3Id)
    },
    updateSpu(row){
      this.scene = 1
      // 获取子组件spuForm的数据
      this.$refs.spuForm.initSpuDate(row)
    },
    // 切换场景
    changeScene({scene,flag}){
      this.scene = scene
      // console.log(scene)
      // 重新获取数据
      if (flag=='修改'){
        this.getSpuList(this.page)
      } else{
        this.getSpuList()
      }
    },
    async deleteSpu(row){
        let result = await this.$API.spu.reqDeleteSpu(row.id)
        if (result==200){
          this.$message.success(`删除${row.spuName}成功！！`)
          // spu个数大于1 删除的时候停留在当前页
          this.getSpuList(this.records.length>1?this.page:this.page-1)
        }
    },
    // 添加sku列表的回调
    addSku(row){
      this.scene=2
      // 父组件调用子组件的方法
      this.$refs.skuForm.getData(this.category1Id,this.category2Id,row)
    },
    // skuForm通知父组件修改场景
    changeScenes(scene){
      this.scene=scene
    },
    // 查看SPU的按钮回调
    async showSpu(spu){
      // 展示对话框
      this.dialogTableVisible = true
      // 保存spu信息
      this.spu=spu
      // 获取sku列表的数据进行展示
      let result = await reqSkuList(spu.id)
      console.log(result)
      if (result.code==200){
        this.skuList = result.data
        this.loading = false
      }
    },
    dialogClose(){
      this.loading = true
      this.skuList = []
    }
  }
}
</script>

<style scoped>

</style>
