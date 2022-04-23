<template>
  <div>
    <el-form ref="form" label-width="80">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"/>
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input v-model="skuInfo.price" placeholder="价格（元）"/>
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input v-model="skuInfo.weight" placeholder="重量（千克）"/>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" :row="4" placeholder="规格描述"/>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true"  label-width="80px">
          <el-form-item v-for="(attr,index) in attrInfoList" :value="attr.id" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="(spuSaleAttr,index) in spuSaleAttrList" :key="spuSaleAttr.id" :label="spuSaleAttr.saleAttrName">
            <el-select :value="spuSaleAttr.attrIdAndValueId"  placeholder="请选择">
              <el-option :label="spuSaleAttrValue.saleAttrValueName" v-for="(spuSaleAttrValue,index) in spuSaleAttr.spuSaleAttrValueList" :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          :data="spuImageList"
          border
          stripe
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="图片">
            <template slot-scope="{row,$index}">
              <img width="100" height="100" :src="row.imgUrl"/>
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            prop="imgName"
            label="名称">
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template slot-scope="{row,$index}">
              <el-button @click="changeDefault(row)" v-if="row.isDefault==0" type="primary">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button @click="save" type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {reqAddSku, reqAttrInfoList, reqSpuImageList, reqSpuSaleAttrList} from "@/api/product/spu";

export default {
  name: "SkuForm",
  data(){
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售是属性
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],


      },
      spu: {},
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      imageList: []
    }
  },
  methods: {
    // 获取SkuForm数据
    async getData(category1Id,category2Id,spu){
      // 父组件传递过来的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId=spu.tmId
      this.spu=spu

      // 获取图片数据
      let result = await reqSpuImageList(spu.id)
      // console.log(result)
      if (result.code==200){
        let list = result.data
        list.forEach(item=>{
          item.isDefault=0
        })
        this.spuImageList=list
      }

      // 获取销售属性的数据
      let result1 = await reqSpuSaleAttrList(spu.id)
      if (result1.code==200){
        this.spuSaleAttrList = result1.data
      }

      // 获取平台属性
      let result2 = await reqAttrInfoList(category1Id,category2Id,spu.category3Id)
      if (result2.code==200){
        this.attrInfoList = result2.data
      }
    },
    // table表格复选框按钮的事件
    handleSelectionChange(params) {
      console.log(params)
      this.imageList = params
    },
    // 排他操作
    changeDefault(row) {
      // 图片列表的数据的isDefault字段设为0
      this.spuImageList.forEach(item=>{
        item.isDefault=0
      })
      // 点击的那个图片的数据变为1
      row.isDefault=1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancel(){
      // 自定义事件
      this.$emit('changeScenes',0)
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    async save(){
      //整理参数
      //整理平台属性
      const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this;
      //整理平台属的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [attrId,valueId]  = item.attrIdAndValueId.split(":");
          prev.push({attrId,valueId});
        }
        return prev;
      },[]);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({saleAttrId,saleAttrValueId});
        }
        return prev;
      },[]);
      //整理图片的数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id,
        }
      });
      //发请求
      let result  = await reqAddSku(skuInfo);
      if(result.code==200){
        this.$message({type:'success',message:'添加SKU成功'})
        this.$emit('changeScenes',0);
      }
    }
  }
}
</script>

<style scoped>

</style>
