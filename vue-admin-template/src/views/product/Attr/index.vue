<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect :isShowTable="isShowTable" @getCategoryId="getCategoryId"/>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button :disabled="!category3Id" @click="addAttr" type="primary" icon="el-icon-plus">添加属性</el-button>

        <el-table
          :data="attrList"
          border
          stripe
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag
                style="margin-right: 5px;" type="succee"
                v-for="(attrValue,index) in row.attrValueList"
                :key="attrValue.id">
                {{attrValue.valueName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            prop="address"
            label="操作">
            <template slot-scope="{row,$index}">
              <el-button style="margin-right: 5px;" @click="editAttr(row)" type="warning" icon="el-icon-edit" size="mini"></el-button>
              <el-popconfirm :title="`确定删除${row.attrName}吗？`" @onConfirm="deleteAttr(row,$index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <el-form v-show="!isShowTable" :inline="true">
        <el-form-item label="属性名">
          <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"/>
        </el-form-item>
        <el-button @click="addAttrValue" :disabled="!attrInfo.attrName" type="primary" icon="el-icon-plus">添加属性值</el-button>
        <el-button @click="isShowTable=true" type="warning">取消</el-button>

        <el-table
          :data="attrInfo.attrValueList"
          border
          style="width: 100%;margin: 20px 0;">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input
                :ref="$index"
                @keyup.native.enter="toLook(row)"
                @blur="toLook(row)"
                v-if="row.flag"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"></el-input>
              <span style="display: block;" @click="toEdit(row,$index)" v-else>{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            width="180"
            label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue(row,$index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr" type="primary">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import {reqAddOrUpdateAttr, reqAttrList, reqDeleteArr} from "@/api/product/attr";
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: "Attr",
  data(){
    return{
      attrList:[],
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 这个属性控制table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性使用
      attrInfo: {
        attrName: "", // 属性名
        attrValueList: [],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3,  //
      },
    }
  },
  methods:{
    getCategoryId({categoryId,level}){
      if (level==1){
        this.category1Id=categoryId
        this.category2Id=''
        this.category3Id=''
      } else if (level==2){
        this.category2Id=categoryId
        this.category3Id=''
      } else if (level==3){
        this.category3Id=categoryId
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    // 当用户确定三级分类的数据的时候，可以向服务器获取平台属性进行展示
    async getAttrList(){
      // 获取分类的id
      const {category1Id,category2Id,category3Id} = this
      let result = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id)
      // console.log(result)
      if (result.code==200){
        this.attrList=result.data
      }
    },
    // 添加属性
    addAttr(){
      this.isShowTable=false
      this.attrInfo={
        attrName: "", // 属性名
        attrValueList: [],
        categoryId: this.category3Id, // 三级分类的id
        categoryLevel: 3,  //
      }
    },
    // 修改某个属性
    editAttr(row){
      this.isShowTable=false
      // 由于数据结构中存在对象里面套数组，数组里面套对象，因此需要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将响应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach(item=>{
        // 这样书写也可以给属性值添加flag属性，但是会发现不会跟着变化（因为flag不是响应式数据）
        // 因为Vue无法探测普通的新增property，这样书写的属性非响应式属性
        // item.flag = false
        this.$set(item,'flag',false)
      })
    },
    // 添加属性值
    addAttrValue(){
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 相应属性名的id
        valueName: '',
        flag: true
      })

      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    toLook(row){
      // 当前的编辑模式变为查看模式
      if (row.valueName.trim()=='') {
        this.$message.error('请你输入一个正常的属性值！！！')
        return
      }
      // 新增属性不能与已有属性值重复
      let isRepeat = this.attrInfo.attrValueList.some(item=>{
        // 需要将row从数组里面判断的时候去除
        if (row!==item){
          return row.valueName == item.valueName
        }
      })
      if (isRepeat){
        this.$message.error("属性值重复")
        return
      }
      row.flag = false
    },
    toEdit(row,index){
      row.flag=true

      // 获取input接口，实现自动聚焦
      // $nextTick 当页面节点渲染完毕了，会执行一次
      this.$nextTick(()=>{
        // console.log(this.$refs[index])
        // 获取相应的表单元素
        this.$refs[index].focus()
      })
    },
    deleteAttrValue(row,index){
      // console.log(index)
      this.attrInfo.attrValueList.splice(index,1)
    },
    async deleteAttr(row,index){
      const result = await this.$API.attr.reqDeleteArr(row.id)
      if (result.code==200){
        this.$message.success(`删除${row.attrName}成功！`)
        this.getAttrList()
      } else {
        this.$message.success(`删除${row.attrName}失败！`)
      }
    },
    // 保存按钮
    async addOrUpdateAttr(){
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        // 过滤掉属性值不为空的
        if (item.valueName!=''){
          // 删除flag属性
          delete item.flag
          return true
        }
      })
      try { // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.$message.success("保存成功")
        // 切换到平台属性
        this.isShowTable=true
        // 重新获取数据
        this.getAttrList()

      } catch (e) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style scoped>

</style>
