<template>
  <div>
    <el-form :inline="true" :model="categoryForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select :disabled="!isShowTable" @change="handler1" v-model="categoryForm.category1Id" placeholder="一级分类">
          <el-option v-for="(c1,index) in category1List" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="!isShowTable" @change="handler2" v-model="categoryForm.category2Id" placeholder="二级分类">
          <el-option v-for="(c2,index) in category2List" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="!isShowTable" @change="handler3" v-model="categoryForm.category3Id" placeholder="三级分类">
          <el-option v-for="(c3,index) in category3List" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {reqCategory1List, reqCategory2List, reqCategory3List} from "@/api/product/attr";

export default {
  name: "CategorySelect",
  props: ['isShowTable'],
  data(){
    return {
      category1List:[],
      category2List:[],
      category3List:[],
      categoryForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    async getCategory1List(){
      let result = await this.$API.attr.reqCategory1List()
      // console.log(result)
      if (result.code==200){
        this.category1List=result.data
      }
    },
    async getCategory2List(){
      let result = await this.$API.attr.reqCategory2List(this.categoryForm.category1Id)
      // console.log(result)
      if (result.code==200){
        this.category2List=result.data
      }
    },
    async getCategory3List(){
      let result = await this.$API.attr.reqCategory3List(this.categoryForm.category2Id)
      // console.log(result)
      if (result.code==200){
        this.category3List=result.data
      }
    },
    // 一级分类的select事件回调
    handler1(){
      // 清除数据
      this.categoryForm.category2Id=''
      this.categoryForm.category3Id=''
      this.category2List=[]
      this.category3List=[]

      // 结构出一级分类的ID
      const {category1Id} = this.categoryForm
      this.$emit('getCategoryId', {categoryId:category1Id,level:1})
      this.getCategory2List()
    },
    handler2(){
      this.categoryForm.category3Id=''
      this.category3List=[]

      // 结构出二级分类的ID
      const {category2Id} = this.categoryForm
      this.$emit('getCategoryId',{categoryId:category2Id,level:2})
      this.getCategory3List()
    },
    handler3(){
      // 结构出三级分类的ID
      const {category3Id} = this.categoryForm
      this.$emit('getCategoryId',{categoryId:category3Id,level:3})
    }
  },
  mounted() {
    this.getCategory1List()
  }
}
</script>

<style scoped>

</style>
