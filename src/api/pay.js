import { getData,postData } from "./index";

//
//获取支付记录列表
export const getPayList = (data) => {
  return getData("pay/list", data);
};

export const getIp = (data) => {
  return getData("listIp", data);
};

export const addIp = (data) => {
  return postData("addIps", data);
};
export const delIp = (data) => {
  return postData("delIp", data);
};