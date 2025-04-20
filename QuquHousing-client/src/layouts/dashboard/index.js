// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import TextField from '@mui/material/TextField';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
// import { Input } from "@mui/material";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MixedChart from "examples/Charts/MixedChart";
import DefaultDoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import DataTable from "examples/Tables/DataTable";
import compoundsTableData from "layouts/pnlanalysis/data/compoundsTableData";
import roomSelectedTableData from "layouts/pnlanalysis/data/roomSelectedTableData";
// import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
// import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import MDButton from "components/MDButton";

import React, { useState, useEffect, useRef } from "react";
import RadarChart from "examples/Charts/RadarChart";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FormControlLabel, FormLabel, FormControl, Autocomplete } from "@mui/material";
import { Select, MenuItem, InputLabel, Switch, Stack } from '@mui/material';
import { DISTRICT_BIZCIRCLE, DISTRICTS, WORKPLACES, _get_border_input_list, getBorderBizcircle } from "layouts/utils";
import TwoLevelSelect from "layouts/dashboard/components/TwoLevelSelect";
import { Popper } from '@mui/base/Popper';
import { Link } from "react-router-dom";

import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";


const Dashboard = () => {
  const [bizcircle, setBizcircle] = useState("");
  const [district, setDistrict] = useState("");
  const [compound, setCompound] = useState("");
  const [totalPrice_min, setTotalPrice_min] = useState(800);
  const [totalPrice_max, setTotalPrice_max] = useState(1000);
  const [numRooms, setNumRooms] = useState(new Set([2, 3]));
  const [area, setArea] = useState(100);
  const [sinceBuilt, setSinceBuilt] = useState(2000);
  const [mapData, setMapData] = useState([]);
  const [CompoundIndexSelected, setCompoundIndexSelected] = useState(0);
  const [avg_radarChartScore, setAvg_radarChartScore] = useState([]);
  const [borderBizcircle, setBorderBizcircle] = useState({});
  const [subwayVisible, setSubwayVisible] = useState(false);
  const [highwayVisible, setHighwayVisible] = useState(true);
  const [bizcircleVisible, setBizcircleVisible] = useState(false);
  const [compoundNameVisible, setCompoundNameVisible] = useState(false);
  const [satelliteVisible, setSatelliteVisible] = useState(false);
  const [isochroneVisible, setIsochroneVisible] = useState(true);
  const [isochronePolygon, setIsochronePolygon] = useState({});
  const [isochronePolygon2, setIsochronePolygon2] = useState({});
  const [workplace, setWorkplace] = useState("陆家嘴");
  const [workplace2, setWorkplace2] = useState("南京西路");
  const [commuteTime, setCommuteTime] = useState(40);
  const [commuteMethod, setCommuteMethod] = useState("walking_subway");
  const [liquidityFilter, setLiquidityFilter] = useState(1);
  const [filteredMapData, setFilteredMapData] = useState([]);

  const [anchor, setAnchor] = useState(null);
  const showExpiredPopup = !!anchor; //双非运算符，相当于boolean
  const [isFetching, setIsFetching] = useState(false); // change whether submit button is clickable

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
    let isMounted = true;
    const controller = new AbortController();

    const fetchCompounds = async () => {
      try {
        if (isochroneVisible) {
          const response = await axiosPrivate.post('/compounds/isochrone', {
            signal: controller.signal,
            totalPrice_min: totalPrice_min,
            totalPrice_max: totalPrice_max,
            numRooms: [...numRooms],
            area: area,
            sinceBuilt: sinceBuilt,
            commuteMethod: commuteMethod,
            commuteTime: commuteTime,
            workplace: workplace,
            workplace2: workplace2,
          });
          isMounted && setIsochronePolygon(response.data.isochrone);
          isMounted && setIsochronePolygon2(response.data.isochrone_workplace2);
          isMounted && setMapData(response.data.compounds);
          isMounted && setFilteredMapData(filterMapData(liquidityFilter, response.data.compounds));
          isMounted && setAvg_radarChartScore(calcAvgRadarChartScore());
        } else {
          const response = await axiosPrivate.post('/compounds/search', {
            signal: controller.signal,
            compound: compound,
            bizcircle: bizcircle,
            district: district,
            totalPrice_min: totalPrice_min,
            totalPrice_max: totalPrice_max,
            numRooms: [...numRooms],
            area: area,
            sinceBuilt: sinceBuilt,
          });
          isMounted && setMapData(response.data);
          isMounted && setBorderBizcircle(getBorderBizcircle(district, bizcircle));
          isMounted && setFilteredMapData(filterMapData(liquidityFilter, response.data));
          isMounted && setAvg_radarChartScore(calcAvgRadarChartScore());
        }

      } catch (err) {
        console.log(err);
        if (err?.response?.data?.message === "memberExpired") { //会员有效期到期的情况
          const submitBtn = document.getElementById("submitBtn");
          setAnchor(anchor ? null : submitBtn);
        } else {
          navigate('/authentication/sign-in', { state: { from: location }, replace: true });
        }
      } finally {
        setIsFetching(false);
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
    setSubmitIndex(submitIndex + 1);
    setIsFetching(true);
  };


  const handleLiquidityFilterChange = (e) => {
    setLiquidityFilter(e.target.value);
    //必须代入参数，因为上面一步的setState不是实时的，也就是liquidityFilter不是实时的，而e.target.value实时的
    setFilteredMapData(filterMapData(e.target.value));
    //另外解决方法：用setState的第二个参数做回调函数
  }

  const handleRoomCheckboxChange = (e) => {
    var rooms = parseInt(e.target.value);
    e.target.checked ?
      setNumRooms((prev) => new Set([...prev, rooms])) // add through setter funcion 
      : setNumRooms((prev) => new Set([...prev].filter((value) => value !== rooms))); // remove
  }

  const filterMapData = (liquidityFilter, mapData) => {
    var res = [];
    if (liquidityFilter == 0) {
      return (mapData);
    } else {
      if ((mapData.length > 0)) {
        mapData.forEach((e, i) => {
          if ((e.liquidity) && (e.liquidity >= liquidityFilter)) {
            res.push(e);
          }
        });
      }
    }
    return (res);
  }

  const calcRadarChartScore = (data) => {
    //计算雷达图得分
    //房龄：1990年以前1分，1990-2000：2分，2000-2005: 3分，2005-2010：4分，2010-2015：5分：2015以后：6分
    //车位比：0.3以下1分，0.3-0.5 2分，0.5-0.7 3分，0.7-0.9 4分，1-1.5 5分，1.5以上 6分
    //绿化率：0.3以下1分，0.3-0.349 2分，0.35-0.4 3分，0.4-0.45 4分，0.45-0.5 5分，0.5以上 6分
    //容积率：3以上1分，2.5-3 2分，2-2.5 3分，1.5-2 4分，1-1.5 5分，1及1以下 6分，
    //得房率：0.65以下1分，0.65-0.7 2分，0.7-0.75 3分，0.75-0.8 4分，0.8-0.85 5分，0.85-1 6分
    //平均房价：500以下1分，500-800万2分，800-1150万3分，1150-1500万4分，1500-2000万5分，2000万以上6分
    var yearBuiltScore = 0;
    var parkingRatioScore = 0;
    var greenRatioScore = 0;
    var floorAreaScore = 0;
    var areaUsageScore = 0;
    var avgValueScore = 0;
    switch (true) {
      case (data.year_built == null || data.year_built <= 0):
        yearBuiltScore = 0;
        break;
      case (data.year_built < 1990):
        yearBuiltScore = 1;
        break;
      case (data.year_built < 2000):
        yearBuiltScore = 2;
        break;
      case (data.year_built < 2005):
        yearBuiltScore = 3;
        break;
      case (data.year_built < 2010):
        yearBuiltScore = 4;
        break;
      case (data.year_built < 2015):
        yearBuiltScore = 5;
        break;
      case (data.year_built >= 2015):
        yearBuiltScore = 6;
        break;
      default:
        yearBuiltScore = 0;
    }

    switch (true) {
      case (data.parking_ratio == null || data.parking_ratio <= 0):
        parkingRatioScore = 0;
        break;
      case (data.parking_ratio < 0.3):
        parkingRatioScore = 1;
        break;
      case (data.parking_ratio < 0.5):
        parkingRatioScore = 2;
        break;
      case (data.parking_ratio < 0.7):
        parkingRatioScore = 3;
        break;
      case (data.parking_ratio < 1):
        parkingRatioScore = 4;
        break;
      case (data.parking_ratio < 1.5):
        parkingRatioScore = 5;
        break;
      case (data.parking_ratio >= 1.5):
        parkingRatioScore = 6;
        break;
      default:
        parkingRatioScore = 0;
    }

    switch (true) {
      case (data.green_coverage_ratio == null || data.green_coverage_ratio <= 0):
        greenRatioScore = 0;
        break;
      case (data.green_coverage_ratio < 0.3):
        greenRatioScore = 1;
        break;
      case (data.green_coverage_ratio < 0.35):
        greenRatioScore = 2;
        break;
      case (data.green_coverage_ratio < 0.4):
        greenRatioScore = 3;
        break;
      case (data.green_coverage_ratio < 0.45):
        greenRatioScore = 4;
        break;
      case (data.green_coverage_ratio < 0.5):
        greenRatioScore = 5;
        break;
      case (data.green_coverage_ratio >= 0.5):
        greenRatioScore = 6;
        break;
      default:
        greenRatioScore = 0;
    }

    switch (true) {
      case (data.floor_area_ratio == null || data.floor_area_ratio <= 0):
        floorAreaScore = 0;
        break;
      case (data.floor_area_ratio >= 3):
        floorAreaScore = 1;
        break;
      case (data.floor_area_ratio >= 2.5):
        floorAreaScore = 2;
        break;
      case (data.floor_area_ratio >= 2):
        floorAreaScore = 3;
        break;
      case (data.floor_area_ratio >= 1.5):
        floorAreaScore = 4;
        break;
      case (data.floor_area_ratio >= 1):
        floorAreaScore = 5;
        break;
      case (data.floor_area_ratio < 1):
        floorAreaScore = 6;
        break;
      default:
        floorAreaScore = 0;
    }

    switch (true) {
      case (data.area_usage_rate == null || data.area_usage_rate <= 0):
        areaUsageScore = 0;
        break;
      case (data.area_usage_rate < 0.65):
        areaUsageScore = 1;
        break;
      case (data.area_usage_rate < 0.7):
        areaUsageScore = 2;
        break;
      case (data.area_usage_rate < 0.75):
        areaUsageScore = 3;
        break;
      case (data.area_usage_rate < 0.8):
        areaUsageScore = 4;
        break;
      case (data.area_usage_rate < 0.85):
        areaUsageScore = 5;
        break;
      case (data.area_usage_rate >= 0.85):
        areaUsageScore = 6;
        break;
      default:
        areaUsageScore = 0;
    }

    switch (true) {
      case (data.avg_area == null) || (data.est_price == null) || (data.avg_area <= 0) || (data.est_price <= 0):
        avgValueScore = 0;
        break;
      case (data.avg_area * data.est_price < 500 * 10000):
        avgValueScore = 1;
        break;
      case (data.avg_area * data.est_price < 800 * 10000):
        avgValueScore = 2;
        break;
      case (data.avg_area * data.est_price < 1150 * 10000):
        avgValueScore = 3;
        break;
      case (data.avg_area * data.est_price < 1500 * 10000):
        avgValueScore = 4;
        break;
      case (data.avg_area * data.est_price < 2000 * 10000):
        avgValueScore = 5;
        break;
      case (data.avg_area * data.est_price >= 2000 * 10000):
        avgValueScore = 6;
        break;
      default:
        avgValueScore = 0;
    }

    return ([yearBuiltScore, parkingRatioScore, greenRatioScore, floorAreaScore, areaUsageScore, avgValueScore]);
  }

  const calcAvgRadarChartScore = () => {
    const cnt = filteredMapData.length;
    var avg_yearBuiltScore = 0;
    var avg_parkingRatioScore = 0;
    var avg_greenRatioScore = 0;
    var avg_floorAreaScore = 0;
    var avg_areaUsageScore = 0;
    var avg_avgValueScore = 0;
    filteredMapData.map(element => {
      var eachScore = calcRadarChartScore(element);
      avg_yearBuiltScore += eachScore[0] / cnt;
      avg_parkingRatioScore += eachScore[1] / cnt;
      avg_greenRatioScore += eachScore[2] / cnt;
      avg_floorAreaScore += eachScore[3] / cnt;
      avg_areaUsageScore += eachScore[4] / cnt;
      avg_avgValueScore += eachScore[5] / cnt;
    });
    return ([avg_yearBuiltScore, avg_parkingRatioScore, avg_greenRatioScore, avg_floorAreaScore, avg_areaUsageScore, avg_avgValueScore]);
  }

  const calcBarChartData = (data) => {
    var res = {
      labels: [],
      datasets: [
        {
          // color: ["primary", "secondary", "info", "success", "warning", "error", "light"],
          color: 'success',
          label: '平均面积',
          data: [],
        },
        {
          color: 'warning',
          label: '最小面积',
          data: [],
        },
        {
          color: 'light',
          label: '最大面积',
          data: [],
        }
      ]
    };
    if (data.roominfo3.length > 0) {
      var str_list = data.roominfo3.split('],');
      for (var i = 0; i < str_list.length; i++) {
        //数据样本："[1,5,48.72,34.5,61.08],"
        //意义：房间数，挂牌/成交套数，平均面积，最小面积，最大面积
        var info_list_i = str_list[i].slice(1).split(',');
        res.datasets[0].data.push({
          x: parseFloat(info_list_i[0]),
          y: parseFloat(info_list_i[2])
        });
        res.datasets[1].data.push({
          x: parseFloat(info_list_i[0]),
          y: parseFloat(info_list_i[3])
        });
        res.datasets[2].data.push({
          x: parseFloat(info_list_i[0]),
          y: parseFloat(info_list_i[4])
        });
        res.labels.push(info_list_i[0] + "室");
      };
    };
    return (res);
  }

  const calcDoughnutChart = (data) => {
    var res = {
      labels: [],
      datasets: {
        labels: "挂牌/交易分布",
        backgroundColors: ["primary", "secondary", "info", "success", "warning"],
        data: [],
        borderWidth: 1,
      },
    };
    if (data.roominfo3.length > 0) {
      var total_cnt = 0;
      var str_list = data.roominfo3.split('],');
      for (var i = 0; i < str_list.length; i++) {
        //数据样本："[1,5,48.72,34.5,61.08],"
        //意义：房间数，挂牌/成交套数，平均面积，最小面积，最大面积
        var info_list_i = str_list[i].slice(1).split(',');
        res.datasets.data.push(parseInt(info_list_i[1]));
        total_cnt += parseInt(info_list_i[1]);
        res.labels.push((info_list_i[0]).toString() + "室");
      };
      for (var i = 0; i < str_list.length; i++) {
        res.datasets.data[i] = 100 * (res.datasets.data[i] * 1.0 / total_cnt);
        res.datasets.data[i].toFixed(2);
      }
    };
    return (res);
  }

  const selectCompound = (i) => {
    setCompoundIndexSelected(i);
  }

  const parseRoomSelectedData = (data) => {
    if ((data !== null) && (data.roomSelected !== null)) {
      var res = {
        quantity: 0.0,
        room_list: [],
        price_min: 0,
        price_max: 0,
        budget: totalPrice_max, // 显示预算最大值
        compounds_name: data.name,
      };
      var str_list = data.roomSelected.split('],');
      var total_cnt = 0;
      var price_list = [];
      for (var i = 0; i < str_list.length; i++) {
        //数据样本：[5, 3, 1, 115.0, 9865507.56631818],
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

  const { columns, rows } = compoundsTableData(filteredMapData.length ? filteredMapData[CompoundIndexSelected] : null);
  const { cols_roomSelected, rows_roomSelected } = roomSelectedTableData(filteredMapData.length ? parseRoomSelectedData(filteredMapData[CompoundIndexSelected]) : null);
  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox py={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <MDBox pt={1} px={1} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" fontWeight="medium">
                    {isochroneVisible ? "目的地" : "区域/小区"}
                  </MDTypography>
                  <MDButton
                    onClick={() => setIsochroneVisible(!isochroneVisible)}
                    color="info"
                    variant="outlined"
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    {isochroneVisible ? "切换：按区域" : "切换：按通勤"}
                  </MDButton>
                </MDBox>
                <MDBox p={2}>
                  {isochroneVisible ? (
                    <Grid style={{ margin: "5px" }}>
                      <Autocomplete
                        name="workplace"
                        style={{ marginTop: "15px" }}
                        value={workplace}
                        onChange={(e, v) => setWorkplace(v)}
                        sx={{ height: 50 }}
                        options={WORKPLACES}
                        renderInput={(params) => <TextField {...params} label="工作地（必选）" />}>
                      </Autocomplete>
                      <Autocomplete
                        name="workplace2"
                        style={{ marginTop: "15px" }}
                        value={workplace2}
                        onChange={(e, v) => setWorkplace2(v)}
                        sx={{ height: 50 }}
                        options={WORKPLACES}
                        renderInput={(params) => <TextField {...params} label="队友工作地（可选）" />}>
                      </Autocomplete>
                      <Grid container spacing={0.1}>
                        <Grid item xs={6}>
                          <FormControl style={{ marginTop: "15px" }} variant="outlined">
                            <InputLabel id="demo-simple-select-label">通勤时间</InputLabel>
                            <Select label="单程通勤时间" name="commuteTime" value={commuteTime} onChange={(e) => setCommuteTime(e.target.value)}
                              sx={{ height: 50 }}>
                              <MenuItem value={10}>&#8804; 10分钟</MenuItem>
                              <MenuItem value={20}>&#8804; 20分钟</MenuItem>
                              <MenuItem value={30}>&#8804; 30分钟</MenuItem>
                              <MenuItem value={40}>&#8804; 40分钟</MenuItem>
                              <MenuItem value={50}>&#8804; 50分钟</MenuItem>
                              <MenuItem value={60}>&#8804; 60分钟</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl style={{ marginTop: "15px" }} variant="outlined">
                            <InputLabel id="demo-simple-select-label">通勤方式</InputLabel>
                            <Select label="通勤方式" name="commuteMethod" value={commuteMethod} onChange={(e) => setCommuteMethod(e.target.value)}
                              sx={{ height: 50 }}>
                              <MenuItem value={"walking_subway"}>地铁+步行</MenuItem>
                              <MenuItem value={"driving"}>驾车</MenuItem>
                              <MenuItem value={"subway_or_driving"}>地铁或驾车</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid style={{ margin: "5px" }}>
                      <TwoLevelSelect
                        setDistrict={setDistrict}
                        setBizcircle={setBizcircle} />
                      <MDInput
                        name="compound"
                        style={{ marginTop: "15px" }}
                        type="text"
                        label="小区（可选）"
                        mb={1.5}
                        value={compound}
                        onChange={(e) => setCompound(e.target.value)}
                      />
                    </Grid>
                  )}
                </MDBox>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <MDBox pt={1} px={1} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" fontWeight="medium">
                    预算
                  </MDTypography>
                </MDBox>
                <MDBox p={2}>
                  <Grid style={{ margin: "5px" }}>
                    <MDInput
                      name="totalPrice_min"
                      style={{ marginTop: "15px" }}
                      type="number"
                      label="最低预算（万）"
                      mb={1.5}
                      value={totalPrice_min}
                      onChange={(e) => setTotalPrice_min(e.target.value)}
                    />
                    <MDInput
                      name="totalPrice_max"
                      style={{ marginTop: "15px" }}
                      type="number"
                      label="最高预算（万）"
                      mb={1.5}
                      value={totalPrice_max}
                      onChange={(e) => setTotalPrice_max(e.target.value)}
                    />
                  </Grid>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <MDBox pt={1} px={1} justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" fontWeight="medium">
                    房间数（室）
                  </MDTypography>
                </MDBox>
                <MDBox p={2}>
                  <Stack direction="row" spacing={2} sx={{ width: "100%", maxWidth: "95%", marginTop: "10px" }}>
                    <Stack direction="column">
                      <FormControlLabel control={<Checkbox name="OneRoom" onChange={handleRoomCheckboxChange} value={1} size="small" />} label="1室" labelPlacement="end" />
                      <FormControlLabel control={<Checkbox name="TwoRooms" defaultChecked={true} onChange={handleRoomCheckboxChange} value={2} size="small" />} label="2室" labelPlacement="end" />
                      <FormControlLabel control={<Checkbox name="ThreeRooms" defaultChecked={true} onChange={handleRoomCheckboxChange} value={3} size="small" />} label="3室" labelPlacement="end" />
                    </Stack>
                    <Stack direction="column">
                      <FormControlLabel control={<Checkbox name="FourRooms" onChange={handleRoomCheckboxChange} value={4} size="small" />} label="4室" labelPlacement="end" />
                      <FormControlLabel control={<Checkbox name="FiveRooms" onChange={handleRoomCheckboxChange} value={5} size="small" />} label="&#8805;5室" labelPlacement="end" />
                    </Stack>
                  </Stack>
                </MDBox>
              </Card>
            </Grid>
            {/* <Grid item xs={12} md={6} lg={2}>
                <MDInput
                  name="area"
                  type="number"
                  label="面积（平米）"
                  mb={1.5}
                  value={area}
                  onChange={handleInputChange}
                />
              </Grid> */}
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <MDBox pt={1} px={1} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" fontWeight="medium">
                    其他条件
                  </MDTypography>
                </MDBox>
                <MDBox p={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl style={{ marginTop: "15px" }} variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-label">房龄</InputLabel>
                        <Select
                          label="房龄"
                          name="sinceBuilt"
                          value={sinceBuilt}
                          onChange={(e) => setSinceBuilt(e.target.value)}
                          sx={{
                            height: 50,
                          }}>
                          <MenuItem value={2015}>&#8805; 2015年</MenuItem>
                          <MenuItem value={2010}>&#8805; 2010年</MenuItem>
                          <MenuItem value={2005}>&#8805; 2005年</MenuItem>
                          <MenuItem value={2000}>&#8805; 2000年</MenuItem>
                          <MenuItem value={1990}>&#8805; 1990年</MenuItem>
                          <MenuItem value={0}>不限</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="simple-select-label">成交量</InputLabel>
                        <Select
                          label="成交量"
                          name="liquidityFilter"
                          value={liquidityFilter}
                          onChange={(e) => handleLiquidityFilterChange(e)}
                          sx={{
                            height: 50,
                          }}
                        >
                          <MenuItem value={0}>&#8805; 不限</MenuItem>
                          <MenuItem value={1}>&#8805; 1套/年</MenuItem>
                          <MenuItem value={5}>&#8805; 5套/年</MenuItem>
                          <MenuItem value={10}>&#8805; 10套/年</MenuItem>
                          <MenuItem value={20}>&#8805; 20套/年</MenuItem>
                          <MenuItem value={50}>&#8805; 50套/年</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
              <MDButton
                id="submitBtn"
                fullWidth
                disabled={isFetching}
                style={{ marginTop: "15px" }}
                type="submit"
                variant="contained"
                color="info">
                {isFetching ? "请稍候..." : "搜索小区"}
              </MDButton>
              <Popper
                id={showExpiredPopup ? "memberExpiredPopper" : undefined}
                open={showExpiredPopup}
                anchorEl={anchor}
              >
                <Card style={{ padding: "15px" }}>
                  <MDTypography variant="h6" fontWeight="medium" style={{ color: "red" }}>您的会员已经过期</MDTypography>
                  <Link to="/payment">
                    <MDButton fullWidth color="info" variant="outlined" style={{ marginTop: "15px" }}>点击充值</MDButton>
                  </Link>
                </Card>
              </Popper>
            </Grid>
            {/* <FormRow /> */}
          </Grid>
        </form>

        {/* Output section */}
        {/* {mapData.length > 0 ? ( */}
          <MDBox>
            <Grid container direction="row" alignItems="center" width="66.666667%" margin="0 auto 0 0" spacing={2}>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox name="bizcircleVisible" checked={bizcircleVisible} onChange={() => setBizcircleVisible(!bizcircleVisible)} color="primary" />}
                  label="显示板块"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox name="subwayVisible" checked={subwayVisible} onChange={() => setSubwayVisible(!subwayVisible)} />}
                  label="显示地铁线"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox name="highwayVisible" checked={highwayVisible} onChange={() => setHighwayVisible(!highwayVisible)} />}
                  label="显示环线"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox name="compoundNameVisible" checked={compoundNameVisible} onChange={() => setCompoundNameVisible(!compoundNameVisible)} />}
                  label="显示小区名"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Checkbox name="satelliteVisible" checked={satelliteVisible} onChange={() => setSatelliteVisible(!satelliteVisible)} />}
                  label="显示卫星图"
                />
              </Grid>
            </Grid>
            <MDBox mt={1.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={8}>
                  <Projects
                    mapData={filteredMapData}
                    selectCompound={selectCompound}
                    CompoundIndexSelected={CompoundIndexSelected}
                    borderBizcircle={borderBizcircle}
                    showBizcircle={bizcircleVisible}
                    showSubway={subwayVisible}
                    showHighway={highwayVisible}
                    showCompoundName={compoundNameVisible}
                    showSatellite={satelliteVisible}
                    isochronePolygon={isochronePolygon}
                    isochronePolygon2={isochronePolygon2}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <OrdersOverview
                    mapData={filteredMapData}
                    selectCompound={selectCompound}
                    CompoundIndexSelected={CompoundIndexSelected}
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mt={4.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <DataTable //Changed default entries per page to 15
                      table={{ columns: cols_roomSelected, rows: rows_roomSelected }}
                      // table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                  <MDBox style={{ marginTop: "15px" }}>
                    <RadarChart
                      // icon = {{ color: "info", component: "leaderboard" }}
                      title={filteredMapData.length > 0 ? "品质得分：" + filteredMapData[CompoundIndexSelected].name : "基本信息"}
                      chart={{
                        labels: ["房龄", "车位比", "绿化率", "容积率", "得房率", "平均房价"],
                        datasets: filteredMapData.length > 0 ? [
                          {
                            label: filteredMapData[CompoundIndexSelected].name,
                            color: "primary",
                            data: calcRadarChartScore(filteredMapData[CompoundIndexSelected]),
                          },
                          {
                            label: "所选房源平均",
                            color: "rgba(54, 162, 235, 0.2)",
                            data: avg_radarChartScore,
                          }
                        ] : [],
                      }}
                      plugins={[ChartDataLabels]}
                      options={{
                        scale: {
                          r: {
                            beginAtZero: true,
                            max: 6,
                            min: 0,
                            stepSize: 1,
                          }
                        },
                        plugins: {
                          legend: {
                            display: false,
                          },
                          datalabels: {
                            backgroundColor: function (context) {
                              return context.dataset.borderColor;
                            },
                            color: 'white',
                            font: {
                              weight: 'bold'
                            },
                            formatter: Math.round,
                            padding: 8
                          }
                        }
                      }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <MixedChart
                      icon={{ color: "info", component: "leaderboard" }}
                      title="户型面积"
                      chart={filteredMapData.length > 0 ?
                        calcBarChartData(filteredMapData[CompoundIndexSelected])
                        : {}}
                      plugins={[ChartDataLabels]}
                      options={{
                        plugins: {
                          datalabels: {
                            align: 'end',
                            anchor: 'end',
                            formatter: (val) => {
                              return val.y.toFixed(1);
                            }
                          },
                        }
                      }}
                    />
                  </MDBox>
                  <MDBox style={{ marginTop: "15px" }}>
                    <DefaultDoughnutChart
                      icon={{ color: "info", component: "leaderboard" }}
                      title="户型分布"
                      chart={filteredMapData.length > 0 ?
                        calcDoughnutChart(filteredMapData[CompoundIndexSelected])
                        : {}}
                      height="15.125rem"
                      plugins={[ChartDataLabels]}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        {/* ) : null} */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
