import { getData,postData } from './index'

//获取系统设置
export const getRate = (data) => { return getData('rate/list', data) }

//修改系统配置项/
export const getRateUpdate = (data) => { return postData('rate/update', data) }