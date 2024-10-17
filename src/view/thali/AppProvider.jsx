import React, { createContext, useState, lazy } from "react";
import lazyLoad from "../utils/lazyLoad";

export const context = createContext({});

// const Scan = React.lazy(async () => {
//   const item = await import("../view/scan/Scan");
//   return item;
// });

/**
 * 路由扁平化处理
 * @param {*} menus
 * @returns
 */
function flatRoutes(menus) {
  const arr = [];
  function findInfo(data) {
    data.forEach((item) => {
      const { children, ...info } = item;
      arr.push(info);
      if (children) {
        findInfo(children);
      }
    });
  }
  findInfo(menus);
  return arr;
}
/**
 * role过滤权限
 * @param {*} role
 * @returns
 */
function findRoles(menus, role) {
  const arr = [];

  function findInfo(data, parent) {
    data.forEach((item) => {
      const { children, ...info } = item;
      //   children存在查找子集
      if (children) {
        info.children = [];
        findInfo(children, info.children);
        // 没有子节点就删除子节点
        // eslint-disable-next-line no-unused-expressions
        info.children.length === "0" ? delete info.children : null;
      }
      //children不存在就判断有没有权限
      if (info.roles) {
        // 有权限的情况下就判断有没有父节点，有父节点就是有二级路由，没有父节点就是一级路由，没有嵌套
        if (info.roles?.includes(role)) {
          parent ? parent.push(info) : arr.push(info);
        }
      } else {
        parent ? parent.push(info) : arr.push(info);
      }
    });
  }

  findInfo(menus);
  return arr;
}

