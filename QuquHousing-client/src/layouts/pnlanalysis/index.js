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
import Projects from "layouts/pnlanalysis/components/Projects";
import OrdersOverview from "layouts/pnlanalysis/components/OrdersOverview";
import MDButton from "components/MDButton";

import React from "react";
import { FormControl, FormControlLabel, FormLabel } from "@mui/material";
import { Select, MenuItem, InputLabel, RadioGroup, Radio } from '@mui/material';
import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { _get_border_input_list, getBorderBizcircle } from "layouts/utils";

const Analysis = () => {
  const [bizcircle, setBizcircle] = useState("");
  const [district, setDistrict] = useState("");
  const [topic, setTopic] = useState("FallPct");
  const [mapData, setMapData] = useState([]);
  const [CompoundIndexSelected, setCompoundIndexSelected] = useState(0);
  const [borderBizcircle, setBorderBizcircle] = useState({});
  const [subwayVisible, setSubwayVisible] = useState(false);
  const [highwayVisible, setHighwayVisible] = useState(true);
  const [compoundNameVisible, setCompoundNameVisible] = useState(false);
  const [toggleDistrict, setToggleDistrict] = useState(false);
  const [toggleSatellite, setToggleSatellite] = useState(false);
  const [bizcircleVisible, setBizcircleVisible] = useState(false);
  const [sinceBuilt, setSinceBuilt] = useState(2000);
  const [fallPct, setFallPct] = useState(2.5);
  const [submitIndex, setSubmitIndex] = useState(0);
  const firstTimeLoad = useRef(true);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (firstTimeLoad.current) { //确保第一次加载页面时候不触发
      firstTimeLoad.current = false; 
      return;
    }
    console.log(submitIndex);
    let isMounted = true;
    const controller = new AbortController();

    const fetchCompounds = async () => {
      try {
        const response = await axiosPrivate.post('/analysis', {
          signal: controller.signal,
          bizcircle: bizcircle,
          district: district,
          sinceBuilt: sinceBuilt,
          fallPct: fallPct,
          topic: topic,
        });
        console.log(response);
        isMounted && setMapData(response.data);
        setBorderBizcircle(getBorderBizcircle(district, bizcircle));
      } catch (err) {
        console.log(err);
        navigate('/authentication/sign-in', { state: { from: location }, replace: true });
      }
    }

    fetchCompounds();
    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [submitIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    setSubmitIndex(submitIndex + 1);
  };

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
                defaultValue=""
                mb={1.5}
                value={bizcircle}
                onChange={(e) => setBizcircle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-label">房龄</InputLabel>
                <Select
                  label="房龄"
                  name="sinceBuilt"
                  value={sinceBuilt}
                  onChange={(e) => setSinceBuilt(e.target.value)}
                  sx={{
                    width: 200,
                    height: 50,
                  }}>
                  <MenuItem value={2015}>&#8805; 2015年</MenuItem>
                  <MenuItem value={2010}>&#8805; 2010年</MenuItem>
                  <MenuItem value={2005}>&#8805; 2005年</MenuItem>
                  <MenuItem value={2000}>&#8805; 2000年</MenuItem>
                  <MenuItem value={1990}>&#8805; 1990年</MenuItem>
                  <MenuItem value={1}>不限</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-label">幅度筛选</InputLabel>
                <Select
                  label="单价涨跌幅"
                  name="fallPct"
                  value={fallPct}
                  onChange={(e) => setFallPct(e.target.value)}
                  sx={{
                    width: 200,
                    height: 50,
                  }}>
                  <MenuItem value={-30}>&#8804; -30%</MenuItem>
                  <MenuItem value={-20}>&#8804; -20%</MenuItem>
                  <MenuItem value={-10}>&#8804; -10%</MenuItem>
                  <MenuItem value={-5}>&#8804; -5%</MenuItem>
                  <MenuItem value={0}>&#8804; 0%</MenuItem>
                  <MenuItem value={2.5}>&#8804; 2.5%</MenuItem>
                  <MenuItem value={15}>&#8805; 15%</MenuItem>
                  <MenuItem value={20}>&#8805; 20%</MenuItem>
                  <MenuItem value={25}>&#8805; 25%</MenuItem>
                  <MenuItem value={30}>&#8805; 30%</MenuItem>
                  <MenuItem value={35}>&#8805; 35%</MenuItem>
                  <MenuItem value={40}>&#8805; 40%</MenuItem>
                  <MenuItem value={45}>&#8805; 45%</MenuItem>
                  <MenuItem value={50}>&#8805; 50%</MenuItem>
                  <MenuItem value={55}>&#8805; 55%</MenuItem>
                  <MenuItem value={60}>&#8805; 60%</MenuItem>
                  <MenuItem value={70}>&#8805; 70%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={2}>
              <MDButton type="submit" variant="contained" color="info">
                分析
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
                control={<Checkbox checked={compoundNameVisible} onChange={() => setCompoundNameVisible(!compoundNameVisible)} />}
                label="显示小区名"
              />
              <FormControlLabel
                control={<Checkbox checked={toggleDistrict} onChange={() => setToggleDistrict(!toggleDistrict)} />}
                label="显示区域边界"
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
            <Grid item xs={12} md={6} lg={2}>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">分析维度</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={topic}
                  name="AnalysisTopic"
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <FormControlLabel value="peakFall" control={<Radio />} label="高峰跌幅" />
                  <FormControlLabel value="priceUnincreased" control={<Radio />} label="N年未涨" />
                  <FormControlLabel value="priceIncreased" control={<Radio />} label="涨幅分析" />
                </RadioGroup>
              </FormControl>
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
                showCompoundName={compoundNameVisible}
                showDistrict={toggleDistrict}
                showSatellite={toggleSatellite}
                showBizcircle={bizcircleVisible}
                analysisTopic={topic}
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

export default Analysis;
