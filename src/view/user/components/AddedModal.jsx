import React, { useRef, useState } from "react";
import { Button, Upload, message, Spin } from "antd";

import uploadSelect from "../../../assets/image/trust/upload-file-select.png";
import uploadDownload from "../../../assets/image/trust/upload-file-download.png";
import uploadFile from "../../../assets/image/trust/upload-file.png";

const { Dragger } = Upload;

export default function AddedModal({ changeAdded }) {
  const [addModalLoading, setAddModalLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const props = {
    name: "file",
    multiple: true,
    headers: {
      token: token,
    },
    action: "http://192.168.0.132/v1/app/trusteeshi/upload",
    onChange(info) {
      const { status } = info.file;
      setAddModalLoading(true);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setAddModalLoading(false);
        message.success(`${info.file.name} 上传成功`);
        changeAdded(false);
      } else if (status === "error") {
        message.error(`${info.file.name}上传失败，请重新上传`);
      }
      setAddModalLoading(false);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const upload = useRef();

  const uploadBtn = () => {
    upload.current.click();
  };

  const downloadTemplate = () => {
    const w = window.open("about:blank");
    w.location.href = "http://192.168.0.132/template.xlsx";
  };
  return (
    <Spin spinning={addModalLoading}>
      <div className="added-modal">
        <div className="added-modal-bor"></div>
        <div className="added-modal-title">
          风险提示：您理解并同意，你需要确保账号密码的真实性和可用性，途中不可修改账号密码。单笔交易售后时间为7天，再此期间此笔交易款将被冻结直至售后截止。您已知悉上诉风险提示。
        </div>
        <div className="added-modal-upload-file">
          <span className="added-modal-item-title">
            <span className="added-modal-item-title-prompt">*</span>
            <span>上传文件：</span>
          </span>
          <div className="added-modal-item-content">
            <Dragger {...props} className="upload-file-frame">
              <img
                src={uploadFile}
                alt=""
                className="upload-file-icon"
                ref={upload}
              />
              <div className="drag-upload">
                将文件拖拽至此处，或{" "}
                <span className="drag-upload-text">点击上传</span>
              </div>
              <div className="drag-upload-stencil">
                请选择文件方式上传，下方可下载文件模板
              </div>
            </Dragger>

            <div className="upload-file-frame-btn-box">
              <span
                className="upload-file-frame-btn upload-file-frame-btn-select"
                onClick={() => uploadBtn()}
              >
                <img
                  src={uploadSelect}
                  alt=""
                  className="upload-file-frame-btn-icon"
                />
                选择文件
              </span>
              <span
                onClick={downloadTemplate}
                className="upload-file-frame-btn upload-file-frame-btn-download"
              >
                <img
                  src={uploadDownload}
                  alt=""
                  className="upload-file-frame-btn-icon"
                />
                下载模板
              </span>
            </div>
          </div>
        </div>

        {/* <div className="added-modal-upload-file added-modal-upload-item">
        <span className="added-modal-item-title">
          <span className="added-modal-item-title-prompt">*</span>
          <span>GUID：</span>
        </span>
        <div className="added-modal-item-content">
          <Input  placeholder="请输入GUID"></Input>
        </div>
      </div>
      <div className="added-modal-upload-file added-modal-upload-item">
        <span className="added-modal-item-title">
          <span className="added-modal-item-title-prompt">*</span>
          <span>类型：</span>
        </span>
        <div className="added-modal-item-content">
          <Radio.Group>
            <Radio value={1}>全部</Radio>
            <Radio value={2}>open</Radio>
            <Radio value={3}>代销</Radio>
            <Radio value={4}>ck</Radio>
          </Radio.Group>
        </div>
      </div> */}
        <div className="added-modal-upload-file">
          <Button
            type="primary"
            style={{ margin: "60px 0 40px 0", width: "375px", height: "40px" }}
            onClick={() => changeAdded(false)}
          >
            确定
          </Button>
        </div>
      </div>
    </Spin>
  );
}
