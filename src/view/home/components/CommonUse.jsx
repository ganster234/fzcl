import React from "react";
import { useState, useEffect } from "react";
import { Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getThaliList } from "../../../api/thali";
import useAppStore from "../../../store";
import "./CommonUse.less";
import "../../thali/Thali.less";
// const ThaliItem = React.lazy(async () => {
//   const item = await import("../../thali/components/ThaliItem");
//   return item;
// });
const Videos = React.lazy(async () => {
  const item = await import("../../videos");
  return item;
});
export default function CommonUse() {
  const navigate = useNavigate();
  useEffect(() => {
    getList();
  }, []);
  const setThaliInfo = useAppStore((state) => state.getThaliInfo);
  const [thaliLoading, setThaliLoading] = useState(false);
  const [screenData, setScreenData] = useState([]);
  const getList = async () => {
    setThaliLoading(true);
    let result = await getThaliList({ is_qq: 1 });
    const { code, data } = result || {};
    if (code === 200) {
      const { appPriceList } = data || {};
      let subList =
        appPriceList &&
        appPriceList.map((item) => {
          return { ...item, status: false };
        });
      setScreenData([...subList]);
    }
    setThaliLoading(false);
  };
  const changeStatus = (index) => {
    // let subList = screenData.map((item) => {
    //   return { ...item, status: false };
    // });
    let subList = screenData;
    if (true) {
      setThaliInfo(subList[index]);
      navigate("/layouts/thali/config");
    }
  };
  return (
    <div
      className="case"
      style={{ backgroundColor: "white", borderRadius: "10px" }}
    >
      <div
        style={{ maxHeight: "55vh", marginTop: "15px" }}
        className="thali-content "
      >
        <Spin spinning={thaliLoading}>
          {/* <p className="huobao">火热套餐</p> */}
          <div className="">
            
            {/* {screenData &&
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
            )} */}
            <Videos></Videos>
          </div>
        </Spin>
      </div>
    </div>
  );
}
