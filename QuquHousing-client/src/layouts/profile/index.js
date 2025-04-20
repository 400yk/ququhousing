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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import OnlineSupportList from "layouts/profile/components/OnlineSupport";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import MDButton from "components/MDButton";

import useAxiosPrivate from "hooks/useAxiosPrivate";
import useAuth from "hooks/useAuth";
import { useState, useEffect } from "react";

import { USER_REGEX, PWD_REGEX, PHONE_REGEX, VERICODE_REGEX } from "layouts/utils";


function Overview() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [rolename, setRolename] = useState("");
  const [demandDescription, setDemandDescription] = useState("");
  const [registeredSince, setRegisteredSince] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.get('/profile');
        console.log(response);
        setNickname(response.data.nickname);
        setRolename(response.data.rolename);
        setPhone(response.data.username);
        setRegisteredSince(response.data.registeredSince);
        setExpirationDate(response.data.memberExpiration);
        setDemandDescription(response.data.demandDescription);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProfile();
  }, []);

  const updateServerNickName = async () => {
    try {
      const response = await axiosPrivate.post('/profile', {
        "nickname": nickname
      })
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  const updateServerDemandDescription = async () => {
    try {
      const response = await axiosPrivate.post('/profile', {
        "demandDescription": demandDescription
      })
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  const updateServerPassword = async () => {
    if (PWD_REGEX.test(password)) {
      try {
        const response = await axiosPrivate.post('/profile', {
          "password": password
        })
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const handleEditProfile = () => {

  }

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox mb={2} />
      <Header nickname={nickname} rolename={rolename}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} xl={4} >
              <ProfileInfoCard
                title="账号信息"
                info={{
                  "昵称": nickname,
                  "手机": phone,
                  "密码": "******",
                  "注册时间": registeredSince.slice(0, 10),
                  "有效期至": expirationDate.slice(0, 10),
                }}
                nickname={nickname}
                setNickname={setNickname}
                updateServerNickName={updateServerNickName}
                password={password}
                setPassword={setPassword}
                updateServerPassword={updateServerPassword}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings
                demandDescription={demandDescription}
                setDemandDescription={setDemandDescription}
                updateServerDemandDescription={updateServerDemandDescription}/>
            </Grid>
            <Grid item xs={12} xl={4}>
              <OnlineSupportList title="蛐蛐服务团队" profiles={profilesListData} shadow={false} />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
