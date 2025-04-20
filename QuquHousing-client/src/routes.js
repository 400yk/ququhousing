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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Bizcircle from "layouts/bizcircle";
import Analysis from "layouts/pnlanalysis";
import Billing from "layouts/billing";
// import RTL from "layouts/rtl";
import Traffic from "layouts/traffic";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Unauthorized from "layouts/authentication/unauthorized";
import Admin from "layouts/authentication/admin";
import Payment from "layouts/payment";

// @mui icons
import Icon from "@mui/material/Icon";

const public_routes = [
  {
    type: "collapse",
    name: "登录",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "注册",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "未授权",
    key: "unauthorized",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/unauthorized",
    component: <Unauthorized />,
  },
];

const private_routes = [
  {
    type: "collapse",
    name: "板块分析",
    key: "bizcircle",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/bizcircle",
    component: <Bizcircle/>
  },
  {
    type: "collapse",
    name: "涨跌幅分析",
    key: "analysis",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/analysis",
    component: <Analysis />,
  },
  {
    type: "collapse",
    name: "通勤分析",
    key: "traffic",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/traffic",
    component: <Traffic />,
  },
];

const admin_routes = [
  {
    type: "collapse",
    name: "管理者页面",
    key: "admin",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/admin",
    component: <Admin />,
  },
];

const user_routes = [
  {
    type: "collapse",
    name: "大数据选房",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  // {
  //   type: "collapse",
  //   name: "账户余额",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  {
    type: "collapse",
    name: "账户充值",
    key: "payment",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/payment",
    component: <Payment />,
  },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  {
    type: "collapse",
    name: "个人信息",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
];

export {user_routes, private_routes, public_routes, admin_routes};
