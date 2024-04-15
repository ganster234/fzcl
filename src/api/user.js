import { getData,postData } from './index'

//获取用户列表page第几页,limit一页多少条
export const getUserList = (data) => { return getData('user/list', data) }

//获取用户列表，无分页 
export const getUserAll = (data) => { return getData('user/all', data) }

//禁用用户
export const setInterdict = (data) => { return postData('block/account', data) }

//修改余额
export const addBalance = (data) => { return postData('add/balance', data) }

// 获取用户价格管理列表
export const getUserPriceList = (data) => { return getData('user/price', data) }

//添加用户套餐价格 
export const getAddPrice = (data) => { return postData('add/price', data) }

//删除用户套餐价格  
export const getDelPrice = (data) => { return getData('del/price', data) }

//修改密码
//添加用户套餐价格 
export const postUpdatePwd = (data) => { return postData('update/password', data) }

//用户管理可用的项目
export const addUserProject = (data) => { return postData('add/user/project', data) }

//获取用户绑定的项目
export const getUserProject = (data) => { return getData('user/project', data) }

//设置代理 set/income
export const setIncome = (data) => { return postData('set/income', data) }

//用户价格管理修改价格
export const setUserPriceManage = (data) => { return getData('update/price', data) }

// 今日不显示
export const setUpdateTime = (data) => { return getData('update/time', data) }

//重置用户密码
export const setPasswod = (data) => { return postData('log/reset/password', data) }

//获取设备信息
export const facility = (data) => { return getData('get/user/list', data) }

// 获取联合项目列表
export const getjoint = (data) => { return getData('joint/list', data)}

//创建联合项目
export const addjoint = (data) => { return postData('joint/add', data)}
//删除联合项目
export const romvejoint = (data) => { return getData('joint/del', data)}

//查询账号状态时间数据
export const getaccounttable = (data) => { return getData('get/order/detail', data) }