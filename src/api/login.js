import { getData, postData } from "./index";

// 登录的验证码
export const getCode = (data) => {
  return postData("AppVerifyCode", data);
};

//登录
export const login = (data) => {
  return postData("UserLogin", data);
};

//注册
export const register = (data) => {
  return postData("Ouregister", data);
};

//获取用户信息
export const getUser = (data) => {
  return postData("Userinfo", data);
};

//发送用户设备信息
// export const transmitting = (data) => { return postData('add/user/ip', data) }
