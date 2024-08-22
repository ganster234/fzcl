import React, { useEffect, useState } from "react";
import { Button, Input,  message, Spin } from "antd";
import useAppStore from "../../store";
import { getRate, getRateUpdate } from "../../api/setup";
import { getUser } from "../../api/login";
import { Tabs } from "antd";
import "./SystemSetup.less";

export default function SystemSetup() {
  const setUserInfo = useAppStore((state) => state.getUserInfo);
  const [state, setState] = useState({});
  const [fields, setFields] = useState([]);
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => {
    getRateList();
  }, []);
  const onChange = (key) => {
    getRateList(key);
  };
  const getRateList = async (val) => {
    setSetupLoading(true);
    try {
      const result = await getRate({
        group: val,
      });
      if (result?.code === 200) {
        const fieldsData = result.data.map((item, index) => ({
          label: item.remark,
          key: item.notice, // Assuming the key should be unique, possibly `config_id`
          config_id: item.config_id,
          value: item.notice,
          type: item.remark.includes("地址") ? "input" : "inputNumber",
        }));
        const newState = {};
        fieldsData.forEach((field) => {
          newState[`${field.key}Id`] = field.config_id;
          newState[field.key] = field.value;
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
    const param = fields.map(({ key }) => ({
      config_id: state[`${key}Id`],
      notice: state[key],
    }));

    setSetupLoading(true);
    try {
      const result = await getRateUpdate({ noticeList: param });
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
      const result = await getUser();
      if (result?.code === 200) {
        setUserInfo(result.data);
      } else {
        message.error(result?.msg);
      }
    } catch (error) {
      message.error("Failed to fetch user info.");
    }
  };

  const renderFields = () =>
    fields.map(({ label, key, type }) => (
      <div className="systems-setup-item" key={label}>
        <span className="systems-setup-item-title">{label}：</span>
        {type === "input" ? (
          <Input
            value={state[key]}
            style={{ width: "460px" }}
            onChange={(even) =>
              setState((data) => ({ ...data, [key]: even.target.value }))
            }
          />
        ) : (
          <Input
            value={state[key]}
            style={{ width: "460px" }}
            onChange={(even) => setState((data) => ({ ...data, [key]: even.target.value }))}
          />
        )}
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
                key: "1",
                label: "系统配置",
              },
              {
                key: "2",
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
