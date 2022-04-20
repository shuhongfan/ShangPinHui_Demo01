import Vue from 'vue'
import Vuex from 'vuex'

import search from "@/store/search";
import detail from "@/store/detail";
import home from "@/store/home";
import shopCart from "@/store/shopcart";
import user from "@/store/user";
import trade from "@/store/trade";

Vue.use(Vuex)

// 实现Vuex长款模块化开发存储数据
const modules = {
  home,
  search,
  detail,
  shopCart,
  user,
  trade
}

export default new Vuex.Store({
  modules
})
