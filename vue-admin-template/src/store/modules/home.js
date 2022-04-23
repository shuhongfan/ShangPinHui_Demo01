import mockRequest from "@/utils/mockRequest";
import log from "echarts/src/scale/Log";

const state={
  list: {}
}

const mutations={
  GETDATA(state,list){
    state.list=list
  }
}

const actions= {
    // 发请求获取首页的mock数据
  async getData({commit}){
    let result = await mockRequest.get('/home/list')
    console.info(result)
    if (result.code==20000){
      commit('GETDATA',result.data)
    }
  }
}

const getters={

}

export default {
  state,
  mutations,
  actions,
  getters
}
