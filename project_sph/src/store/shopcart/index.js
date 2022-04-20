import {reqCartList, reqDeleteCartById, reqUpdateCheckedById} from "@/api";

const state = {
    cartList:[]
}

// mutations修改state的唯一手段
const mutations={
    GATECHARTLIST(state,cartList){
        state.cartList = cartList
    }
}

// action: 处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    async getCartList({commit}){
        let result = await reqCartList()
        // console.log(result)
        if (result.code==200){
            commit("GATECHARTLIST",result.data)
        }
    },
    async deleteCartListBySkuId({ commit },skuid){
        let result = await reqDeleteCartById(skuid)
        console.log(result)
        if (result.code==200){
            return 'ok'
        } else {
            return Promise.reject(new Error("error"))
        }
    },
    async updateCheckedById({commit},{skuId,isChecked}){
        let result = await reqUpdateCheckedById(skuId,isChecked)
        if (result.code==200){
            return 'ok'
        } else {
            return Promise.reject(new Error('error'))
        }
    },
    deleteAllCheckedCart({dispatch, getters}){
        let PromiseAll = []
        getters.cartList.cartInfoList.forEach(item=>{
            let promise = item.isChecked==1 ? dispatch('deleteCartListBySkuId',item.skuId):''
            PromiseAll.push(promise)
        })
        return Promise.all(PromiseAll)
    },
    updateAllCartIsChecked({dispatch,state},isChecked){
        let promiseAll = []
        state.cartList[0].cartInfoList.forEach(item=>{
            let promise = dispatch('updateCheckedById', {skuId:item.skuId,isChecked})
            promiseAll.push(promise)
        })
        return Promise.all(promiseAll)
    }
}

// getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    cartList(state){
        return state.cartList[0] || {}
    }
}


export default {
    state,
    mutations,
    actions,
    getters
}
