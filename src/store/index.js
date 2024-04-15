import { create } from "zustand";
// 数据持久化
import { createJSONStorage, persist } from "zustand/middleware";

//useAppStore==vue中的state
const useAppStore = create(
  //持久化储存
  persist(
    (set, get) => ({
      userInfo: {}, //用户信息
      thaliInfo: {}, //套餐的信息，用于获取套餐的详情
      service: {}, //客服信息c
      account: "", //
      serviceShow: false, //显示隐藏客服弹窗
      rechargeShow: false, //充值弹窗
      platformSrc: "shark", //rosefinch：喜猫，whale：蓝鲸，shark：大白鲨
      // 异步操作获取数据
      getUserInfo: (data) => {
        set({ userInfo: data });
      },
      getThaliInfo: (data) => {
        set({ thaliInfo: data });
      },
      getService: (data) => {
        set({ service: data });
      },
      setServiceShow: (data) => {
        set({ serviceShow: data });
      },
      setRechargeShow: (data) => {
        set({ rechargeShow: data });
      },
      getAccount: (data) => {
        set({ account: data });
      },
    }),
    // 关键点在这里初始化就会将state储存进storage
    {
      //存进storage的名字
      name: "globalState",
      //值可选sessionStorage，localStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAppStore;
