import { getData, postData } from './index'

//获取分组列表 
export const getGroupList = (data) => { return getData('list', data) }

// 添加分组
export const postAddGroup = (data) => { return postData('add/group', data) }

//删除分组分页
export const getDelGroup = (data) => { return getData('del/group', data) }

//获取分组列表不分页
export const getGroupListNoPage = (data) => { return getData('group/list', data) }