// 将四个模块请求的接口函数统一暴露


import * as tradeMark from "./product/tradeMark.js";
import * as attr from "./product/attr.js";
import * as spu from "./product/spu.js";
import * as sku from "./product/sku.js";
import * as user from '@/api/acl/user';
import role from "@/api/acl/role";
import permission from "@/api/acl/permission";

export default {
  tradeMark,
  attr,
  spu,
  sku,
  user,
  role,
  permission
}

