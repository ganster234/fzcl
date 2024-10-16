import { getData, postData } from "./index";

//登录器下载
export const getDownload = (data) => {
  return postData("url", data);
};

//首页柱装图
export const getDayCount = (data) => {
  return postData("OussListGet", data);
};

//销售渠道数据统计
export const getDayStati = (data) => {
  return postData("OussdataGet", data);
};

//清理缓存
export const cleanhuanc = () => {
  return getData("update/redis");
};
