/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { TextField } from "@mui/material";
import { useMaterialUIController, setDarkMode } from "context";
import { setWhiteSidenav } from "context";
import MDButton from "components/MDButton";

function PlatformSettings({ demandDescription, setDemandDescription, updateServerDemandDescription }) {
  const [controller, dispatch] = useMaterialUIController();
  const [isLightMode, setIsLightMode] = useState(true);
  const [isLightSideNav, setIsLightSideNav] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // useEffect(() => { //从用户前端读取偏好设置
  //   const isLightMode_tmp = localStorage.getItem('isLightMode');
  //   if (isLightMode_tmp) setIsLightMode(isLightMode_tmp);

  //   const isLightSideNav_tmp = localStorage.getItem('isLightSideNav');
  //   if (isLightSideNav_tmp) setIsLightSideNav(isLightSideNav_tmp);
  // },[]);

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          偏好
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDBox display="flex" flexDirection="column">
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            我的购房需求
          </MDTypography>
          <TextField
            id="outlined-multiline-static"
            value={demandDescription}
            onChange={(e) => setDemandDescription(e.target.value)}
            onFocus={() => setShowSaveButton(true)}
            onBlur={() => {
              setShowSaveButton(false);
              updateServerDemandDescription();
            }}
            hiddenLabel
            multiline
            rows={3}
            placeholder="例：预算500万，工作在徐家汇和前滩，最好在徐汇以及浦东两个区，需要2000年后的两房"
            variant="filled"
            InputProps={{
              style: { fontSize: '14px' },
            }}
            fullWidth
          />
          {showSaveButton && (
            <MDBox display="flex" justifyContent="flex-end">
              <MDButton variant="text" color="info" size="small"
                onClick={() => updateServerDemandDescription()}>
                保存/更新
              </MDButton>
            </MDBox>
          )}
        </MDBox>
        <MDBox mt={2}>
          <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
            页面偏好
          </MDTypography>
          <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
            <MDBox mt={0.5}>
              <Switch checked={isLightMode} onChange={() => {
                setDarkMode(dispatch, isLightMode);
                setIsLightMode(!isLightMode);
                // localStorage.setItem('isLightMode', isLightMode);
              }} />
            </MDBox>
            <MDBox width="80%" ml={0.5}>
              <MDTypography variant="button" fontWeight="regular" color="text">
                浅色背景色
              </MDTypography>
            </MDBox>
          </MDBox>
          <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
            <MDBox mt={0.5}>
              <Switch checked={isLightSideNav} onChange={() => {
                setWhiteSidenav(dispatch, !isLightSideNav);
                setIsLightSideNav(!isLightSideNav);
                // localStorage.setItem('isLightSideNav', isLightSideNav);
              }} />
            </MDBox>
            <MDBox width="80%" ml={0.5}>
              <MDTypography variant="button" fontWeight="regular" color="text">
                浅色导航栏
              </MDTypography>
            </MDBox>
          </MDBox>

        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
