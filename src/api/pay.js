import { getData, postData } from "./index";

//
//获取支付记录列表
export const getPayList = (data) => {
  return getData("pay/list", data);
};

export const getIp = (data) => {
  return postData("OuIpGet", data);
};
export const addIp = (data) => {
  return postData("OuIpAdd", data);
};
export const delIp = (data) => {
  return postData("OuIpDel", data);
};
