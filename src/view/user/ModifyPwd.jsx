import React, { useState } from "react";

import "./ModifyPwd.less";

import SecureFrom from "./components/SecureFrom.jsx";

export default function ModifyPwd() {
  const [tabsList] = useState([
    {
      title: "安全设置",
      text: "修改密码/手机号",
    },
  ]);
  const [active, setActive] = useState(0);

  const changeActive = (index) => {
    setActive(index);
  };
  return (
    <div className="modify-pwd">
      <div className="personal-settings">
        <div className="personal-settings-title">个人设置</div>
        <div className="personal-settings-tabs">
          {tabsList &&
            tabsList.map((item, index) => {
              return (
                <div
                  key={item.text}
                  className={
                    active === index
                      ? "personal-tabs-item personal-tabs-item-active"
                      : "personal-tabs-item"
                  }
                  onClick={() => changeActive(index)}
                >
                  <div className="personal-tabs-item-title">{item.title}</div>
                  <div className="personal-tabs-item-text">{item.text}</div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="basic-settings">
        <div className="basic-title">基本设置</div>
        {active === 0 && <SecureFrom></SecureFrom>}
      </div>
    </div>
  );
}
