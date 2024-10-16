import React, { useState, useEffect } from "react";
import * as echarts from "echarts"; // 引入 echarts 核心模块
import { Divider } from "antd";

import { getDayCount, getDayStati } from "../../../api/home";
import "./DataCount.less";

export default function DataCount() {
  const [saleActive, setSaleActive] = useState(true);
  const [channelActive, setChannel] = useState(true);
  const [channelDetail, setChannelDetail] = useState({});
  var chartDom = null;
  var myChart = null;
  const initChart = async () => {
    chartDom = document.getElementById("chart");
    myChart = echarts.init(chartDom);
    var option;
    let xAxisData = [];
    let seriesData = [];
    let result = await getDayCount({ type: saleActive ? "day" : "mo " });
    const { code, data } = result || {};
    if (code) {
      data.forEach((item) => {
        xAxisData.push(item.Device_time);
        seriesData.push(item.Device_money);
      });
    }

    option = {
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: seriesData,
          type: "bar",
          showBackground: true,
          barWidth: 20, //柱子宽度
          barGap: 1, //柱子间距
          itemStyle: {
            color: "#327DFC", // 设置柱子的颜色为红色
          },
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
      tooltip: {
        trigger: "axis", //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
        backgroundColor: "transparent", //可以背景设置为透明，然后在下面formatter自定义html的背景色 比如;background:rgba(000,000,000,0.5)
        formatter: function (params) {
          let str = " ";
          if (params[0] && params[0].value) {
            str = params[0].value;
          }
          return str;
        },
      },
    };

    xAxisData && seriesData && option && myChart.setOption(option);
  };
  useEffect(() => {
    initChart();
  }, [saleActive]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const getChannel = async () => {
      //日：day  月：mo
      let result = await getDayStati({
        type: channelActive ? "day" : "mo",
      });
      if (result?.code) {
        setChannelDetail({ ...result?.data[0] });
      }
    };
    getChannel();
  }, [channelActive]);
  return (
    <div className="data-count">
      <div className="data-count-channel">
        <div className="data-count-channel-title">
          <span>数据统计</span>
          <span className="count-channel-btn">
            <span
              className={
                channelActive
                  ? "count-channel-btn-item count-channel-btn-item-active"
                  : "count-channel-btn-item"
              }
              onClick={() => setChannel(true)}
            >
              较昨日
            </span>
            <Divider type="vertical" />
            <span
              className={
                channelActive
                  ? "count-channel-btn-item "
                  : "count-channel-btn-item count-channel-btn-item-active"
              }
              onClick={() => setChannel(false)}
            >
              较上月
            </span>
          </span>
        </div>
        <div className="count-channel-detail">
          <div className="count-channel-detail-item">
            <div
              className="channel-detail-item-title"
              style={{ fontSize: "12px" }}
            >
              所有销售渠道总额
            </div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_moneyall || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_moneyallold || "0.00"}
            </div>
          </div>
          <Divider type="vertical" className="channel-detail-item-vertical" />
          <div className="count-channel-detail-item">
            <div className="channel-detail-item-title">open销售总额</div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_open || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_openold || "0.00"}
            </div>
          </div>
          <Divider type="vertical" className="channel-detail-item-vertical" />
          <div className="count-channel-detail-item">
            <div className="channel-detail-item-title">项目扫码总次数</div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_sm || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_smold || "0.00"}
            </div>
          </div>

          <Divider type="vertical" className="channel-detail-item-vertical" />
          <div className="count-channel-detail-item">
            <div className="channel-detail-item-title">
              {channelActive ? "今日" : "本月"}扫码成功数
            </div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_smok || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_smokold || "0.00"}
            </div>
          </div>
          <Divider type="vertical" className="channel-detail-item-vertical" />
          <div className="count-channel-detail-item">
            <div className="channel-detail-item-title">
              {channelActive ? "今日" : "本月"}扫码失败数
            </div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_smno || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_smnoold || "0.00"}
            </div>
          </div>

          <Divider type="vertical" className="channel-detail-item-vertical" />
          <div className="count-channel-detail-item">
            <div className="channel-detail-item-title">项目售后总额</div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_sh || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_shold || "0.00"}
            </div>
          </div>
          <Divider type="vertical" className="channel-detail-item-vertical" />
          <div className="count-channel-detail-item">
            <div className="channel-detail-item-title">用户充值总额</div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_pay || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_payold || "0.00"}
            </div>
          </div>
          <Divider type="vertical" className="channel-detail-item-vertical" />
          <div className="count-channel-detail-item">
            <div className="channel-detail-item-title">ck销售总额</div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_ck || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_ckold || "0.00"}
            </div>
          </div>
          <Divider type="vertical" className="channel-detail-item-vertical" />
          <div className="count-channel-detail-item">
            <div className="channel-detail-item-title">周卡售后</div>
            <div className="channel-detail-item-content">
              {channelDetail?.Device_shweek || "0.00"}
            </div>
            <div className="channel-detail-item-footer">
              {channelActive ? "较昨日" : "较上月"}
              {channelDetail?.Device_shweekold || "0.00"}
            </div>
          </div>
        </div>
      </div>
      <div className="data-count-e-charts">
        <div className="data-count-e-charts-title">
          <span>销售数据走势</span>
          <span className="count-btn-box">
            <span
              className={
                saleActive
                  ? "count-btn-box-item count-btn-box-item-active"
                  : "count-btn-box-item"
              }
              onClick={() => setSaleActive(true)}
            >
              日统计
            </span>
            <Divider type="vertical" />
            <span
              className={
                saleActive
                  ? "count-btn-box-item "
                  : "count-btn-box-item count-btn-box-item-active"
              }
              onClick={() => setSaleActive(false)}
            >
              月统计
            </span>
          </span>
        </div>
        <div id="chart" className="charts-box"></div>
      </div>
    </div>
  );
}
