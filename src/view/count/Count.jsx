import React, { useState, useEffect } from "react";
import { message } from "antd";
import {
  getCount,
  getOutjsm,
  getOutjpay,
  getOutjpropay,
} from "../../api/count";
import dayjs from "dayjs";

import CountTop from "./components/CountTop";
import ScanCode from "./components/ScanCode";
import AllChannel from "./components/AllChannel";
import CountFrons from "./components/CountFrons";
import CountSales from "./components/CountSales";
import OpenSales from "./components/OpenSales";
import WeekSales from "./components/WeekSales";
import CountFronsWx from "./components/CountFronsWx";
import "./Count.less";

const ContentLayouts = React.lazy(async () => {
  const item = await import("../../components/contentLayouts/ContentLayouts");
  return item;
});

//统计
export default function Count() {
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [state, setState] = useState({
    active: 0,
    start_time: new Date(),
    end_time: new Date(),
    app_id: null,
  });

  useEffect(() => {
    (() => {
      getCountList();
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCountList = async (str) => {
    setLoading(true);
    const commonParams = {
      Stime: str
        ? ""
        : state.start_time && dayjs(state.start_time).format("YYYY-MM-DD"),
      Etime: str
        ? ""
        : state.end_time && dayjs(state.end_time).format("YYYY-MM-DD"),
    };

    try {
      let response;
      if (state.active === 0) {
        response = await getOutjsm(commonParams);
        console.log("getOutjsm Response:", response);
      } else if (state.active === 1) {
        response = await getOutjpay(commonParams);
        console.log("getOutjpay Response:", response);
      } else if (state.active === 2) {
        response = await getOutjpropay({ ...commonParams, Type: "1" });
        console.log("getOutjpropay Type 1 Response:", response);
      } else if (state.active === 6) {
        response = await getOutjpropay({ ...commonParams, Type: "2" });
        console.log("getOutjpropay Type 2 Response:", response);
      } else {
        console.warn("无效的 state.active 值:", state.active);
      }
      const { code, data, msg } = response || {};
      console.log(response, state.active, "state.active");
      message.destroy();
      if (code) {
        setDataList([...data]);
      } else {
        message.error(msg);
      }
    } catch (error) {
      console.error("接口调用出错:", error);
    }

    // let result = await getCount({
    //   start_time: str
    //     ? ""
    //     : state.start_time && dayjs(state.start_time).format("YYYY-MM-DD"),
    //   end_time: str
    //     ? ""
    //     : state.end_time && dayjs(state.end_time).format("YYYY-MM-DD"),
    //   app_id: str ? "" : state.app_id,
    //   type: state.active,
    // });
    // const { code, data, msg } = result || {};
    // message.destroy();
    // if (code === 200) {
    //   if (state.active === 2) {
    //     setDataList([...data?.list]);
    //   } else {
    //     setDataList([...data]);
    //   }
    // } else {
    //   message.error(msg);
    // }
    setLoading(false);
  };

  const queryCountList = () => {
    getCountList();
  };
  const resettingList = () => {
    setState({
      ...state,
      start_time: new Date(),
      end_time: new Date(),
      app_id: null,
    });
    setDataList([]);
    getCountList("str");
  };

  const getState = (item, srt) => {
    if (srt === "active") {
      // 清空数据
      setDataList([]);
      setState({
        ...state,
        start_time: new Date(),
        end_time: new Date(),
        [srt]: item,
      });
    } else {
      setState({
        ...state,
        [srt]: item,
      });
    }
  };
  return (
    <ContentLayouts
      top={
        <CountTop
          stateData={state}
          getState={getState}
          queryCountList={queryCountList}
          resettingList={resettingList}
        />
      }
      content={
        <div className="count-content">
          {state.active === 0 && (
            <ScanCode loading={loading} dataList={dataList} />
          )}
          {state.active === 1 && (
            <AllChannel loading={loading} dataList={dataList} />
          )}
          {state.active === 2 && (
            <CountFrons loading={loading} dataList={dataList} />
          )}
          {state.active === 3 && (
            <CountSales loading={loading} dataList={dataList} />
          )}
          {state.active === 4 && (
            <OpenSales loading={loading} dataList={dataList} />
          )}
          {state.active === 5 && (
            <WeekSales loading={loading} dataList={dataList} />
          )}
          {state.active === 6 && (
            <CountFronsWx loading={loading} dataList={dataList} />
          )}
        </div>
      }
    />
  );
}
