//TODO: 增加密码登录之外的验证码登录

import { useState, useRef, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import axios from "api/axios";
import useAuth from "hooks/useAuth";

// react-router-dom components
import { Link, useNavigate, useLocation } from "react-router-dom";

import { USER_REGEX, PWD_REGEX, PHONE_REGEX, VERICODE_REGEX } from "layouts/utils";

const LOGIN_URL = '/auth';

function Basic() {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [smsLogin, setSmsLogin] = useState(false);
  const [vericode, setVericode] = useState('');
  const [timeCount, setTimeCount] = useState(60);
  const [vericodeClickable, setVericodeClickable] = useState(true);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);

    if (!PWD_REGEX.test(event.target.value)) {
      setPasswordError('密码必须至少6位数长度。');
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!PHONE_REGEX.test(username)) {
      setErrMsg("手机号格式有误！");
      return;
    }

    if (!PWD_REGEX.test(password)) {
      setErrMsg("密码格式有误！");
      return;
    }

    try {
      let response;
      if (smsLogin) {
        if (!VERICODE_REGEX.test(vericode)) {
          setErrMsg("验证码格式有误！");
          return;
        }

        setErrMsg("");
        
        response = await axios.post(LOGIN_URL,
          JSON.stringify({ "user": username, "vericode": vericode }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(LOGIN_URL,
          JSON.stringify({ "user": username, "pwd": password }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
      }
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles; //An array of roles
      setAuth({ username, password, roles, accessToken });
      setUsername('');
      setPassword('');
      setSuccess(true);
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response. ');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing username or password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login failed');
      }
      errRef.current.focus();
    }
  }

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

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <BasicLayout image={bgImage} loginSuccess={success}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            登录
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {/* { success? (
            <MDBox>
              <h1>已经登录成功！</h1>
              <p>
                <a href="/dashboard">回到首页</a>
              </p>
            </MDBox>
          ) : ( */}
          <MDBox>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" style={{ color: "red" }}>{errMsg}</p>
            <MDBox component="form" role="form" onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  type="number"
                  label="用户名（手机号）"
                  ref={userRef}
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                  fullWidth />
              </MDBox>
              {smsLogin ? (
                <MDBox mb={2} display="flex" justifyContent="space-between">
                  <MDInput
                    type="number"
                    label="短信验证码"
                    value={vericode}
                    onChange={(e) => setVericode(e.target.value)}
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
              ) : (
                <MDBox mb={2}>
                  <MDInput
                    type="password"
                    label="密码"
                    onChange={handlePasswordChange}
                    value={password}
                    required
                    error={passwordError}
                    helperText={passwordError}
                    fullWidth />
                </MDBox>
              )}

              <MDBox display="flex" alignItems="center" justifyContent="space-between" ml={-1}>
                <MDBox display="flex" alignItems="center">
                  <Switch id="persist" checked={persist} onChange={togglePersist} />
                  <MDTypography
                    // variant="button"
                    fontWeight="regular"
                    color="text"
                    // onClick={handleSetRememberMe}
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;记住我
                  </MDTypography>
                </MDBox>
                <MDButton
                  variant="outlined"
                  color="info"
                  sx={{ display: 'flex', justifyContent: "flex-end" }}
                  onClick={() => setSmsLogin(!smsLogin)}
                >
                  {smsLogin ? "密码登录" : "短信验证码登录"}
                </MDButton>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" type="submit" color="info" fullWidth>
                  登录
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  还没有账号?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-up"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    注册
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
          {/* )} */}
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
