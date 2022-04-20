import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TypeNav from "@/components/TypeNav";
import Pagination from "@/components/Pagination";
import store from './store'
import '@/mock/mockServe'
import 'swiper/css/swiper.css'
import * as API from '@/api'
import Carsousel from '@/components/Carousel'
import {Button, MessageBox} from "element-ui";
import VueLazyload from "vue-lazyload";
import myPlugins from "@/plugins/myPlugins";
Vue.config.productionTip = false

// 图片懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '@/assets/logo.png',
  loading: '@/assets/logo.png',
  attempt: 1
})

// 三级联动组件-----全局组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carsousel.name,Carsousel)
Vue.component(Pagination.name,Pagination)

// elementUI
Vue.component(Button.name, Button);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;


// 引入自定义插件
Vue.use(myPlugins,{
  name:'upper'
})

// vee表单验证
import "@/plugins/validate"

new Vue({
  // 注册路由
  router,
  store,
  beforeCreate() {
    // 全局事件总线$bus的配置
    Vue.prototype.$bus=this
    Vue.prototype.$API = API
  },
  render: h => h(App)
}).$mount('#app')
