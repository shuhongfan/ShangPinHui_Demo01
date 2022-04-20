import {reqAddressInfo, reqOrderInfo} from "@/api";

const state = {
    userAddress:[],
    orderInfo:{}
}

// mutations修改state的唯一手段
const mutations={
    GETUSERADDRESS(state,userAddress){
        state.userAddress = userAddress
    },
    GETORDERINFO(state,orderInfo){
        state.orderInfo = orderInfo
    }
}

// action: 处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    async getUserAddress({commit}){
        let result = await reqAddressInfo()
        // console.log(result)
        if (result.code==200){
            commit("GETUSERADDRESS",result.data)
        }
    },
    async getOrderInfo({commit}){
        let result = await reqOrderInfo()
        if (result.code==200){
            commit("GETORDERINFO",result.data)
        }
    }
}

// getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {

}


export default {
    state,
    mutations,
    actions,
    getters
}
