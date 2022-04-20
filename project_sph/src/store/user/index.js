import {reqGetCode, reqLogout, reqUserInfo, reqUserLogin, reqUserRegister} from "@/api";
import {getToken, removeToken, setToken} from "@/utils/token";

const state = {
    code:'',
    token: getToken(),
    userInfo:{}
}

// mutations修改state的唯一手段
const mutations={
    GETCODE(state,code){
        state.code = code
    },
    GETUSERINFO(state,userInfo){
        state.userInfo = userInfo
    },
    USERLOGIN(state,token){
        state.token = token
    },
    // 清楚本地数据
    CLEAR(state){
        state.token=''
        state.userInfo={}
        removeToken()
    }
}

// action: 处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // 获取验证码
    async getCode({commit},phone){
        let result = await reqGetCode(phone)
        // console.log(result)
        if (result.code==200){
            commit("GETCODE",result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    async userRegister({ commit },user){
        let result = await reqUserRegister(user)
        console.log(result)
        if (result.code==200){
            return  'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }
    },
    async userLogin({commit,state },user){
        let result = await reqUserLogin(user)
        console.log(result)
        if (result.code==200){
            commit("USERLOGIN",result.data.token)
            setToken(result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }
    },
    async getUserInfo({commit}){
        let result = await reqUserInfo()
        console.log(result)
        if (result.code==200){
            commit('GETUSERINFO',result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
        }
    },
    async userLogout({commit}){
        let result = await reqLogout()
        if (result.code==200){
            commit('CLEAR')
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message))
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
