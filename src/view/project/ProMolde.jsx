import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Form, Input, Radio, Button, message } from "antd";
import { getAddProject, setProject } from "../../api/project";
// props是接收父组件传来的参数，或者函数方法
function Lfrome() {
  return (
    <>
      <Form.Item
        name="app_id"
        label="app_id"
        rules={[{ required: true, message: "请输入内容!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="wx_app_id"
        label="wx_app_id"
        rules={[{ required: true, message: "请输入内容!" }]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
const Udetails = forwardRef((props, ref) => {
  const [iform] = Form.useForm();
  const [type, settype] = useState(0);
  const [is_app, setis_app] = useState("0");
  const [is_web, setis_web] = useState("0");
  const [is_game, setis_game] = useState("0");
  const [is_scan, setis_scan] = useState("0"); //是否扫码
  const [id, setid] = useState("0");
  const [addState, setaddState] = useState(false); //新增项目弹窗

  //useImperativeHandle方法将子组件的函数或者数据暴露给父组件
  useImperativeHandle(ref, () => ({
    setaddState,
    childFunction,
    fun2,
  }));
  const fun2 = () => {
    console.log("暴露函数2");
  };
  const childFunction = (val) => {
    console.log(val, "childFunction");

    iform.setFieldsValue({
      // app_name: val.app_name,
      // app_id: val.app_id,
      // logo_path: val.logo_path,
      // wx_app_id: val.wx_app_id,
      // pack_name: val.pack_name,
      // is_scan: val.is_scan,
      app_name: val.Device_name,
      app_id: val.Device_appid,
      logo_path: val.Device_url,
      wx_app_id: val.Device_appidwx,
      pack_name: val.Device_bag,
      is_scan: val.Device_sm,
    });
    settype(Number(val.Device_type));
    setis_app(val.Device_app + "");
    setis_web(val.Device_web + "");
    setis_game(val.Device_game + "");
    setid(val.Device_Sid + "");
    setis_scan(val.Device_sm + "");
  };
  const newlyincreased = async () => {
    //模态框确定函数
    try {
      const { app_name, app_id, wx_app_id, logo_path, pack_name } =
        await iform.validateFields();

      const apiData = {
        // ...values,
        // type: type + "",
        // is_app,
        // is_web,
        // is_game,
        // is_scan,
        Name: app_name, //项目名称
        Appid: app_id, //Appid
        Appidwx: wx_app_id, //wxAppid
        Url: logo_path,
        Type: type.toString(), //项目类型 0 全部 1 Q 2 W
        App: is_app, //app 1不是  0 是
        Sm: is_scan, //sm 1不是  0 是
        Web: is_web, //网页 1不是  0 是
        Game: is_game, //tx游戏 1不是  0 是
        Bag: pack_name, //包名
      };

      if (addState === "新增Q/W项目") {
        const { code, msg } = await getAddProject(apiData);
        // eslint-disable-next-line eqeqeq
        if (code == 200) {
          setaddState(false);
          props.getList();
        }
        message.info(msg);
      } else {
        const newapiData = {
          Sid: id,
          ...apiData,
        };
        const { code, msg } = await setProject(newapiData);
        // eslint-disable-next-line eqeqeq
        if (code == 200) {
          setaddState(false);
          props.getList();
        }
        message.info(msg);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };
  return (
    <>
      <Button
        onClick={() => {
          iform.resetFields();
          setaddState("新增Q/W项目");
        }}
        type="primary"
      >
        新增Q/W项目
      </Button>
      <Modal
        width={800}
        title={addState}
        open={addState}
        onOk={newlyincreased}
        onCancel={() => setaddState(false)}
      >
        <Form className=" fromItem " form={iform} layout="vertical">
          <Form.Item
            name="app_name"
            label="项目名称"
            rules={[{ required: true, message: "请输入内容!" }]}
          >
            <Input />
          </Form.Item>
          {type === 1 ? (
            <>
              <Form.Item
                name="app_id"
                label="app_id"
                rules={[{ required: true, message: "请输入内容!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item></Form.Item>
            </>
          ) : type === 2 ? (
            <>
              <Form.Item
                name="wx_app_id"
                label="wx_app_id"
                rules={[{ required: true, message: "请输入内容!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item></Form.Item>
            </>
          ) : (
            <Lfrome></Lfrome>
          )}

          <Form.Item
            name="logo_path"
            label="图片地址"
            rules={[{ required: true, message: "请输入内容!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="项目类型">
            <Radio.Group
              onChange={(val) => settype(val.target.value)}
              value={type}
            >
              <Radio value={0}>全部</Radio>
              <Radio value={1}>Q</Radio>
              <Radio value={2}>W</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="是否APP">
            <Radio.Group
              onChange={(val) => setis_app(val.target.value)}
              value={is_app}
            >
              {/* <Radio value={"0"}>否</Radio>
              <Radio value={"1"}>是</Radio> */}
              <Radio value={"2"}>否</Radio>
              <Radio value={"0"}>是</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="是否扫码">
            <Radio.Group
              onChange={(val) => setis_scan(val.target.value)}
              value={is_scan}
            >
              {/* <Radio value={"0"}>否</Radio>
              <Radio value={"1"}>是</Radio> */}
              <Radio value={"1"}>否</Radio>
              <Radio value={"0"}>是</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="是否网页">
            <Radio.Group
              onChange={(val) => setis_web(val.target.value)}
              value={is_web}
            >
              {/* <Radio value={"0"}>否</Radio>
              <Radio value={"1"}>是</Radio> */}
              <Radio value={"1"}>否</Radio>
              <Radio value={"0"}>是</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="是否腾讯游戏">
            <Radio.Group
              onChange={(val) => setis_game(val.target.value)}
              value={is_game}
            >
              {/* <Radio value={"0"}>否</Radio>
              <Radio value={"1"}>是</Radio> */}
              <Radio value={"1"}>否</Radio>
              <Radio value={"0"}>是</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="pack_name" label="包名">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
export default Udetails;
