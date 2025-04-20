// @mui material components
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components
import Projects from "layouts/notifications/components/Projects";
import OrdersOverview from "layouts/notifications/components/OrdersOverview";
import MDButton from "components/MDButton";

import React from "react";
import { FormControlLabel, FormGroup, FormLabel, FormControl } from "@mui/material";
import { Select, MenuItem, InputLabel } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Chart } from "chart.js";
import { CheckBox } from "@mui/icons-material";

const districts = [
  { value: "黄浦", label: "黄浦" },
  { value: "徐汇", label: "徐汇" },
  { value: "静安", label: "静安" },
  { value: "长宁", label: "长宁" },
  { value: "虹口", label: "虹口" },
  { value: "杨浦", label: "杨浦" },
  { value: "普陀", label: "普陀" },
  { value: "浦东", label: "浦东" },
  { value: "闵行", label: "闵行" },
  { value: "宝山", label: "宝山" },
  { value: "嘉定", label: "嘉定" },
  { value: "青浦", label: "青浦" },
  { value: "松江", label: "松江" },
  { value: "奉贤", label: "奉贤" },
  { value: "金山", label: "金山" },
  { value: "崇明", label: "崇明" },
];

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bizcircle: "古美",
      district: "",
      priceRange: [],
      mapData: [],
      CompoundIndexSelected: 0,
      borderBizcircle: {},
      subwayVisible: false,
      highwayVisible: true,
      compoundNameVisible: false,
      toggleTotalPrice: false,
      toggleSatellite: false,
      bizcircleVisible: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubwayCheckboxChange = this.handleSubwayCheckboxChange.bind(this);
    this.handleHighwayCheckboxChange = this.handleHighwayCheckboxChange.bind(this);
    this.handleCompoundNameCheckboxChange = this.handleCompoundNameCheckboxChange.bind(this);
    this.toggleTotalPriceChange = this.toggleTotalPriceChange.bind(this);
    this.toggleSatelliteChange = this.toggleSatelliteChange.bind(this);
    this.handleBizcircleCheckboxChange = this.handleBizcircleCheckboxChange.bind(this);
  }

  handleInputChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    console.log(name + " " + value);
    this.setState({
      [name]: value,
    });
  }

  handleSubwayCheckboxChange(e) {
    this.setState({
      subwayVisible: e.target.checked,
    });
  }

  handleBizcircleCheckboxChange(e) {
    this.setState({
      bizcircleVisible: e.target.checked,
    });
  }
 
  handleHighwayCheckboxChange(e) {
    this.setState({
      highwayVisible: e.target.checked,
    });
  }  

  handleCompoundNameCheckboxChange(e) {
    this.setState({
      compoundNameVisible: e.target.checked,
    });
  }

  toggleTotalPriceChange(e) {
    this.setState({
      toggleTotalPrice: e.target.checked,
    });
  }

  toggleSatelliteChange(e) {
    this.setState({
      toggleSatellite: e.target.checked,
    });
  }

  handleSubmit(e) {
    console.log(e);
    e.preventDefault();
    this.fetchCompounds();
  }

  fetchCompounds() {
    fetch(`http://localhost:3000/bizcircle/`, {
      method: "POST",
      headers: {
            'Content-Type':'application/json'/* 请求内容类型 */                
      },
      body: JSON.stringify({
        bizcircle: this.state.bizcircle,
        district: this.state.district,
        // priceRange: this.state.priceRange,
      }),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({
        mapData: data,
      });
      this.setState({
        borderBizcircle: this.getBorderBizcircle(),
      })
    }).catch(err => {
      alert(err);
    });
  }

  _get_border_input_list(jsonBorder, region_list) {
    let biz_list;
    if (region_list.includes('，')) {
      biz_list = region_list.split('，');
    } else {
      biz_list = [region_list];
    }

    var borders = {
      "type": "FeatureCollection",
      "features": [],
    };      

    for (var j = 0; j < biz_list.length; j++) { //对于每一个输入的板块
      for (var i = 0; i < jsonBorder.features.length; i++) {
        if (jsonBorder.features[i].properties.name === biz_list[j]) {
          var feature = jsonBorder.features[i];
          feature.geometry.coordinates[0].push(feature.geometry.coordinates[0][0]); //画周边图首尾需要连接，所以最后插入第一个坐标点
          borders.features.push(feature);
          break;
        }
      };
    };
    return (borders);
  }

  getBorderBizcircle() {
    if (this.state.district.length > 0) { //如果输入了区域，则优先计算区域边缘坐标
      const allDistricts = require("assets/QuquHousing/border_district_amap.json");
      const border_district = this._get_border_input_list(allDistricts, this.state.district);
      return (border_district);
    } else { //如果输入多个板块，一起计算多个板块的边缘坐标
      const allBizcircles = require("assets/QuquHousing/border_bizcircle_amap.json"); 
      const border_bizcircle = this._get_border_input_list(allBizcircles, this.state.bizcircle);
      return (border_bizcircle);
    }
  }

  selectCompound = i => {
    this.setState({
      CompoundIndexSelected: i,
    });
    console.log('CompoundIndexSelect: ' + i);
  }

  parseRoomSelectedData(data) {
    if ((data !== null) && (data.roomSelected !== null)) {
      var res = {
        quantity: 0.0,
        room_list: [],
        price_min: 0,
        price_max: 0,
        budget: this.state.totalPrice,
        compounds_name: data.name,
      };
      var str_list = data.roomSelected.split('],');
      var total_cnt = 0;
      var price_list = [];
      for (var i = 0; i < str_list.length; i++) {
        //数据样本：[5,3,1,115.0,9865507.56631818],
        //意义：套数，房间数，卫生间数，面积，总价格
        var info_list_i = str_list[i].slice(1).split(',');
        total_cnt += parseFloat(info_list_i[0]);
        price_list.push(parseInt(parseFloat(info_list_i[4])));
        res.room_list.push(parseInt(info_list_i[3]) + "平(" + info_list_i[1] + "房" + info_list_i[2] + "卫)");
      }
      res.quantity = total_cnt;
      res.price_min = Math.min.apply(null, price_list);
      res.price_max = Math.max.apply(null, price_list);
      return (res);
    } else {
      return null;
    };
  }

  render() {
      
     return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <form onSubmit={this.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={2}>
                {/* <InputLabel id="dropdown-district">选择区域</InputLabel>
                <Select
                  labelId="my-dropdown-label"
                  id="my-dropdown"
                  value={this.state.district}
                  onChange={this.handleInputChange}
                >
                  {districts.map((each) => (
                    <MenuItem key={each.value} value={each.value}>
                      {each.label}
                    </MenuItem>
                  ))}                   
                </Select> */}
                {/* <div class="dropdown">
                  <button class="btn bg-gradient-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Primary
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>                 */}
                <MDInput
                  name="district"
                  type="text"
                  label="区域"
                  defaultValue=""
                  mb={1.5}
                  value={this.state.district}
                  onChange={this.handleInputChange}
                />
              </Grid>              
              <Grid item xs={12} md={6} lg={2}>
                <MDInput
                  name="bizcircle"
                  type="text"
                  label="板块"
                  defaultValue="古美"
                  mb={1.5}
                  value={this.state.bizcircle}
                  onChange={this.handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <MDButton type="submit" variant="contained" color="info">
                  搜索小区
                </MDButton>
              </Grid>              
              <Grid item xs={12} md={6} lg={2}>
                <FormControlLabel
                  control={<Checkbox checked={this.state.subwayVisible} onChange={this.handleSubwayCheckboxChange} />}
                  label="显示地铁线"
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.highwayVisible} onChange={this.handleHighwayCheckboxChange} />}
                  label="显示环线"
                />                
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <FormControlLabel
                  control={<Checkbox checked={this.state.compoundNameVisible} onChange={this.handleCompoundNameCheckboxChange} />}
                  label="显示小区名"
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.toggleTotalPrice} onChange={this.toggleTotalPriceChange} />}
                  label="显示总价"
                />
              </Grid>        
              <Grid item xs={12} md={6} lg={2}>
                <FormControlLabel
                  control={<Checkbox checked={this.state.toggleSatellite} onChange={this.toggleSatelliteChange} />}
                  label="显示卫星图"
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.bizcircleVisible} onChange={this.handleBizcircleCheckboxChange} />}
                  label="显示板块"
                />                
              </Grid>                       
            </Grid>
          </form>
          <MDBox mt={1.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={8}>
                <Projects 
                  mapData={this.state.mapData} 
                  selectCompound={this.selectCompound} 
                  CompoundIndexSelected={this.state.CompoundIndexSelected}
                  borderBizcircle={this.state.borderBizcircle}
                  showSubway={this.state.subwayVisible}
                  showHighway={this.state.highwayVisible}
                  showCompoundName={this.state.compoundNameVisible}
                  showTotalPrice={this.state.toggleTotalPrice}
                  showSatellite={this.state.toggleSatellite}
                  showBizcircle={this.state.bizcircleVisible}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <OrdersOverview 
                  mapData={this.state.mapData} 
                  selectCompound={this.selectCompound} 
                  CompoundIndexSelected={this.state.CompoundIndexSelected}
                />
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }
}

export default Notifications;