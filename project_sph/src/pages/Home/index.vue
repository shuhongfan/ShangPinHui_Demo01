<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer/>
    <TodayRecommend/>
    <Rank></Rank>
    <Like></Like>
    <Floor :list="floor" v-for="floor in floorList" :key="floor.id"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
import ListContainer from "@/pages/Home/ListContainer";
import TodayRecommend from "@/pages/Home/TodayRecommend";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";
import {mapState} from "vuex";

export default {
  name: "home",
  components:{
    ListContainer,
    TodayRecommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  computed:{
    ...mapState({
      floorList: state=>state.home.floorList
    }),
  },
  methods:{
  },
  mounted() {
    this.$store.dispatch("getFloorList")
    this.$store.dispatch('getUserInfo')
  }
}
</script>

<style scoped>

</style>
