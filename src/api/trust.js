import { getData,postData } from './index'

// 
// 获取托管列表
export const getTrustList = (data) => { return getData('trusteeshi/list', data) }

//新增托管 
export const setAddTrust = (data) => { return postData('trusteeshi/add', data) }

//取消托管
export const setStatus = (data) => { return postData('trusteeshi/status', data) }

// 托管详情
export const getTrustDetail = (data) => { return getData('trusteeshi/detail', data) }