import React, { useEffect, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import useAppStore from "../../store";
import { getRate, getRateUpdate } from "../../api/setup";
import { getUser } from "../../api/login";
import { Tabs } from "antd";
import "./SystemSetup.less";

export default function SystemSetup() {
  const setUserInfo = useAppStore((state) => state.getUserInfo);
  const userInfo = useAppStore((state) => state.userInfo);

  const [state, setState] = useState({});
  const [fields, setFields] = useState([]);
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => {
    getRateList();
  }, []);
  const onChange = (key) => {
    console.log(key, "key");
    getRateList(key);
  };
  const getRateList = async (val = "0") => {
    setSetupLoading(true);
    try {
      const result = await getRate({
        Type: val,
      });
      // eslint-disable-next-line eqeqeq
      if (result?.code == 200) {
        console.log(result.data, "result");
        const fieldsData = result.data.map((item, index) => ({
          // id: item.id,
          // label: item.remark,
          // key: item.notice,
          // config_id: item.config_id,
          // value: item.notice,
          // type: item.remark.includes("地址") ? "input" : "inputNumber",
          id: item.Device_Sid,
          label: item.Device_Name,
          key: item.Device_Sid,
          value: item.Device_Value,
          type: item.Device_Name.includes("地址") ? "input" : "inputNumber",
        }));
        const newState = {};
        fieldsData.forEach((field) => {
          // newState[`${field.id}Id`] = field.config_id;
          newState[field.id] = field.value;
        });
        setFields(fieldsData);
        setState(newState);
      } else {
        message.error(result?.msg);
      }
    } catch (error) {
      message.error("Failed to fetch rate data.");
    } finally {
      setSetupLoading(false);
    }
  };

  const setSetup = async () => {
    const param = fields.map(({ id }) => ({
      // config_id: state[`${id}Id`],
      // notice: state[id],
      Sid: id,
      Name: userInfo.Device_name,
      Key: state[id],
    }));
    // return console.log(param, "param", fields);

    setSetupLoading(true);
    try {
      const result = await getRateUpdate({ list: param });
      if (result?.code === 200) {
        message.success("修改成功");
        getUserInfo();
      } else {
        message.error(result?.msg);
      }
    } catch (error) {
      message.error("Failed to update system setup.");
    } finally {
      setSetupLoading(false);
    }
  };

  const getUserInfo = async () => {
    try {
      const result = await getUser({
        Sid: userInfo.Device_Sid, //用户sid
      });
      // eslint-disable-next-line eqeqeq
      if (result?.code == 200) {
        setUserInfo(result.data[0]);
      } else {
        message.error(result?.msg);
      }
    } catch (error) {
      message.error("Failed to fetch user info.");
    }
  };

  const renderFields = () =>
    fields.map(({ label, key, type, id }) => (
      <div className="systems-setup-item" key={label}>
        <span className="systems-setup-item-title">{label}：</span>
        <Input
          value={state[id]}
          style={{ width: "460px" }}
          onChange={(even) => {
            setState((data) => ({ ...data, [id]: even.target.value }));
          }}
        />
      </div>
    ));

  return (
    <div className="systems-setup">
      <Spin spinning={setupLoading}>
        <div>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "0",
                label: "系统配置",
              },
              {
                key: "1",
                label: "接口配置",
              },
            ]}
            onChange={onChange}
          />
          {renderFields()}
          <div className="systems-setup-btn">
            <Button type="primary" onClick={() => setSetup()}>
              修改系统配置
            </Button>
          </div>
        </div>
      </Spin>
    </div>
  );
}
