<template>
  <div id="app">
    <Header/>
    <router-view/>
    <Footer v-show="$route.meta.show"/>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components:{
    Header,
    Footer,
  },
  // 组件挂载完毕，可以像服务器发请求
  mounted() {
    // 通过Vuex发请求，获取数据，存储于仓库中
    this.$store.dispatch('categoryList')
    // console.log("我是TypeNav  挂载完毕")
    if (this.$route.path=='/search'){
      this.show = false
    }
  }
}
</script>

<style lang="less">

</style>
