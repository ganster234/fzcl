import { getData } from './index'

//登录器下载 
export const getDownload = (data) => { return getData('download/url', data) }

//首页柱装图
export const getDayCount = (data) => { return getData('index/day', data) }

//销售渠道数据统计
export const getDayStati = (data) => { return getData('index/statis', data) }

//清理缓存
export const cleanhuanc = () => {
  return getData("update/redis");
};



