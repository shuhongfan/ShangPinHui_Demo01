<template>
  <div ref="swiper" class="swiper-container" id="floor1Swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="c in list" :key="c.id">
        <img :src="c.imgUrl">
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper"

export default {
  name: "Carsousel",
  props: ['list'],
  watch: {
    list:{
      immediate: true, // 立即监听
      handler(newValue, oldValue){
        // console.log('我在监听floor组件中的list数据')
        this.$nextTick(()=>{
          // 这个函数执行，只能保证bannerList数据已经有了，没办法保证v-for已经执行结束了
          new Swiper(this.$refs.swiper,{
            loop: true, // 循环模式
            // 分页器
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            // 前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
