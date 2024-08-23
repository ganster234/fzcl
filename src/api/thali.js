import { getData, postData } from "./index";

//设置管理员
export const permissions = (data) => {
  return getData("set/permissions", data);
};

//获取全部套餐
export const getThaliList = (data) => {
  return getData("appPrice/getAll", data);
};

//获取套餐详情
export const getPackDetail = (data) => {
  return getData("project/pack/detail", data);
};

//下单
export const getPlaceOrder = (data) => {
  return postData("pay/create", data);
};

//获取库存
export const getkucun = (data) => {
  return getData("getStcokAll", data);
};

// 微信导出code
export const getOpenCode = (data) => {
  return getData("get/open/code", data);
};

// 微信更新code
export const setUpdateCode = (data) => {
  return getData("updateOrderCodeWx", data);
};
