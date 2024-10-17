import dayjs from "dayjs";
export const urlConfigColumns = [
  {
    title: "url名称",
    dataIndex: "Device_name",
  },
  {
    title: "状态",
    // dataIndex: "is_use",
    dataIndex: "Device_state",
    render: (record) => (
      <div>
        {record === "0" && "开启"}
        {record === "1" && "关闭"}
      </div>
    ),
  },
  {
    title: "url地址",
    dataIndex: "Device_url",
  },
];
export const settlement = [
  {
    title: "支付名",
    dataIndex: "Device_name",
  },
  {
    title: "状态",
    dataIndex: "Device_state",
    render: (record) => (
      <div>
        {record === "0" && "开启"}
        {record === "1" && "关闭"}
      </div>
    ),
  },
  {
    title: "支付类型",
    dataIndex: "Device_type",
  },
];
export const projectColumns = [
  {
    title: "项目名称",
    dataIndex: "Device_name",
  },
  // {
  //   title: "日卡老号",
  //   dataIndex: "distribution_price0",
  // },
  {
    title: "日卡",
    dataIndex: "Device_day",
  },
  {
    title: "周卡",
    dataIndex: "Device_week",
  },
  {
    title: "月卡",
    dataIndex: "Device_month",
  },
  // {
  //   title: "信用分300",
  //   dataIndex: "distribution_price4",
  // },
  // {
  //   title: "30天回归",
  //   dataIndex: "distribution_price4",
  // },
  // {
  //   title: "CK",
  //   dataIndex: "distribution_price5",
  // },
  // {
  //   title: "open",
  //   dataIndex: "distribution_price6",
  // },
  // {
  //   title: "15级号",
  //   dataIndex: "distribution_price7",
  // },
  // {
  //   title: "21级号",
  //   dataIndex: "distribution_price8",
  // },
  // {
  //   title: "15W豆",
  //   dataIndex: "distribution_price9",
  // },
];

export const userListColumns = [
  {
    title: "账号",
    dataIndex: "Device_name",
  },
  {
    title: "邀请人",
    dataIndex: "Device_yname",
  },
  {
    title: "权限",
    dataIndex: "Device_type",
    // render: (record) => (
    //   <div>
    //     {record === 0 && "管理员"}
    //     {record === 2 && "普通用户"}
    //   </div>
    // ),
  },
  {
    title: "是否禁用",
    dataIndex: "Device_state",
    // render: (record) => (
    //   <div>
    //     {record === 0 && "正常"}
    //     {record === 1 && "禁用"}
    //   </div>
    // ),
  },
  {
    title: "余额",
    dataIndex: "Device_money",
  },
  {
    title: "创建时间",
    dataIndex: "Device_time",
  },
];

export const priceManageColumns = [
  {
    title: "账号",
    dataIndex: "account",
  },
  {
    title: "项目名称",
    dataIndex: "price_name",
  },
  {
    title: "套餐",
    dataIndex: "pack_name",
  },
  // {
  //   title: "类型",
  //   dataIndex: "type",
  //   render: (record) => (
  //     <div>
  //       {record === 0 && "全部"}
  //       {record === 1 && "PC"}
  //       {record === 2 && "Open"}
  //       {record === 3 && "Ck"}
  //     </div>
  //   ),
  // },
  {
    title: "套餐折扣",
    dataIndex: "price",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
  },
];

export const scanColumns = [
  {
    title: "appid",
    dataIndex: "Device_appid",
  },
  {
    title: "项目名称",
    dataIndex: "Device_name",
    render: (record) => <div>{record || "-"}</div>,
  },
  {
    title: "订单号",
    dataIndex: "Device_psid",
  },
  {
    title: "套餐名",
    dataIndex: "Device_pname",
    render: (record) => <div>{record || "-"}</div>,
  },
  {
    title: "套餐类型",
    dataIndex: "Device_tcname",
    render: (record) => <div>{record || "-"}</div>,
  },
  {
    title: "扫码类型",
    dataIndex: "Device_type",
    render: (record) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="scan-type"
          style={{
            color: record === "首次扫码" ? "#327dfc" : "#f7bb1e",
            border:
              record === "首次扫码" ? "1px solid #327dfc" : "1px solid #f7bb1e",
          }}
        >
          {record}
        </div>
      </div>
    ),
  },
  {
    title: "扫码状态",
    dataIndex: "Device_state",
    render: (record) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="scan-type"
          style={{
            color: record === "扫码成功" ? "#12C3B1" : "#f53e56",
            border:
              record === "扫码成功" ? "1px solid #12c3b1" : "1px solid #f53e56",
          }}
        >
          {record}
        </div>
      </div>
    ),
  },
  {
    title: "备注",
    dataIndex: "Device_remark",
  },
  {
    title: "创建时间",
    dataIndex: "Device_time",
  },
];

