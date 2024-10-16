import { getData, postData } from "./index";

//获取项目列表page第几页,limit一页多少条
export const getProjectList = (data) => {
  return postData("OuproMainGet", data);
};

// 开启关闭套餐?id=1&is_share=0
export const getChangeShare = (data) => {
  return getData("project/update/share", data);
};

// 修改套餐价格
export const getChangePrice = (data) => {
  return postData("OuproMainBaUp", data);
};

// 新增项目
export const getAddProject = (data) => {
  return postData("OuproAdd", data);
};
//修改项目  修改查询
export const modifyTheQuery = (data) => {
  return postData("OuproMainUpGet", data);
};

//修改项目
export const setProject = (data) => {
  return postData("OuproMainUpUp", data);
};
//修改金额查询
export const modifyTheAmountQuery = (data) => {
  return postData("OuproMainBaGet", data);
};

// 获取项目和套餐
export const getProjectPackList = (data) => {
  return postData("OuproByTypeGet", data);
};

//添加项目页面的接口
export const setAddApplication = (data) => {
  return postData("OuprowebAdd", data);
};
//添加项目  修改状态
export const addApplicationModify = (data) => {
  return postData("OuprowebUp", data);
};
// 查询
export const getAddApplication = (data) => {
  return postData("OuprowebGet", data);
};

//新增项目别名
export const addProjectAlias = (data) => {
  return postData("OuproMainNaAdd", data);
};
//修改项目别名
export const updateProjectAlias = (data) => {
  return postData("OuproMainNaUp", data);
};
//获取项目别名
export const getProjectAlias = (data) => {
  return postData("OuproMainNaGet", data);
};

//上报长沙
export const reporteddata = (data) => {
  return postData("OuproMainUpUpLoad", data);
};
