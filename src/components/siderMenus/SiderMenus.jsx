import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, message } from "antd";
import useAppStore from "../../store";
import { usebegin } from "../../store/mystore";
import { context } from "../AppProvider";
import "./SiderMenus.less";

const { SubMenu } = Menu;

const findOpenKeys = (routes, key) => {
  let result = [];
  const findInfo = (arr) => {
    arr.forEach((item) => {
      if (key.includes(item.key)) {
        result.push(item.key);
        if (item.children) {
          findInfo(item.children);
        }
      }
    });
  };
  findInfo(routes);
  return result;
};

//筛选路由判断路由，存在就放行，不存在就去404页面
const menuPath = (routes) => {
  let pathList = [];
  const findInfo = (arrData) => {
    arrData.forEach((item) => {
      const { children, key } = item;
      pathList.push(key);
      if (children) {
        findInfo(children);
      }
    });
  };
  findInfo(routes);
  return pathList;
};

export default function SiderMenus() {
  const takestore = usebegin();
  const { menus, routes } = useContext(context);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const platformSrc = useAppStore((state) => state.platformSrc); //设置用户信息
  // 获取持久化的menu激活
  const [openKeys, setOpenKeys] = useState(findOpenKeys(routes, pathname));
  // 渲染不含children的目录
  const renderNoChildMenu = (item) => {
    if (item.grade) {
      return;
    }
    return (
      <Menu.Item key={item.key}>
        {item.icon && (
          <img
            src={pathname.includes(item.key) ? item.iconActive : item.icon}
            alt=""
            className="menu-icon"
          />
        )}
        {item.label}
      </Menu.Item>
    );
  };
  // 渲染含有children的目录
  const renderChildMenu = (item) => {
    return (
      <SubMenu
        key={item.key}
        title={
          <>
            {item.icon && (
              <img
                src={pathname.includes(item.key) ? item.iconActive : item.icon}
                alt=""
                className="menu-icon"
              />
            )}
            {item.label}
          </>
        }
      >
        {item.children.map((child) => {
          return renderMenu(child);
        })}
      </SubMenu>
    );
  };
  // 渲染菜单
  const renderMenu = (item) => {
    return item.children && item.children.length
      ? renderChildMenu(item)
      : renderNoChildMenu(item);
  };
  const handleClick = (even) => {
    //跳转菜单
    if (takestore.disclosedBallot) {
      //不能跳转
      message.open({
        type: "warning",
        content: "请完成密码修改",
      });
    } else {
      if (even?.key) {
        navigate(even?.key);
      }
    }
  };

  useEffect(() => {
    //menuPath() menuPath().length > 0 判断是不是刷新页面，如果是刷新页面直接放行
    if (takestore.disclosedBallot) {
      //不能跳转
      if (window.location.hash !== "/#/layouts/user/modify") {
        navigate("/layouts/user/modify");
        message.open({
          type: "warning",
          content: "请完成密码修改",
        });
      }
    }
    if (
      menuPath(routes) &&
      menuPath(routes).length > 0 &&
      menuPath(routes).indexOf(pathname) === -1
    ) {
      //路由不存在，去404
      navigate("/404");
    }
    //有路由，实时更新激活的menu
    setOpenKeys(findOpenKeys(routes, pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <div className="sider-box">
      <img
        src={require(`../../assets/image/sidermenu/cili.png`)}
        alt=""
        className="logobox"
      />
      <div style={{ backgroundColor: "#2662DA" }} className="sider-menus">
        <Menu
          onClick={handleClick}
          style={{ width: "100%", background: "#2662DA" }}
          defaultOpenKeys={[...openKeys]}
          selectedKeys={[...openKeys]}
          defaultSelectedKeys={[...openKeys]}
          mode="inline"
        >
          {menus.map((item) => renderMenu(item))}
        </Menu>
      </div>
    </div>
  );
}
