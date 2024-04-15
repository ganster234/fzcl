import React from "react";
import "./ContentLayouts.less";

export default function ContentLayouts({ top, content }) {
  return (
    <>
      <div className="content-top">{top}</div>
      <div className="content-content">{content}</div>
    </>
  );
}
