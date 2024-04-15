import { getData, postData } from "./index";

//获取open列表
export const getOpenList = (data) => {
  return getData("open/list", data);
};

//获取open列表
export const setAddOpen = (data) => {
  return postData("add/open", data);
};

//下载open
export const getUserOpen = (data) => {
  return getData("user/open/list", data);
};

// open，ck售后
export const setAftermarket = (data) => {
  return getData("open/aftermarket", data);
};

// open，ck续费
export const setRenew = (data) => {
  return getData("renew", data);
};

//open，ck更新
export const setRenewUpdate = (data) => {
  return getData("update/open/code", data);
};
