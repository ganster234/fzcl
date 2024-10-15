import { useNavigate } from "react-router-dom";
import useAppStore from "../../store";
import { Button } from "antd";
import "./df.less";

export default function Different() {
  const service = useAppStore((state) => state.service);
  console.log(service, "serviceserviceservice");
  const navigate = useNavigate();
  const newOpen = (val) => {
    window.open(val);
  };
  return (
    <>
      <div className="maxBox">
        <div className="totoTEx">
          <h1>WelCome</h1>
          <h3>欢迎回家</h3>
          <button
            className="btn32"
            onClick={() => {
              navigate("/layouts/thali/thail");
            }}
          >
            立 即 开 始
          </button>
          <div style={{ margin: "10px 0" }}>
            {service["apk_version"] && (
              <p>安卓版本：{service["apk_version"] || "-"}</p>
            )}
            {service["pc_version"] && (
              <p>PC版本：{service["pc_version"] || "-"}</p>
            )}
          </div>
          <div>
            {service["tutorial_document"] && (
              <Button
                onClick={() => newOpen(service["tutorial_document"])}
                style={{ marginRight: "20px" }}
                type="primary"
              >
                教程文档
              </Button>
            )}
            {service["web_addr"] && (
              <Button
                onClick={() => newOpen(service["web_addr"])}
                style={{ marginRight: "20px" }}
                type="primary"
              >
                网页上号地址
              </Button>
            )}
            {service["document_addr"] && (
              <Button
                onClick={() => newOpen(service["document_addr"])}
                document_addr
                style={{ marginRight: "20px" }}
                type="primary"
              >
                文档地址
              </Button>
            )}
          </div>
        </div>
        <div className="myviode"></div>
      </div>
    </>
  );
}
