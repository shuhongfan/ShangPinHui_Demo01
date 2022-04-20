<template>
  <div class="pagination">
    <button
        :disabled="pageNo==1"
        @click="$emit('getPageNo',pageNo-1)"
        v-if="startNumAndEndNum.start>2">上一页</button>
    <button
        :class="{active: pageNo==1}"
        v-if="startNumAndEndNum.start>1"
        @click="$emit('getPageNo',1)">1</button>
    <button v-if="startNumAndEndNum.start>2">···</button>

    <button v-for="(page,index) in startNumAndEndNum.end"
            :key="index"
            @click="$emit('getPageNo',page)"
            :class="{active: pageNo==page}"
            v-if="page>=startNumAndEndNum.start">
      {{page}}
    </button>

    <button v-if="startNumAndEndNum.end<totalPage-1">···</button>
    <button
        :class="{active: pageNo==totalPage}"
        @click="$emit('getPageNo',totalPage)"
        v-if="startNumAndEndNum.end<totalPage">{{totalPage}}</button>
    <button
        :disabled="pageNo===totalPage"
        @click="$emit('getPageNo',pageNo+1)">下一页</button>

    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props:['pageNo','pageSize','total','continues'],
  computed:{
    totalPage(){
      const {pageNo,pageSize,total,continues} = this;
      return Math.ceil(total/pageSize)
    },
    startNumAndEndNum(){
      const {pageNo,pageSize,total,continues} = this;
      let start = 0,end = 0
      if (this.totalPage<continues){
        end=continues
      } else {
        start = pageNo-parseInt(continues/2)
        end = pageNo+parseInt(continues / 2)
        if (start<1){
          start=1
          end=continues
        }
        if (end>this.totalPage){
          end=this.totalPage
          start=this.totalPage-continues+1
        }
      }
      return {start,end}
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
