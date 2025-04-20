// @mui material components
import Card from "@mui/material/Card";
import CompoundListItem from "../CompoundListItem";
// import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CompoundsList from "./CompoundsList";

// Material Dashboard 2 React example components
import React from "react";
import HouseImage from "assets/QuquHousing/house.png";
import { Grid } from "@mui/material";

class OrdersOverview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listId: "",
    };
  }

  makeProfileData = (raw) => {
    var result = [];
    if (raw) {
      raw.forEach(ele => {
        result.push({
          image: HouseImage,
          name: ele.name,
          est_price: ele.est_price,
          liquidity: ele.liquidity,
          year_built: ele.year_built,
          description: String(Math.round(ele.est_price)) + "元/平， 成交" + ele.liquidity + "套/年， " + ele.year_built + "年建",
          action: {
            type: "internal",
            route: "",
            color: "info",
            label: "详情",
          }
        });
      });
    }
    return (result);
  }

  render() {
    const { mapData, selectCompound, CompoundIndexSelected } = this.props;

    return (
      <Card sx={{ height: "100%" }}>
        <MDBox mt={0} mb={0} height="1600px" style={{maxHeight: "1200px", overflow: "auto"}}>
          <CompoundsList 
            sx={{ width: "100%" }}
            title="预算内小区列表" 
            profiles={this.makeProfileData(mapData)} 
            shadow={false}
            selectCompound = {selectCompound}
            CompoundIndexSelected = {CompoundIndexSelected}
            />
        </MDBox>
      </Card>
    );
  }
}

export default OrdersOverview;