export const experience = [
  {
    title: "账号名称",
    dataIndex: "Device_name",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "充值金额",
    dataIndex: "Device_mball",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "状态",
    dataIndex: "Device_shstate",
    render: (record) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="scan-type"
          style={{
            color: record === "通过" ? "#327dfc" : "#f53e56",
            border:
              record === "通过" ? "1px solid #327dfc" : "1px solid #f53e56",
          }}
        >
          {record}
        </div>
      </div>
    ),
    // render: (record) => (
    //   <span>
    //     {record === "0"
    //       ? "待审核"
    //       : record === "1"
    //       ? "通过"
    //       : record === "2"
    //       ? "驳回"
    //       : "-"}
    //   </span>
    // ),
  },
  {
    title: "交易单号",
    dataIndex: "Device_num",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "创建时间",
    dataIndex: "Device_time",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
];
export const apply_show = [
  {
    title: "申请账号",
    dataIndex: "account",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "项目名称",
    dataIndex: "app_name",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "项目地址",
    dataIndex: "url",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "类型",
    dataIndex: "type",
    render: (record) => (
      <span>{record === 1 ? "Q" : record === 2 ? "WX" : "全部"}</span>
    ),
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
];

export const iPtable = [
  {
    title: "账号",
    dataIndex: "Device_Name",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "备注",
    dataIndex: "Device_Remark",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "创建时间",
    dataIndex: "Device_Time",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
];
export const addProjectTable = [
  {
    title: "项目名称",
    dataIndex: "Device_name",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "项目链接",
    dataIndex: "Device_url",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "状态", //0 审核中 1已审核 2拒绝
    dataIndex: "Device_state",
    render: (record) => (
      <>
        {record === "0"
          ? "审核中"
          : record === "1"
          ? "已审核"
          : record === "2"
          ? "拒绝"
          : "-"}
      </>
    ),
  },
  {
    title: "创建时间",
    dataIndex: "Device_time",
  },
  {
    title: "审核人员",
    dataIndex: "Device_shuser",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "提交人员",
    dataIndex: "Device_user",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "项目类型", //全部 0 Q 1 V 2
    dataIndex: "Device_type",
    render: (record) => (
      <>
        {record === "0"
          ? "全部"
          : record === "1"
          ? "Q"
          : record === "2"
          ? "V"
          : "-"}
      </>
    ),
  },
];

export const payColumns = [
  {
    title: "任务编号",
    dataIndex: "Device_Sid",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "项目名称",
    dataIndex: "Device_name",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "账号名称",
    dataIndex: "Device_user",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "套餐名称",
    dataIndex: "Device_pname",
    render: (record) => <span>{record ? record : "-"}</span>,
  },
  {
    title: "订单数量",
    dataIndex: "Device_num",
    render: (record) => <span>{record ? record : "0"}</span>,
  },
  {
    title: "支付金额",
    dataIndex: "Device_money",
  },
  {
    title: "剩余金额",
    dataIndex: "Device_yemoney",
  },
  {
    title: "创建时间",
    dataIndex: "Device_time",
  },
];

export const rechargeColumns = [
  {
    title: "充值用户",
    dataIndex: "Device_name",
    render: (record) => <>{record ? record : "-"}</>,
  },
  {
    title: "数量",
    dataIndex: "Device_num",
  },
  {
    title: "余额",
    dataIndex: "Device_mb",
    render: (record) => <>{record ? record : "-"}</>,
  },
  {
    title: "订单号",
    dataIndex: "Device_Sid",
  },
  {
    title: "充值金额",
    dataIndex: "Device_mball",
  },
  {
    title: "状态",
    dataIndex: "Device_state",
    render: (record) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="open-task-status"
          style={{
            color: record === "派单中" ? "#666666" : "#12C3B1 ",
            border:
              record === "派单中" ? "1px solid #666666" : "1px solid #12C3B1",
          }}
        >
          {record}
        </div>
      </div>
    ),
    // render: (record) => (
    //   <>
    //     {record === -1
    //       ? "全部"
    //       : record === 1
    //       ? "成功"
    //       : record === 0
    //       ? "支付中"
    //       : "-"}
    //   </>
    // ),
  },
  {
    title: "标题",
    dataIndex: "Device_mbweb",
  },
  {
    title: "创建时间",
    dataIndex: "Device_time",
  },
];

export const groupColumns = [
  {
    title: "ID",
    dataIndex: "Device_gid",
  },
  {
    title: "分组名称",
    dataIndex: "Device_Name",
  },
  {
    title: "创建时间",
    dataIndex: "Device_time",
  },
];

export const openColumns = [
  {
    title: "任务名称",
    dataIndex: "Device_name",
  },
  {
    title: "任务数量",
    dataIndex: "Device_num",
  },
  {
    title: "已完成数量",
    dataIndex: "Device_wcnum",
  },
];

export const trustColumns = [
  {
    title: "托管账号",
    dataIndex: "username",
  },
  {
    title: "托管账号",
    dataIndex: "guid",
  },
  {
    title: "托管人",
    dataIndex: "user_account",
  },
  {
    title: "销售额",
    dataIndex: "price",
  },
  {
    title: "收益",
    dataIndex: "income",
  },
  {
    title: "托管时间",
    dataIndex: "create_time",
  },
];

export const orderColumns = [
  // {
  //   title: "订单ID",
  //   dataIndex: "id",
  // },
  // {
  //   title: "用户",
  //   dataIndex: "account",
  // },
  {
    title: "订单号",
    width: 360,
    dataIndex: "Device_Sid",
  },
  {
    title: "用户",
    dataIndex: "Device_name",
  },
  {
    title: "项目ID",
    dataIndex: "Device_pid",
  },
  {
    title: "项目名字",
    dataIndex: "Device_pname",
  },

  {
    title: "套餐",
    width: 120,
    dataIndex: "Device_tname",
    render: (record) => <span>{record ? record : "--"}</span>,
  },
  {
    title: "状态", //状态  0未使用  1已使用
    dataIndex: "Device_use",
    // render: (record) => (
    //   <span>{record === "0" ? "未使用" : record === "1" ? "已使用" : "-"}</span>
    // ),
    render: (record) => {
      let color = "black";
      let text = "-";

      if (record === "0") {
        color = "#f7bb1e"; // 未使用
        text = "未使用";
      } else if (record === "1") {
        color = "#12C3B1"; // 已使用
        text = "已使用";
      }

      return <span style={{ color }}>{text}</span>;
    },
  },
  {
    title: "售后", //售后 0未售后  1 已售后
    dataIndex: "Device_sh",
    render: (record) => (
      <span>{record === "0" ? "未售后" : record === "1" ? "已售后" : "-"}</span>
    ),
  },
  // {
  //   title: "分组",
  //   dataIndex: "group_name",
  //   render: (record) => <span>{record ? record : "--"}</span>,
  // },
  // {
  //   title: "投保",
  //   dataIndex: "isInsure",
  //   render: (record) => <span>{record === 1 ? "已投保" : "未投保"}</span>,
  // },
  // {
  //   title: "倍数",
  //   dataIndex: "number",
  //   render: (record) => <span>{record ? record : "--"}</span>,
  // },
  // {
  //   title: "投保金额",
  //   dataIndex: "insurePrice",
  //   render: (record) => <span>{record ? record : "--"}</span>,
  // },
  // {
  //   title: "创建时间",
  //   width: 200,
  //   dataIndex: "createTime",
  // },
  {
    title: "到期时间",
    width: 200,
    dataIndex: "Device_dqtime",
    // render: (record) => (
    //   <span>
    //     {record ? dayjs(record * 1000).format("YYYY-MM-DD HH:mm:ss") : "-"}
    //   </span>
    // ),
  },
  // {
  //   title: "更新时间",
  //   width: 200,
  //   dataIndex: "updateTime",
  // },
];

export const wholeDealColumns = [
  {
    title: "发布人账号",
    dataIndex: "release_account",
  },
  {
    title: "接单人",
    dataIndex: "order_account",
    render: (record) => <span>{record ? record : "--"}</span>,
  },
  {
    title: "需求数量",
    dataIndex: "num",
  },
  {
    title: "项目",
    dataIndex: "price_name",
  },
  {
    title: "单价 / 总价",
    render: (record) => (
      <span className="price-total">
        <span>{record.price}</span>
        <span className="price-total-content">/</span>
        <span className="whole-deal-total">{record.total}</span>
      </span>
    ),
  },
  {
    title: "状态",
    dataIndex: "status",
    render: (record) => (
      <span>
        {record === 0 && (
          <span className="whole-deal-pending-orders">可接单</span>
        )}
        {record === 1 && (
          <span className="whole-deal-status-received-order">已接单</span>
        )}
        {record === 2 && (
          <span className="whole-deal-status-market">交易中</span>
        )}
        {record === 3 && (
          <span className="whole-deal-status-complete">已完成</span>
        )}
        {record === 4 && <span>已取消</span>}
      </span>
    ),
  },
  {
    title: "发布时间",
    dataIndex: "create_time",
  },
  {
    title: "备注",
    width: 200,
    dataIndex: "remark",
    render: (record) => <span>{record ? record : "--"}</span>,
  },
];

export const processColumns = [
  {
    title: "发布人账号",
    dataIndex: "account",
  },
  {
    title: "提交时间",
    dataIndex: "create_time",
  },
  {
    title: "充值金额USDT",
    dataIndex: "money",
  },
];

export const cashColumns = [
  {
    title: "开户行",
    width: 200,
    dataIndex: "bank",
  },
  {
    title: "银行卡号",
    width: 300,
    dataIndex: "account_bank",
  },
  {
    title: "用户姓名",
    dataIndex: "username",
  },
  {
    title: "提现账号",
    dataIndex: "account",
  },
  {
    title: "提现金额",
    dataIndex: "money",
  },
  {
    title: "审核状态",
    dataIndex: "status",
    render: (record) => (
      <div className="cash-status-box">
        {record === 0 && (
          <div className="cash-status-box">
            <span className="cash-status-icon cash-status-sq"></span>
            <span>申请中</span>
          </div>
        )}
        {record === 1 && (
          <div className="cash-status-box">
            <span className="cash-status-icon cash-status-ty"></span>
            <span>已同意</span>
          </div>
        )}
        {record === 2 && (
          <div className="cash-status-box">
            <span className="cash-status-icon cash-status-jj"></span>
            <span>已拒绝</span>
          </div>
        )}
      </div>
    ),
  },
  {
    title: "提现时间",
    width: 160,
    dataIndex: "create_time",
  },
  {
    title: "备注",
    dataIndex: "remark",
    width: 300,
    render: (record) => <div>{record || "-"}</div>,
  },
];

export const incomeColumns = [
  {
    title: "用户名称",
    dataIndex: "account",
  },
  {
    title: "用户名称",
    dataIndex: "incone_account",
  },
  {
    title: "充值时间",
    dataIndex: "create_time",
  },
  {
    title: "充值金额",
    dataIndex: "money",
  },
  {
    title: "返利金额",
    dataIndex: "incone",
  },
];

export const kamiColumns = [
  {
    title: "购买用户",
    dataIndex: "user_account",
  },
  {
    title: "使用用户",
    dataIndex: "use_account",
  },
  {
    title: "卡密",
    dataIndex: "card",
  },
  {
    title: "",
    dataIndex: "money",
  },
  {
    title: "购买时间",
    dataIndex: "create_time",
  },
  {
    title: "使用时间",
    dataIndex: "use_time",
  },
];

export const projectListColumns = [
  {
    title: "项目名称",
    dataIndex: "app_name",
  },
  {
    title: "官网地址",
    dataIndex: "url",
  },
];
// 联合项目
export const jointManagement = [
  {
    title: "创建时间",
    dataIndex: "create_time",
  },
  {
    title: "创建项目名",
    dataIndex: "app_name",
  },
  {
    title: "项目",
    dataIndex: "app_id",
  },
];
export const myaccountdata = [
  {
    title: "购买用户",
    dataIndex: "username",
  },
  {
    title: "下单时间",
    dataIndex: "create_time",
  },
  {
    title: "项目名称",
    dataIndex: "name",
  },
  {
    title: "套餐",
    dataIndex: "package_id",
  },
  {
    title: "账户",
    dataIndex: "account",
  },
  {
    title: "订单号",
    dataIndex: "order_id",
  },
];
