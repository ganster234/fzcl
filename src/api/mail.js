import { getData, postData } from "./index";

// 获取站内信的数组
export const getMailList = (data) => {
  return getData("mail/list", data);
};

//发布站内信
export const getMailAdd = (data) => {
  return postData("mail/add", data);
};

// 回复
export const setMailMsg = (data) => {
  return getData("mail/get", data);
};

//回复
export const setAddContent = (data) => {
  return postData("mail/addContent", data);
};

//查看回复未读
export const setAddMail = (data) => {
  return getData("mail/getUser", data);
};
