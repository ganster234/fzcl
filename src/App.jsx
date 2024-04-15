import React, { useContext, useEffect } from "react";

import { context } from "./components/AppProvider";
import { Routes, Route } from "react-router";
import Layouts from "./view/Layouts.jsx";

// import Loadable from 'react-loadable';

// import Home from "./view/home/Home";
//懒加载组件，react自带的，两者性能几乎相差无几就是写法差距
// const Button = React.lazy(async () => {
//   const antd = await import/* webpackChunkName: "antd" */('antd/lib/button');
//   return antd;
// });
//懒加载组件，这是react社区插件，两者性能几乎相差无几就是写法差距
// const Input = Loadable({
//   loader: async () => {
//     const antd = await import(/* webpackChunkName: "antd" */ 'antd/lib/input');
//     return antd;
//   },
//   loading: () => <div>Loading...</div>,
// });

export default function App() {
  const { routes } = useContext(context);
  // 退出页面去除本地的登录信息
  useEffect(() => {
    return () => {
      localStorage.removeItem("globalState");
      sessionStorage.removeItem("globalState");
    };
  }, []);
  return (
    <Layouts>
      <Routes>
        {routes &&
          routes.map(
            (item) =>
              item.element && (
                <Route
                  key={item.key}
                  path={item.key.replace("/layouts", "")}
                  element={item.element}
                />
              )
          )}
      </Routes>
    </Layouts>
  );
}
