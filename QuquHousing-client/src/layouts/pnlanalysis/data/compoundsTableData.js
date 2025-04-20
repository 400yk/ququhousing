import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import CompoundsList from "layouts/dashboard/components/OrdersOverview/CompoundsList";

export default function data(compoundData) {
  const Job = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      {/* <MDTypography variant="caption">{description}</MDTypography> */}
    </MDBox>
  );

  return {
    columns: [
      { Header: "", accessor: "function", align: "left" },
      { Header: "", accessor: "employed", align: "center" },
    //   { Header: "", accessor: "action", align: "center" },
    ],  

    rows: [
      {
        function: <Job title="房龄（平均）" />,
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.year_built > 0)? compoundData.year_built: ""}
          </MDTypography>
        ),
        status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
            </MDBox>
          ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },
      {
        function: <Job title="总价（平均）" />,
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.avg_area > 0 && compoundData.est_price > 0)? parseInt(compoundData.avg_area * compoundData.est_price / 10000).toString() + "万元": ""}
          </MDTypography>
        ),
        status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
            </MDBox>
          ),        
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },
      {
        function: <Job title="单价（平均）" />,
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.est_price > 0)? parseInt(compoundData.est_price).toString() + "元/平": ""}
          </MDTypography>
        ),
        status: (
            <MDBox ml={-1}>
              <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
            </MDBox>
          ),        
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },      
      {
        function: <Job title="得房率（平均）" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.area_usage_rate > 0)? parseInt(compoundData.area_usage_rate * 100).toString() + "%": ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },
      {
        function: <Job title="车位比" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.parking_ratio > 0)? "1: " + compoundData.parking_ratio: ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },
      {
        function: <Job title="容积率" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.floor_area_ratio > 0)? compoundData.floor_area_ratio: ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },
      {
        function: <Job title="绿化率" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.green_coverage_ratio > 0)? parseInt(compoundData.green_coverage_ratio * 100) + "%": ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },
      {
        function: <Job title="商品房 或 动迁房" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {compoundData !== null? compoundData.property_type: ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },
      {
        function: <Job title="板楼 或 塔楼" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {compoundData !== null? compoundData.building_type: ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },      
      {
        function: <Job title="电梯房占比" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.elevator_rate > 0)? parseInt(100 * compoundData.elevator_rate) + "%": ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },    
      {
        function: <Job title="全人车分流" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {compoundData !== null? compoundData.car_separation: ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },         
      {
        function: <Job title="户数" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.num_units > 0)? compoundData.num_units: ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },      
      {
        function: <Job title="物业费" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {(compoundData !== null && compoundData.property_fee > 0)? compoundData.property_fee.toFixed(2) + "元/月/平": ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },             
      {
        function: <Job title="物业公司" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {compoundData !== null? compoundData.property_manager: ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },       
      {
        function: <Job title="外立面" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
          </MDBox>
        ),
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {compoundData !== null? compoundData.exterior_material: ""}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            分析
          </MDTypography>
        ),
      },                         
    ],
  };
}
