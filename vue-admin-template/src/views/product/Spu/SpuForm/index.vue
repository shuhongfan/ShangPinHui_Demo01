<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option v-for="(tm,index) in tradeMarkList" :key="tm.id" :value="tm.id" :label="tm.tmName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" :rows="4" placeholder="SPU描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-success="handlePictureCardSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option v-for="(unSelect,index) in unSelectSaleAttr"
                     :key="unSelect.id"
                     :value="`${unSelect.id}:${unSelect.name}`"
                     :label="unSelect.name"/>
        </el-select>
        <el-button @click="addSaleAttr" :disabled="!attrIdAndAttrName" type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table
          :data="spu.spuSaleAttrList"
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="180">
          </el-table-column>
          <el-table-column
            label="属性值名称列表">
            <template slot-scope="{row,$index}">
              <el-tag
                v-for="(spuSaleAttrValue,$index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row,index)">
                {{spuSaleAttrValue.saleAttrValueName}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <el-button @click="addSaleAttrValue(row)" v-else class="button-new-tag" size="small">+ 新增</el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="操作">
            <template slot-scope="{row,$index}">
              <el-button @click="spu.spuSaleAttrList.splice($index,1)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button @click="addOrUpdateSpu" type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>>
  </div>
</template>

<script>
import {reqAddOrUpdateSpu, reqBaseSaleAttrList, reqSpu, reqSpuImageList, reqTradeMarkList} from "@/api/product/spu";

export default {
  name: "SpuForm",
  data(){
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu:{
        // 三级分类的ID
        category3Id: 0,
        // 描述
        description: '',
        // 平台的ID
        id: 0,
        // 收集SPU图片的信息
        spuImageList: [
          {
            id: 0,
            imgName: '',
            imgUrl: '',
            spuId: 0
          }
        ],
        // 平台属性与平台属性值收集
        spuName: '',
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
        tmId: 0
      },// 存储SPU信息属性
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片数据
      saleAttrList:[],  //销售属性
      attrIdAndAttrName: ''
    }
  },
  computed:{
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      return this.saleAttrList.filter(item=>{
        // every数组的方法，返回一个布尔值
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name!=item1.saleAttrName
        })
      });
    }
  },
  methods: {
    // 照片墙上传成功
    handlePictureCardSuccess(response,file,fileList){
      console.log(response,file,fileList)
      this.spuImageList=fileList
    },
    // 照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      // file：代表删除的那张图片
      // fileList:删除之后的图片
      console.log(file, fileList);
      this.spuImageList = fileList
    },
    // 照片墙预览的回调
    handlePictureCardPreview(file) {
      // 将图片的地址赋值给这个属性
      this.dialogImageUrl = file.url;
      // 对话框展示
      this.dialogVisible = true;
    },
    // 初始化SpuForm数据
    async initSpuDate(spu){
      // 获取spu信息的数据
      let spuResult = await reqSpu(spu.id);
      console.log(spuResult)
      if (spuResult.code == 200) {
        this.spu=spuResult.data;
      }

      // 获取品牌的信息
      let tradeMarkResult = await reqTradeMarkList()
      console.log(tradeMarkResult)
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      // 获取spu图片的数据
      let spuImageResult = await reqSpuImageList(spu.id)
      console.log(spuImageResult)
      if (spuImageResult.code ==200){
        let imgData = spuImageResult.data;
        imgData.forEach(item=>{
          item.name=item.imgName
          item.url=item.imgUrl
        })

        this.spuImageList =imgData
      }

      // 获取平台全部的销售属性
      let saleResult = await reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    handleClose(row,index) {
      row.spuSaleAttrValueList.splice(index,1)
    },
    // input失去焦点
    handleInputConfirm(row) {
      console.log(row)
      let {baseSaleAttrId,inputValue} = row;
      // 新增的销售属性值名称不能为空
      if (inputValue.trim()==''){
        this.$message.error('属性值不能为空')
        return
      }
      // 属性值不能重复
      let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
      if (!result) return;
      // 新增的销售属性值
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false;
      row.inputValue = '';
    },
    addSaleAttr(){
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(":")
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      this.spu.spuSaleAttrList.push(newSaleAttr)
    },
    addSaleAttrValue(row){
      // row.inputValue = true  不生效
      this.$set(row,'inputVisible',true)
      this.$set(row,'inputValue','')
    },
    async addOrUpdateSpu(){
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      let result = await reqAddOrUpdateSpu(this.spu)
      // console.log(result)
      if (result.code==200){
        this.$message.success('修改成功！')
        // 回到场景0
        this.$emit('changeScene', {scene:0,flag:this.spu.id?'修改':'添加'})
      } else {
        this.$message.error('修改失败！')
      }

      // 清理数据
      // Object.assign 合并对象
      // 组件实例 this._data,可以操作data当中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data,this.$options.data());
    },
    async addSpuData(category3Id){
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      let tradeMarkResult = await reqTradeMarkList()
      console.log(tradeMarkResult)
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      // 获取平台全部的销售属性
      let saleResult = await reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    cancel(){
      // 取消添加
      this.$emit('changeScene',{scene:0,flag:''})

      // 清理数据
      // Object.assign 合并对象
      // 组件实例 this._data,可以操作data当中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data,this.$options.data());
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
