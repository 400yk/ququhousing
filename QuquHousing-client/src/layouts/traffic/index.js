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
import Projects from "layouts/traffic/components/Projects";
import OrdersOverview from "layouts/traffic/components/OrdersOverview";
import MDButton from "components/MDButton";

import React from "react";
import { FormControlLabel } from "@mui/material";
import { useState } from "react";
import { _get_border_input_list, getBorderBizcircle } from "layouts/utils";


const Traffic = () => {
  const [bizcircle, setBizcircle] = useState("");
  const [district, setDistrict] = useState("");
  const [mapData, setMapData] = useState([]);
  const [CompoundIndexSelected, setCompoundIndexSelected] = useState(0);
  const [borderBizcircle, setBorderBizcircle] = useState({});
  const [subwayVisible, setSubwayVisible] = useState(false);
  const [highwayVisible, setHighwayVisible] = useState(true);
  const [districtVisible, setDistrictVisible] = useState(false);
  const [toggleScore, setToggleScore] = useState(false);
  const [toggleSatellite, setToggleSatellite] = useState(false);
  const [bizcircleVisible, setBizcircleVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    fetchCompounds();
  };

  const fetchCompounds = () => {
    setBorderBizcircle(getBorderBizcircle(district, bizcircle));
  }

  const selectCompound = (i) => {
    setCompoundIndexSelected(i);
    console.log('CompoundIndexSelect: ' + i);
  }

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox py={3}>
        <form onSubmit={handleSubmit}>
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
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <MDInput
                name="bizcircle"
                type="text"
                label="板块"
                defaultValue="古美"
                mb={1.5}
                value={bizcircle}
                onChange={(e) => setBizcircle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <MDButton type="submit" variant="contained" color="info">
                详情
              </MDButton>
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <FormControlLabel
                control={<Checkbox checked={subwayVisible} onChange={() => setSubwayVisible(!subwayVisible)} />}
                label="显示地铁线"
              />
              <FormControlLabel
                control={<Checkbox checked={highwayVisible} onChange={() => setHighwayVisible(!highwayVisible)} />}
                label="显示环线"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <FormControlLabel
                control={<Checkbox checked={districtVisible} onChange={() => setDistrictVisible(!districtVisible)} />}
                label="显示区"
              />
              <FormControlLabel
                control={<Checkbox checked={toggleScore} onChange={() => setToggleScore(!toggleScore)} />}
                label="显示得分"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <FormControlLabel
                control={<Checkbox checked={toggleSatellite} onChange={() => setToggleSatellite(!toggleSatellite)} />}
                label="显示卫星图"
              />
              <FormControlLabel
                control={<Checkbox checked={bizcircleVisible} onChange={() => setBizcircleVisible(!bizcircleVisible)} />}
                label="显示板块"
              />
            </Grid>
          </Grid>
        </form>
        <MDBox mt={1.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects
                mapData={mapData}
                selectCompound={selectCompound}
                CompoundIndexSelected={CompoundIndexSelected}
                borderBizcircle={borderBizcircle}
                showSubway={subwayVisible}
                showHighway={highwayVisible}
                showDistrict={districtVisible}
                showScore={toggleScore}
                showSatellite={toggleSatellite}
                showBizcircle={bizcircleVisible}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview
                mapData={mapData}
                selectCompound={selectCompound}
                CompoundIndexSelected={CompoundIndexSelected}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Traffic;
