import React, { useEffect, useState, useMemo } from "react";
import { Input, Select, message, Button, Spin } from "antd";
import useAppStore from "../../../store";
import { useLocation } from "react-router";

import { getProjectPackList } from "../../../api/project";
import { getPackDetail } from "../../../api/thali";
import { setAddOpen } from "../../../api/open";
import { areaList } from "../../../utils/area";

const { Option } = Select;

export default function CreateOpenModal({ cancelModal, comModal }) {
  const location = useLocation();
  const userInfo = useAppStore((state) => state.userInfo);
  //输入框和选择框的值
  const [modalState, setModalState] = useState({
    project: null,
    num: "",
    areaCode: null,
  });
  const [openLoading, setOpenLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useState({});
  //下拉框选项
  const [packList, setPackList] = useState([]);

  useEffect(() => {
    async function getSelectList() {
      let result = await getProjectPackList();
      const { code, data, msg } = result || {};
      message.destroy();
      if (code === 200) {
        setPackList([...data?.price]);
        const { state } = location;
        if (state?.app_id && state?.num) {
          setModalState({
            project: state?.app_id,
            num: state?.num,
          });
        }
      } else {
        message.error(msg);
      }
    }
    getSelectList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function getDetails() {
      let index =
        packList &&
        packList.findIndex((item) => item.app_id === modalState.project);
      setOpenLoading(true);
      let result = await getPackDetail({
        price_id: packList[index]?.id,
        app_id: packList[index]?.app_id,
        type: "2",
      });
      const { code, data, msg } = result || {};
      message.destroy();
      if (code === 200) {

        setProjectDetail({ ...data });
      } else {
        message.error(msg);
      }
      setOpenLoading(false);
    }
    if (modalState.project) {
      getDetails();
    }
  }, [modalState.project]); // eslint-disable-line react-hooks/exhaustive-deps

  const unitPrice = useMemo(() => {
    let price = 0;
    if (projectDetail.pack_id) {
      let index = projectDetail?.pack_id.findIndex(
        (item) => item.name === "CK"
      );
      price = projectDetail?.pack_id[index]?.price;
    }
    return price;
  }, [projectDetail]);

  const inventory = useMemo(() => {
    let availableNum = 0;
    if (projectDetail.pack_id) {
      let index = projectDetail?.pack_id.findIndex(
        (item) => item.name === "CK"
      );
      availableNum = projectDetail?.pack_id[index]?.availableNum;
    }
    return availableNum;
  }, [projectDetail]);

  const totalPrice = useMemo(() => {
    let price = 0;
    const { discount } = userInfo;
    if (projectDetail.pack_id) {
      let index = projectDetail?.pack_id.findIndex(
        (item) => item.name === "CK"
      );
      if (projectDetail?.pack_id[index]?.price && modalState.num) {
        price = Number(projectDetail?.pack_id[index]?.price) * modalState.num;
      }
    }
    return price * Number(discount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDetail, modalState.num]);

  const filterOption = (input, option) => {
    return (option?.children ?? "").toLowerCase().includes(input.toLowerCase());
  };

  const openModalCancel = () => {
    setModalState({
      project: null,
      num: "",
    });
    setProjectDetail({});
    cancelModal();
  };

  //创建
  const comBtn = async () => {
    console.log(21);
    message.destroy();
    if (!modalState.num) {
      return message.error("最低数量为1");
    }
    let parma = {
      name: projectDetail?.app_name,
      price_id: projectDetail?.id,
      num: modalState.num,
      is_op: 2,
    };
    if (projectDetail?.url) {
      // const w = window.open("about:blank");
      // w.location.href = projectDetail?.url;
      message.destroy();
      return message.error("请联系客服");
    }
    if (projectDetail?.pack_id) {
      let index = projectDetail?.pack_id.findIndex(
        (item) => item.name === "CK"
      );
      parma.package_id = projectDetail?.pack_id[index]?.package_id;
    } else {
      return;
    }
    // if (!modalState.areaCode) {
    //   return message.error("请选择区域");
    // }
    parma.city_code = modalState.areaCode + "";
    parma.package_id = 10006;

    setOpenLoading(true);
    let result = await setAddOpen({ ...parma });
    const { code, msg } = result || {};
    if (code === 200) {
      setModalState({
        project: null,
        num: "",
      });
      setProjectDetail({});
      message.success("创建成功");
      comModal();
    } else {
      message.error(msg);
    }
    setOpenLoading(false);
  };

  return (
    <Spin spinning={openLoading}>
      <div className="create-open-modal-item">
        <span>项目：</span>
        <Select
          value={modalState.project}
          style={{ width: "160px" }}
          placeholder="请选择项目"
          optionFilterProp="children"
          showSearch
          onChange={(value) =>
            setModalState((data) => ({ ...data, project: value, num: "1" }))
          }
          filterOption={filterOption}
        >
          {packList &&
            packList.map((item, index) => {
              return (
                <Option key={index} value={item.app_id}>
                  {item.app_name}
                </Option>
              );
            })}
        </Select>
      </div>
      <div className="create-open-modal-item">
        <span>数量：</span>
        <Input
          value={modalState.num}
          style={{ width: "200px" }}
          onChange={(even) =>
            setModalState((data) => ({ ...data, num: even.target.value }))
          }
          placeholder="请输入数量"
        />
      </div>
      {projectDetail?.id === 386 && (
        <div className="create-open-modal-item">
          <span>区域：</span>
          <Select
            value={modalState.areaCode}
            style={{ width: "160px" }}
            placeholder="请选择区域"
            optionFilterProp="children"
            showSearch
            onChange={(value) =>
              setModalState((data) => ({ ...data, areaCode: value }))
            }
            filterOption={filterOption}
          >
            {areaList &&
              areaList.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </div>
      )}

      <div className="create-open-modal-item">
        <span>库存：</span>
        <span className="create-open-modal-item-price">{inventory || 0}</span>
      </div>
      <div className="create-open-modal-item">
        <span>单价：</span>
        <span className="create-open-modal-item-price">{unitPrice || 0}</span>
      </div>
      {userInfo?.discount && userInfo?.discount !== 1 && (
        <div className="create-open-modal-item" style={{ color: "red" }}>
          <span>折扣：</span>
          <span className="create-open-modal-item-price">
            {userInfo?.discount}折
          </span>
        </div>
      )}
      <div className="create-open-modal-item">
        <span>总价：</span>
        <span className="create-open-modal-item-price">
          {(totalPrice && totalPrice.toFixed(2)) || 0}
        </span>
      </div>
      <div className="create-open-modal-item-btn">
        <Button onClick={openModalCancel}>取消</Button>
        <Button type="primary" style={{ marginLeft: "20px" }} onClick={comBtn}>
          确认
        </Button>
      </div>
    </Spin>
  );
}