// 实现动态路由的hooks必须
export default function AppProvider({ children }) {
  // 本地menu菜单roles: ["role"],//存在就展示，不存在就会过滤权限，在数组中就代表有权限
  let menusList = [
    {
      key: "/layouts/home",
      icon: require("../assets/image/sidermenu/home.png"),
      iconActive: require("../assets/image/sidermenu/home-active.png"),
      element: lazyLoad(lazy(() => import("../view/home/Home.jsx"))),
      label: "首页",
    },
    // {
    //   key: "/layouts/deal",
    //   icon: require("../assets/image/sidermenu/deal.png"),
    //   iconActive: require("../assets/image/sidermenu/deal-active.png"),
    //   label: "公开交易站",
    //   roles: ["admin", "role","superAdmin"],
    //   children: [
    //     {
    //       key: "/layouts/deal/whole",
    //       element: lazyLoad(lazy(() => import("../view/deal/WholeDeal.jsx"))),
    //       roles: ["admin", "role","superAdmin"],
    //       label: "全部项目",
    //     },
    //     {
    //       key: "/layouts/deal/release",
    //       element: lazyLoad(lazy(() => import("../view/deal/MyRelease.jsx"))),
    //       roles: ["admin", "role","superAdmin"],
    //       label: "我的发布",
    //     },
    //     {
    //       key: "/layouts/deal/connect",
    //       element: lazyLoad(
    //         lazy(() => import("../view/deal/ConnectOrder.jsx"))
    //       ),
    //       roles: ["admin", "role","superAdmin"],
    //       label: "我的接单",
    //     },
    //   ],
    // },
    {
      key: "/layouts/count",
      icon: require("../assets/image/sidermenu/count.png"),
      iconActive: require("../assets/image/sidermenu/count-active.png"),
      element: lazyLoad(lazy(() => import("../view/count/Count.jsx"))),
      label: "统计",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/layouts/thali",
      icon: require("../assets/image/sidermenu/thali.png"),
      iconActive: require("../assets/image/sidermenu/thali-active.png"),
      element: lazyLoad(lazy(() => import("../view/thali/Thali.jsx"))),
      label: "套餐(QQ)",
      roles: ["admin", "role", "superAdmin"],
    },
    // {
    //   key: "/layouts/wechat",
    //   icon: require("../assets/image/sidermenu/thali-wx.png"),
    //   iconActive: require("../assets/image/sidermenu/thali-wx-active.png"),
    //   element: lazyLoad(lazy(() => import("../view/thali/WeChatThali.jsx"))),
    //   label: "套餐(微信)",
    //   roles: ["admin", "role", "superAdmin"],
    // },
    {
      key: "/layouts/wechat",
      icon: require("../assets/image/sidermenu/thali-wx.png"),
      iconActive: require("../assets/image/sidermenu/thali-wx-active.png"),
      label: "套餐(微信)",
      roles: ["admin", "role", "superAdmin"],
      children: [
        {
          key: "/layouts/wechat/thail",
          element: lazyLoad(
            lazy(() => import("../view/thali/WeChatThali.jsx"))
          ),
          roles: ["admin", "role", "superAdmin"],
          label: "套餐列表",
        },
        // {
        //   key: "/layouts/wechat/take/code",
        //   element: lazyLoad(lazy(() => import("../view/thali/WxTakeCode.jsx"))),
        //   roles: ["admin", "role", "superAdmin"],
        //   label: "导出code",
        // },
        {
          key: "/layouts/wechat/thail/config",
          element: lazyLoad(
            lazy(() => import("../view/thali/WeThaliConfig.jsx"))
          ),
          grade: "grade", //不需要显示在menu里面的页面
          label: "基础配置",
          roles: ["admin", "role", "superAdmin"],
        },
        {
          key: "/layouts/wechat/take/ck",
          element: lazyLoad(lazy(() => import("../view/thali/WxThaliCk.jsx"))),
          roles: ["admin", "role", "superAdmin"],
          label: "提取ck(微信)",
        },
      ],
    },
    {
      key: "/layouts/thali/config",
      element: lazyLoad(lazy(() => import("../view/thali/ThaliConfig.jsx"))),
      grade: "grade", //不需要显示在menu里面的页面
      label: "基础配置",
      roles: ["admin", "role", "superAdmin"],
    },
    // {
    //   key: "/layouts/wechat/config",
    //   element: lazyLoad(lazy(() => import("../view/thali/WeThaliConfig.jsx"))),
    //   grade: "grade", //不需要显示在menu里面的页面
    //   label: "基础配置",
    //   roles: ["admin", "role", "superAdmin"],
    // },
    {
      key: "/layouts/kami",
      icon: require("../assets/image/sidermenu/kami.png"),
      iconActive: require("../assets/image/sidermenu/kami-active.png"),
      element: lazyLoad(lazy(() => import("../view/kami/Kami.jsx"))),
      label: "卡密列表",
      roles: ["admin", "role", "superAdmin"],
    },
    {
      key: "/layouts/open",
      icon: require("../assets/image/sidermenu/open.png"),
      iconActive: require("../assets/image/sidermenu/open-active.png"),
      element: lazyLoad(lazy(() => import("../view/open/Open.jsx"))),
      label: "提取open",
      roles: ["admin", "role", "superAdmin"],
    },
    {
      key: "/layouts/ck",
      icon: require("../assets/image/sidermenu/ck.png"),
      iconActive: require("../assets/image/sidermenu/ck-active.png"),
      element: lazyLoad(lazy(() => import("../view/ck/Ck.jsx"))),
      label: "提取ck",
      roles: ["admin", "role", "superAdmin"],
    },
    {
      key: "/layouts/scan",
      icon: require("../assets/image/sidermenu/scan.png"),
      iconActive: require("../assets/image/sidermenu/scan-active.png"),
      element: lazyLoad(lazy(() => import("../view/scan/Scan.jsx"))),
      label: "扫码日志",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/layouts/payment",
      icon: require("../assets/image/sidermenu/payment.png"),
      iconActive: require("../assets/image/sidermenu/payment-active.png"),
      element: lazyLoad(lazy(() => import("../view/payment/Payment.jsx"))),
      label: "支付记录",
      roles: ["admin", "role", "superAdmin"],
    },
    {
      key: "/layouts/recharge",
      icon: require("../assets/image/sidermenu/recharge.png"),
      iconActive: require("../assets/image/sidermenu/recharge-active.png"),
      element: lazyLoad(lazy(() => import("../view/recharge/Recharge.jsx"))),
      label: "充值记录",
      roles: ["admin", "role", "superAdmin"],
    },
    // {
    //   key: "/layouts/process",
    //   icon: require("../assets/image/sidermenu/process.png"),
    //   iconActive: require("../assets/image/sidermenu/process-active.png"),
    //   element: lazyLoad(lazy(() => import("../view/process/Process.jsx"))),
    //   label: "USDT管理",
    //   // roles: ["admin", "superAdmin"],
    // },
    {
      key: "/layouts/cash",
      icon: require("../assets/image/sidermenu/cash.png"),
      iconActive: require("../assets/image/sidermenu/cash-active.png"),
      element: lazyLoad(lazy(() => import("../view/cash/Cash.jsx"))),
      label: "提现列表",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/layouts/order",
      icon: require("../assets/image/sidermenu/order.png"),
      iconActive: require("../assets/image/sidermenu/order-active.png"),
      element: lazyLoad(lazy(() => import("../view/order/Order.jsx"))),
      label: "订单列表",
      roles: ["admin", "role", "superAdmin"],
    },
    // {
    //   key: "/layouts/leave",
    //   icon: require("../assets/image/sidermenu/leave.png"),
    //   iconActive: require("../assets/image/sidermenu/leave-active.png"),
    //   element: lazyLoad(lazy(() => import("../view/leave/Leave.jsx"))),
    //   label: "留言列表",//没接口未对接
    //   roles: ["admin","role","superAdmin"],
    // },
    {
      key: "/layouts/platform",
      icon: require("../assets/image/sidermenu/platform.png"),
      iconActive: require("../assets/image/sidermenu/platform-active.png"),
      label: "平台管理",
      roles: ["admin", "role", "superAdmin"], //不存在就展示，存在就会过滤权限
      children: [
        {
          key: "/layouts/platform/project?type=q",
          element: lazyLoad(lazy(() => import("../project/Project.jsx"))),
          roles: ["superAdmin"],
          label: "项目管理(Q)",
        },
        {
          key: "/layouts/platform/wechat/project?type=w",
          element: lazyLoad(lazy(() => import("../project/ProjectWx.jsx"))),
          roles: ["superAdmin"],
          label: "项目管理(W)",
        },
        {
          key: "/layouts/platform/group",
          element: lazyLoad(lazy(() => import("../view/platform/Group.jsx"))),
          roles: ["admin", "role", "superAdmin"],
          label: "分组管理",
        },
        {
          key: "/layouts/platform/notice",
          element: lazyLoad(lazy(() => import("../view/platform/Notice.jsx"))),
          roles: ["admin", "superAdmin"],
          label: "公告管理",
        },
        {
          key: "/layouts/platform/setup",
          element: lazyLoad(
            lazy(() => import("../view/platform/SystemSetup.jsx"))
          ),
          roles: ["superAdmin"],
          label: "系统设置",
        },
      ],
    },
    {
      key: "/layouts/user",
      icon: require("../assets/image/sidermenu/user.png"),
      iconActive: require("../assets/image/sidermenu/user-active.png"),
      label: "用户管理",
      roles: ["admin", "role", "superAdmin"], //不存在就展示，存在就会过滤权限
      children: [
        {
          key: "/layouts/user/list",
          element: lazyLoad(lazy(() => import("../view/user/UserList.jsx"))),
          roles: ["admin", "superAdmin"],
          label: "用户列表",
        },
        // {
        //   key: "/layouts/user/trust",
        //   element: lazyLoad(lazy(() => import("../view/user/Trust.jsx"))),
        //   roles: ["admin", "role","superAdmin"],
        //   label: "托管列表",
        // },
        // {
        //   key: "/layouts/user/trust/detail",
        //   element: lazyLoad(lazy(() => import("../view/user/TrustDetail.jsx"))),
        //   roles: ["admin", "role","superAdmin"],
        //   grade: "grade",//有这个属性就不会显示在menus中
        //   label: "托管详情",
        // },
        {
          key: "/layouts/user/price",
          element: lazyLoad(lazy(() => import("../view/user/PriceManage.jsx"))),
          roles: ["superAdmin"],
          label: "用户价格管理(qq)",
        },
        {
          key: "/layouts/user/wechat/price",
          element: lazyLoad(
            lazy(() => import("../view/user/WeChatPriceManage.jsx"))
          ),
          roles: ["superAdmin"],
          label: "用户价格管理(微信)",
        },
        {
          key: "/layouts/user/modify",
          element: lazyLoad(lazy(() => import("../view/user/ModifyPwd.jsx"))),
          roles: ["admin", "role", "superAdmin"],
          label: "修改密码",
        },
      ],
    },
    {
      key: "/layouts/rebate",
      icon: require("../assets/image/sidermenu/rebate.png"),
      iconActive: require("../assets/image/sidermenu/rebate-active.png"),
      element: lazyLoad(lazy(() => import("../view/rebate/Rebate.jsx"))),
      label: "邀请返利",
      roles: ["admin", "role", "superAdmin"],
    },
    {
      key: "/layouts/project/list",
      icon: require("../assets/image/sidermenu/add-project.png"),
      iconActive: require("../assets/image/sidermenu/add-project-active.png"),
      element: lazyLoad(lazy(() => import("../view/project/ProjectList.jsx"))),
      label: "项目申请列表",
      roles: ["admin", "superAdmin"],
    },
    {
      key: "/layouts/mail",
      icon: require("../assets/image/sidermenu/mail.png"),
      iconActive: require("../assets/image/sidermenu/mail-active.png"),
      element: lazyLoad(lazy(() => import("../view/mail/Mail.jsx"))),
      label: "站内信",
      roles: ["admin", "role", "superAdmin"],
    },
    {
      key: "/layouts/mail/config",
      element: lazyLoad(lazy(() => import("../view/mail/MailConfig.jsx"))),
      grade: "grade", //不需要显示在menu里面的页面
      label: "站内详情",
      roles: ["admin", "superAdmin"],
    },
  ];
  let defaultMenus = [];
  let defaultRoutes = [];
  let roles = sessionStorage.getItem("role");
  if (roles) {
    defaultMenus = findRoles(menusList, roles);
    if (defaultMenus && defaultMenus.length > 0) {
      defaultRoutes = flatRoutes(defaultMenus);
    }
  }
  // 侧边栏
  const [menus, setMenus] = useState(defaultMenus);
  // 路由
  const [routes, setRoutes] = useState(defaultRoutes);

  //根据当前角色生成路由信息和侧边栏信息
  const resetMenus = (role) => {
    // 此处重置菜单数据和路由数据
    const temMenu = findRoles(menusList, role);
    setMenus(temMenu);
    setRoutes(flatRoutes(temMenu));
  };

  return (
    <context.Provider value={{ menus, routes, resetMenus }}>
      {children}
    </context.Provider>
  );
}
