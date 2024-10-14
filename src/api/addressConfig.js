import { getData, postData } from "./index";

//获取url列表
export const getUrlList = (data) => {
  return postData("SyGet", data);
};
//开启或关闭url配置
export const openOrCloseTheUrl = (data) => {
  return getData("updateConfigStatus", data);
};
//修改配置url
export const setConfigUrl = (data) => {
  return postData("SyUpdate", data);
};
//新增配置url
export const addConfigUrl = (data) => {
  return postData("AddOuSy", data);
};
