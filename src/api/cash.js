import { getData,postData } from './index'

// 获取提现列表
export const getWithdrawal = (data) => { return getData('withdrawal/list', data) }

// 提交提现
export const getAddWithdrawal = (data) => { return postData('add/withdrawal', data) }

// 同意提现或者是拒绝
export const getWithdrawalStatus = (data) => { return getData('withdrawal/status', data) }