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

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import React, { useState, useRef, useEffect } from "react";
import axios from "api/axios";

import { USER_REGEX, PWD_REGEX, PHONE_REGEX, VERICODE_REGEX } from "layouts/utils";

const REGISTER_URL = '/register';

function Cover() {
  const userRef = useRef();
  const errRef = useRef();

  const [userFocus, setUserFocus] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const [vericode, setVericode] = useState('');

  const [timeCount, setTimeCount] = useState(60);
  const [vericodeClickable, setVericodeClickable] = useState(true);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);

    if (!PWD_REGEX.test(event.target.value)) {
      setPasswordError('密码必须至少6位数长度。');
    } else {
      setPasswordError(null);
    }
  };

  const handleGetVeriCode = async (e) => {
    // 检查手机号是否符合规定
    if (!PHONE_REGEX.test(username)) {
      setErrMsg("手机号格式错误！");
      return;
    }

    // 设置按钮冻结60秒
    const timeCountDown = 60;
    setErrMsg("");
    let a = timeCountDown;
    setVericodeClickable(false);
    const t1 = setInterval(() => {   //倒计时函数
      a = a - 1;
      setTimeCount(a);
      if (a <= 0) {
        setTimeCount(timeCountDown);
        setVericodeClickable(true);
        clearInterval(t1);
      }
    }, 1000);

    // 获取验证码
    try {
      const response = await axios.post('/sms', {
        phone: username,
        headers: { 'Content-Type': 'application/json' },
      });

      console.log(response.data);
      if (response.status === 200) { //验证码获取成功
        // setErrMsg("验证码获取成功");
      }

    } catch (err) {
      console.log(err);
      setErrMsg("验证码获取失败！");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!PHONE_REGEX.test(username)) {
      setErrMsg("手机号格式有误！");
      return;
    }

    if (!VERICODE_REGEX.test(vericode)) {
      setErrMsg("验证码格式有误！");
      return;
    }

    if (!PWD_REGEX.test(password)) {
      setErrMsg("密码格式有误！");
      return;
    }

    setErrMsg("");

    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({
          "user": username,
          "vericode": vericode, //TODO: later added msg verification
          "pwd": password,
        }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      console.log(response.data);
      console.log(response.accessToken);

      setSuccess(true);
      setUsername('');
      setPassword('');
      setVericode('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('用户名已经存在!');
      } else if (err.response?.data?.message) {
        setErrMsg('注册失败： ' + err.response.data.message);
      } else {
        setErrMsg('注册失败：原因未知');
      }
      errRef.current.focus();
    }
  }

  return (
    <CoverLayout image={bgImage}>
      <Card>
        {success ? (
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDBox>
              <h1>注册成功！</h1>
              <p>
                <a href="/authentication/sign-in">请登录</a>
              </p>
            </MDBox>
          </MDBox>
        ) : (
          <MDBox>
            <MDBox
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="success"
              mx={2}
              mt={-3}
              p={3}
              mb={1}
              textAlign="center"
            >
              <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                注册
              </MDTypography>
              <MDTypography display="block" variant="button" color="white" my={1}>
                请输入手机号、密码及短信验证码
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" style={{ color: "red" }}>{errMsg}</p>
              <MDBox component="form" role="form" onSubmit={handleSubmit}>
                <MDBox mb={2}>
                  <MDInput
                    type="number"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    ref={userRef}
                    autoComplete="off"
                    label="用户名(手机号)"
                    variant="standard"
                    required
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    fullWidth />
                </MDBox>
                <MDBox mb={2} display="flex" justifyContent="space-between">
                  <MDInput
                    type="number"
                    name="vericode"
                    value={vericode}
                    onChange={(e) => setVericode(e.target.value)}
                    label="短信验证码"
                    variant="standard"
                    required
                  />
                  <MDButton
                    sx={{ padding: "10px", display: 'flex', justifyContent: 'flex-end' }}
                    color="info"
                    onClick={handleGetVeriCode}
                    disabled={vericodeClickable ? false : true}>
                    {vericodeClickable ? "获取验证码" : (timeCount + "秒后重发")}
                  </MDButton>
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    label="密码"
                    variant="standard"
                    required
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    error={passwordError}
                    helperText={passwordError}
                    fullWidth
                  />
                </MDBox>
                <MDBox display="flex" alignItems="center" ml={-1}>
                  <Checkbox />
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;我同意&nbsp;
                  </MDTypography>
                  <MDTypography
                    component="a"
                    href="#"
                    variant="button"
                    fontWeight="bold"
                    color="info"
                    textGradient
                  >
                    用户使用协议及隐私政策
                  </MDTypography>
                </MDBox>
                <MDBox mt={4} mb={1}>
                  <MDButton variant="gradient" type="submit" color="info" fullWidth>
                    注册
                  </MDButton>
                </MDBox>
                <MDBox mt={3} mb={1} textAlign="center">
                  <MDTypography variant="button" color="text">
                    已经有账户了?{" "}
                    <MDTypography
                      component={Link}
                      to="/authentication/sign-in"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      登录
                    </MDTypography>
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>
        )}
      </Card>
    </CoverLayout>
  );
}

export default Cover;
