// state仓库存储数据的地方
import {reqAddOrUpdateShopCart, reqGoodsInfo} from "@/api";
import {getUUID} from "@/utils/uuid_token";

const state = {
    goodInfo:{},
    // 游客临时身份
    uuid_token: getUUID(),
}

// mutations修改state的唯一手段
const mutations={
    GOODINFO(state,goodInfo){
        state.goodInfo=goodInfo
    }
}

// action: 处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // 这里可以书写业务逻辑，但是不能修改state
    async getGoodInfo({commit},skuId){
        let result = await reqGoodsInfo(skuId)
        if (result.code==200){
            commit('GOODINFO',result.data)
        }
    },

    // async函数执行返回结果一定是一个promise  要么成功，要么失败
    async addOrUpdateShopCart({commit},{skuId,skuNum}){
        let result = await reqAddOrUpdateShopCart(skuId,skuNum)
        console.log(result)
        // 当前这个函数执行返回promise
        if (result.code == 200){
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    }
}

// getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    categoryView(state){
        return state.goodInfo.categoryView || {}
    },
    skuInfo(state){
        return state.goodInfo.skuInfo || {}
    },
    skuSaleAttrValueList(state) {
        return state.goodInfo.skuInfo.skuSaleAttrValueList || []
    },
    spuSaleAttrList(state){
        return state.goodInfo.spuSaleAttrList || []
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
