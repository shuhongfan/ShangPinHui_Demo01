import request from "@/utils/request";

// 获取SPI列表数据的接口
export const reqSpuList = (page,limit,category3Id) => request({url:`/admin/product/${page}/${limit}`,method:'GET',params:{category3Id}})

// 获取SPU信息
export const reqSpu = (spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'GET'})

// 获取品牌的信息
export const reqTradeMarkList = () => request({url:`/admin/product/baseTrademark/getTrademarkList`,method:'GET'})

// 获取SPU图片的接口
export const reqSpuImageList = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取平台全部销售属性----整个平台销售属性一共就三个
export const reqBaseSaleAttrList = () => request({url:`/admin/product/baseSaleAttrList`,method:'get'})

// 修改SPU | 添加SPU
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带参数是否带有ID
  if (spuInfo.id){
    // 修改
    return request({url:`/admin/product/updateSpuInfo`,method:'post',data:spuInfo})
  } else {
    // 携带的参数不带Id  添加SPU
    return request({url:`/admin/product/saveSpuInfo`,method:'post',data:spuInfo})
  }
}

// 删除SPU
export const reqDeleteSpu = (spuId) => request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})


// 获取图片的数据
// export const reqSpuImageList = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取销售属性数据
export const reqSpuSaleAttrList = (spuId) => request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

// 获取平台属性的数据
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//添加SKU
///admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});


//获取SKU列表数据的接口
//GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});
