import React, { useState } from "react";
import { Input, Upload, message, Button, Spin } from "antd";

import addProjectIcon from "../../../assets/image/trust/leave-add-project.png";

const { Dragger } = Upload;

// 留言添加项目
export default function LeaveAddProject({ data, changeAddState, submitAdd }) {
  const [addLoading, setAddLoading] = useState(false);
  const props = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const submitTo = () => {
    message.destroy();
    if (!data?.project) {
      return message.error("请输入项目名称");
    }
    if (!data?.notes) {
      return message.error("请输入备注说明");
    }
    setAddLoading(true);
    setTimeout(() => {
      setAddLoading(false);
      submitAdd(false);
    }, 3000);
  };
  return (
    <Spin spinning={addLoading}>
      <div className="leave-add-project">
        <div className="leave-add-project-item">
          <div className="leave-add-project-item-title">
            <span className="leave-add-project-item-test">*</span>项目名称：
          </div>
          <Input
            value={data.project}
            onChange={(even) => changeAddState(even.target.value, "project")}
            placeholder="请输入项目名称"
            style={{ width: "488px" }}
          />
        </div>
        <div className="leave-add-project-item">
          <div className="leave-add-project-item-title">
            <span className="leave-add-project-item-test">*</span>备注说明：
          </div>
          <Input
            value={data.notes}
            onChange={(even) => changeAddState(even.target.value, "notes")}
            placeholder="请输入备注说明"
            style={{ width: "488px" }}
          />
        </div>
        <div className="leave-add-project-item">
          <div className="leave-add-project-item-title">项目相关截图：</div>
          <Dragger {...props}>
            {data?.screenshot && (
              <img src={data?.screenshot} alt="" className="add-project-box" />
            )}
            {!data?.screenshot && (
              <div className="add-project-box">
                <img src={addProjectIcon} alt="" className="add-project-icon" />
                <div className="add-project-text">
                  将图片拖拽至此处，或{" "}
                  <span className="add-project-uploading">点击上传</span>
                </div>
              </div>
            )}
          </Dragger>
        </div>
        <Button
          type="primary"
          style={{ width: "458px", height: "40px" }}
          onClick={submitTo}
        >
          立即提交
        </Button>
      </div>
    </Spin>
  );
}
