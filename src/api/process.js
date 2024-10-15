import { getData, postData } from "./index";

//获取支付记录列表
export const getUsdtList = (data) => {
  return postData("OupryutGet", data);
};

//通过或者拒绝
export const setUpdate = (data) => {
  return getData("usdt/update", data);
};

//修改金额
export const setUpdateUsdt = (data) => {
  return getData("update/usdt", data);
};

//修改交易单号
export const updateAddr = (data) => {
  return postData("updateAddr", data);
};

//项目申请列表
export const projectapply = (data) => {
  return getData("application/project", data);
};
