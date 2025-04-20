import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function data(roomData) {
  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    cols_roomSelected: [
      { Header: roomData !== null? roomData.budget + "万预算在" + roomData.compounds_name:"", accessor: "function", align: "left" },
      { Header: roomData !== null? "可选": "", accessor: "employed", align: "left" },
    ],  

    rows_roomSelected: [
      {
        function: <Job title="面积段" description="预算范围内的房型" />,
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {roomData !== null? roomData.room_list.toString(): ""}
          </MDTypography>
        ),    
      },
      {
        function: <Job title="价格段" description="价格最低和最高范围" />,
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {roomData !== null? parseInt(roomData.price_min/10000) + "万 ~ " + parseInt(roomData.price_max/10000) + "万": ""}
          </MDTypography>
        ),    
      },      
      {
        function: <Job title="套数" description="年交易量预估" />,
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {roomData !== null? roomData.quantity.toFixed(2) + "套": ""}
          </MDTypography>
        ),
      },      
    ],
  };
}
