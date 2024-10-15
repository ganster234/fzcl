import { getData, postData } from "./index";

//获取系统设置
export const getRate = (data) => {
  return postData("SyApiGet", data);
};

//修改系统配置项/
export const getRateUpdate = (data) => {
  return postData("SyApiUp", data);
};
