import request from "@/utils/request";


// 平台属性管理模块请求文件
// 获取一级分类文件
export const reqCategory1List = () => request({url:`/admin/product/getCategory1`,method: 'GET'})

// 获取二级分类数据接口
export const reqCategory2List = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method: 'GET'})


// 获取三级分类数据接口
export const reqCategory3List = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`,method: 'GET'})


// 获取平台属性的接口
export const reqAttrList = (category1Id, category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method: 'GET'})


// 添加属性与属性值接口
export const reqAddOrUpdateAttr = (data) => request({url:`/admin/product/saveAttrInfo`,method: 'post',data})

// 删除平台属性
export const reqDeleteArr = (attrId) => request({url:`/admin/product/deleteAttr/${attrId}`,method: 'delete'})
