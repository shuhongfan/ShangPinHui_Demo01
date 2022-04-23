<template>
  <div>
    <el-table :data="skuList">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"></el-table-column>
      <el-table-column prop="skuDefaultImg" width="110" label="默认图片">
        <template slot-scope="{row,index}">
          <img :src="row.skuDefaultImg" style="width:100px;height:100px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="weight" width="80" label="重量"></el-table-column>
      <el-table-column prop="price" width="80" label="价格"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.isSale==0" @click="sale(row)" type="success" icon="el-icon-sort-up" size="mini"></el-button>
          <el-button v-else @click="cancel(row)" type="success" icon="el-icon-sort-down" size="mini"></el-button>
          <el-button @click="edit" type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button @click="getSkuInfo(row)" type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total">
    </el-pagination>

<!--    抽屉效果-->
    <el-drawer
      title="我是标题"
      size="50%"
      :visible.sync="drawer"
      :direction="direction">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag style="margin-right: 10px;" type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id">{{ attr.attrId }}--{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl"/>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

  </div>
</template>

<script>
import {reqCancel, reqSale, reqSkuById, reqSkuList} from "@/api/product/sku";

export default {
  name: "Sku",
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit=val
      this.getSkuList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getSkuList(val)
    },
    async getSkuList(pages=1){
      this.page=pages
      let result = await reqSkuList(this.page,this.limit)
      if (result.code==200){
        this.skuList = result.data.records
        this.total = result.data.total
      }
    },
    async sale(row) {
      let result = await reqSale(row.id)
      if (result.code==200){
        this.$message.success('上架成功')
        this.isSale=true
        this.getSkuList(this.page)
      }
    },
    async cancel(row) {
      let result = await reqCancel(row.id)
      if (result.code==200){
        this.$message.success('下架成功')
        this.isSale=false
        this.getSkuList(this.page)
      }
    },
    edit(){
      this.$message.success('开发中')
    },
    async getSkuInfo(sku){
      let result = await reqSkuById(sku.id)
      if (result.code==200){
        this.skuInfo = result.data
      }
      this.drawer=true
    }
  },
  data(){
    return{
      page: 1,
      limit: 10,
      total: 0,
      skuList: [],
      skuInfo: {},
      drawer: false,
      direction: 'rtl',
    }
  },
  mounted() {
    this.getSkuList()
  }
}
</script>

<style scoped>
.el-row .el-col-5{
    font-size: 18px;
    text-align:right;
}
.el-col{
  margin: 10px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

</style>
