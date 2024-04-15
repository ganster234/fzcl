import React from "react";
import { Input, Button } from "antd";
import { SearchOutlined, SyncOutlined, PlusOutlined } from "@ant-design/icons";

export default function SearchProject({
  projectName,
  changeProjectName,
  setSearchData,
  reset,
  addProject
}) {
  const search = () => {
    setSearchData({ projectName });
  };
  const resetting = () => {
    reset({ projectName: "" });
  };
  return (
    <div className="search-project">
      <div className="project-item">
        <div className="project-item-title">项目名称：</div>
        <Input
          value={projectName}
          onChange={(even) => changeProjectName(even.target.value)}
          style={{ width: "200px" }}
          placeholder="请输入项目名称"
        />
      </div>
      <Button
        className="margin-left-btn"
        type="primary"
        icon={<SearchOutlined />}
        onClick={search}
      >
        查询
      </Button>
      <Button
        className="margin-left-btn"
        icon={<SyncOutlined />}
        onClick={resetting}
      >
        重置
      </Button>
      <Button
        className="margin-left-btn"
        type="primary"
        danger
        onClick={addProject}
        icon={<PlusOutlined />}
      >
        添加项目
      </Button>
    </div>
  );
}
