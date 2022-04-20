// state仓库存储数据的地方
import {reqGetSearchInfo} from "@/api";

const state = {
    searchList: {}
}

// mutations修改state的唯一手段
const mutations={
    GETSEARCHLIST(state,searchList){
        state.searchList=searchList
    }
}

// action: 处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // 这里可以书写业务逻辑，但是不能修改state
    async getSearchList({commit},params) {
        let result = await reqGetSearchInfo(params)
        // console.log(result)
        if (result.code==200){
            commit("GETSEARCHLIST",result.data)
        }
    }
}

// getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    goodsList(state){
        return state.searchList.goodsList
    },
    trademarkList(state){
        return state.searchList.trademarkList
    },
    attrsList(state){
        return state.searchList.attrsList
    }
}


export default {
    state,
    mutations,
    actions,
    getters
}
