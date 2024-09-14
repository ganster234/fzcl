import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import zhCN from "antd/es/locale/zh_CN";
import "./assets/css/main.css";
import "dayjs/locale/zh-cn";

import AppProvider from "./components/AppProvider";

import App from "./App";
import Login from "./view/login/Login.jsx";
import Register from "./view/login/Register.jsx";
import { isMobile } from "./utils/utils";
const NotFound = lazy(() => import("./view/notFound/NotFound.jsx"));
dayjs.locale("zh-cn");

if (process.env.NODE_ENV !== "development") {
  console.log = () => {}; // 清除所有控制台
}

// 调用isMobile函数，根据返回值执行不同的操作
if (isMobile()) {
  console.log("手机访问");
  window.location.href = "https://ph.seolkf830.com/";
} else {
  console.log("屏幕访问");
}
// setInterval(() => {
//   alert("当前站已废弃，请访主站点：https://www.ph0629.com/")
// }, 4000);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AppProvider>
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/layouts/*" element={<App />} />
          {/* 或者跳转到 NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  </AppProvider>
);
