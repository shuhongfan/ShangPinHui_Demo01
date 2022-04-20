import request from "./request";
import mockAjax from "@/api/mockAjax";

// 首页三级分类
export const reqCategoryList = () => request({url:'/product/getBaseCategoryList',method:'get'})

// mock数据
// banner
export const reqGetBannerList = () => mockAjax.get('/banner')
// floor
export const reqFloorList = () => mockAjax.get('/floor')


// 搜索商品
export const reqGetSearchInfo = (params) => request({url:'/list',method:'post',data:params})

// 产品详细信息
export const reqGoodsInfo = (skuId) => request({url:`/item/${skuId}`,method:'get'})

// 添加商品到购物车
export const reqAddOrUpdateShopCart = (skuId,skuNum) => request({url:`/cart/addToCart/${skuId}/${skuNum}`,method:"post"})

// 获取购物车列表
export const reqCartList = () => request({url:`/cart/cartList`,method:'get'})

// 删除购物产品的接口
export const reqDeleteCartById = (skuId)=>request({url:`/cart/deleteCart/${skuId}`,method:'DELETE'})

// 修改商品状态
export const reqUpdateCheckedById=(skuId,isChecked)=>request({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'})

// 获取验证码
export const reqGetCode = (phone) => request({url:`/user/passport/sendCode/${phone}`,method:'get'})

// 注册
export const reqUserRegister = (data)=>request({url:`/user/passport/register`,data,method:'post'})

// 登录
export const reqUserLogin = (data) => request({url:`/user/passport/login`,data,method:'post'})

// 获取用户信息
export const reqUserInfo = () => request({url:`/user/passport/auth/getUserInfo`,method:'get'});

// 退出登录
export const reqLogout = () => request({url:`/user/passport/logout`,method:'get'})

// 获取用户地址信息
export const reqAddressInfo = () => request({url:`/user/userAddress/auth/findUserAddressList`,method:'get'})

// 获取商品清单
export const reqOrderInfo = () => request({url:`/order/auth/trade`,method:'get'})


// 提交订单
export const reqSubmitOrder = (tradeNo,data)=>request({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'})


// 获取支付信息
export const reqPayInfo = (orderId) => request({url:`/payment/weixin/createNative/${orderId}`,method:'get'})

// 订单状态查询
export const reqPayStatus = (orderId) => request({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})


// 获取个人中心的数据
export const reqMyOrderList = (page,limit) => request({url:`/order/auth/${page}/${limit}`,method: 'get'})
