import { getData, postData } from "./index";

//设置管理员
export const permissions = (data) => {
  // return getData("set/permissions", data);
  return postData("UsertableUp", data);
};

//获取全部套餐
export const getThaliList = (data) => {
  return postData("OuproTableGet", data);
};

//获取套餐详情
export const getPackDetail = (data) => {
  return postData("OuproTableDetailGet", data);
};

//下单
export const getPlaceOrder = (data) => {
  return postData("OuproTableDetailAdd", data);
};

//获取库存
export const getkucun = (data) => {
  return postData("OuproByGet", data);
};

// 微信导出code
export const getOpenCode = (data) => {
  return getData("get/open/code", data);
};

// 微信更新code
export const setUpdateCode = (data) => {
  return getData("updateOrderCodeWx", data);
};
