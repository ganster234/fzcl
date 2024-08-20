import { getData, postData } from "./index";

//配置url列表
export const getUrlList = (data) => {
  return getData("configList", data);
};
//开启或关闭url配置
export const openOrCloseTheUrl = (data) => {
  return getData("updateConfigStatus", data);
};
//修改配置url
export const setConfigUrl = (data) => {
  return postData("updateConfig", data);
};
//新增配置url
export const addConfigUrl = (data) => {
  return postData("addConfig", data);
};
