import { getData } from './index'


//获取销售列表
export const salesStatistics = (data) => { return getData('/get/user/detail', data) }
