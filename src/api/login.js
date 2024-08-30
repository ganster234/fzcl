import { getData,postData } from './index'

// 登录的验证码
export const getCode = (data) => { return getData('verifyCode', data) }

//登录 
export const login = (data) => { return postData('login', data) }

//注册
export const register = (data) => { return postData('register', data) }

//获取用户信息 
export const getUser = (data) => { return getData('userInfo', data) }

//发送用户设备
export const transmitting = (data) => { return postData('add/user/ip', data) }