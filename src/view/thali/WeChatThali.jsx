import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getThaliList } from "../../api/thali";
import useAppStore from "../../store";
import { Radio, Tabs, Empty, Input, Button, Spin } from "antd";
import { useLocation } from "react-router-dom";

import "./Thali.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});
const ThaliItem = React.lazy(async () => {
  const item = await import("./components/ThaliItem");
  return item;
});

// const items = [
//   {
//     key: "whole",
//     label: "全部项目",
//   },
//   {
//     key: "0",
//     label: "APP项目",
//   },
//   // {
//   //   key: "1",
//   //   label: "PC项目",
//   // },
//   {
//     key: "2",
//     label: "wegame项目",
//   },
// ];

export default function Thali() {
  const location = useLocation();
  const [list, setList] = useState([]);

  const [screenData, setScreenData] = useState([]);

  const [projectName, setProjectName] = useState("");

  const [radioValue, setRadioValue] = useState("whole");

  const [activeKey, setActiveKey] = useState("whole");

  const [thaliLoading, setThaliLoading] = useState(false);

  const setThaliInfo = useAppStore((state) => state.getThaliInfo);

  const navigate = useNavigate();
  const whetherAPP =
    location.pathname === "/layouts/wechat/thail"
      ? { Web: 1, App: 0 }
      : { Web: 0, App: 1 };
  useEffect(() => {
    getList(whetherAPP);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    screenList();
  }, [radioValue, activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getList = async (val) => {
    setThaliLoading(true);
    let result = await getThaliList({
      Pagenum: "1",
      Pagesize: "1000",
      Type: 2,
      ...val,
    });
    const { code, data } = result || {};
    if (code) {
      let subList =
        data &&
        data.map((item) => {
          return { ...item, status: false };
        });
      setList([...subList]);
      screenList(subList);
    }
    setThaliLoading(false);
  };

  const changeStatus = (index) => {
    const subList = screenData;
    if (true) {
      setThaliInfo(subList[index]);
      navigate(
        `/layouts/wechat/thail/config?data=${JSON.stringify(whetherAPP)}`
      );
    }
  };

  // const onChange = (e) => {
  //   setRadioValue(e.target.value);
  // };
  // const onChangeTabs = (key) => {
  //   setActiveKey(key);
  // };
  const screenList = (subList) => {
    let arr = [];
    if (radioValue === "whole" && activeKey === "whole") {
      arr = subList || list;
    }
    if (radioValue !== "whole" && activeKey === "whole") {
      list.forEach((item) => {
        if (item.pack_list && item.pack_list.includes(Number(radioValue))) {
          arr.push(item);
        }
      });
    }
    if (radioValue === "whole" && activeKey !== "whole") {
      list.forEach((item) => {
        if (item.appType === activeKey) {
          arr.push(item);
        }
      });
    }
    if (radioValue !== "whole" && activeKey !== "whole") {
      list.forEach((item) => {
        if (
          item.pack_list &&
          item.pack_list.includes(Number(radioValue)) &&
          item.appType === activeKey
        ) {
          arr.push(item);
        }
      });
    }
    setScreenData([...arr]);
  };

  const searchBtn = () => {
    let arr = [];
    list.forEach((elem) => {
      if (
        elem.Device_name &&
        (elem.Device_name.includes(projectName) ||
          elem.Device_name === projectName)
      ) {
        arr.push(elem);
      }
    });
    setScreenData([...arr]);
  };
  return (
    <ContentLayouts
      top={
        <div className="thali-top">
          {/* <div className="types-radio">
            <span className="types-text">类型：</span>
            <Radio.Group onChange={onChange} value={radioValue}>
              <Radio value={"whole"}>全部</Radio>
              <Radio value={11}>日卡老号</Radio>
              <Radio value={10000}>日卡新号</Radio>
              <Radio value={10001}>周卡</Radio>
              <Radio value={10002}>月卡</Radio>
              <Radio value={10006}>ck</Radio>
              <Radio value={10007}>open</Radio>
              <Radio value={10008}>15级号</Radio>
              <Radio value={10010}>21级号</Radio>
              <Radio value={10011}>15W豆</Radio>
            </Radio.Group>
          </div> */}
          <div style={{ height: "40px" }}></div>
          <div className="thali-tabs-input">
            {/* <Tabs activeKey={activeKey} items={items} onChange={onChangeTabs} /> */}
            <div className="thali-input">
              <Input
                value={projectName}
                onChange={(even) => setProjectName(even.target.value)}
                placeholder="输入项目名名称"
              />
              <Button
                type="primary"
                style={{ marginLeft: "10px" }}
                onClick={searchBtn}
              >
                查询
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  setProjectName("");
                  setScreenData([...list]);
                }}
              >
                重置
              </Button>
            </div>
          </div>
        </div>
      }
      content={
        <div className="thali-content">
          <Spin spinning={thaliLoading}>
            <div className="thali-item-content">
              {screenData &&
                screenData.map((item, index) => (
                  <ThaliItem
                    key={index}
                    changeStatus={() => changeStatus(index)}
                    data={item}
                  />
                ))}
              {screenData.length === 0 && (
                <div className="thali-empty">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              )}
            </div>
          </Spin>
        </div>
      }
    ></ContentLayouts>
  );
}
