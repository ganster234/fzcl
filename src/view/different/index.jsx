import { useNavigate } from "react-router-dom";
import "./df.less";

export default function Different() {
  const navigate = useNavigate();
  return (
    <>
      <div className="maxBox">
        <div className="totoTEx">
          <h1>快手达人生态营销平台</h1>
          <h3>让内容和生意一拍即合</h3>
          <button className="btn32" onClick={(()=>{
            navigate("/layouts/thali/thail");
          })}>立 即 开 始</button>
        </div>
        <video
          className="myviode"
          autoPlay
          loop
          src={require("../../assets/image/shoviod.mp4")}
        ></video>
      </div>
    </>
  );
}
