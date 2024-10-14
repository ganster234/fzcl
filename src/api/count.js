import { getData,postData } from "./index";

//获取统计列表
export const getCount = (data) => {
  return getData("num/times", data);
};
//获取支付列表
export const payprice = (data) => {
  return postData("SymoneyGet", data);
};
//修改支付状态
export const setpayprice = (data) => {
  return postData("SymoneyUpdate", data);
};
//添加支付方式
export const addpayprice = (data) => {
  return postData("SymoneyAdd", data);
};
