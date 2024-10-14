import { useNavigate } from "react-router-dom";
import "./df.less";

export default function Different() {
  const navigate = useNavigate();
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
        </div>
        <div className="myviode"></div>
      </div>
    </>
  );
}
