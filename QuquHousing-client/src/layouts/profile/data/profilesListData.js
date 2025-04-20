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

// Images
import kal from "assets/images/kal-visuals-square.jpg";
import marie from "assets/images/marie.jpg";
import ivana from "assets/images/ivana-square.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import assistPhoto from "assets/images/QRContact/assistant.png";
import ququgePhoto from "assets/images/QRContact/QuquGe.jpg";

export default [
  {
    image: kal,
    name: "蛐蛐哥",
    description: "蛐蛐找房创始人",
    action: {
      type: "internal",
      QRcontact: ququgePhoto,
      color: "info",
      label: "联系",
    },
  },
  {
    image: marie,
    name: "助理美女",
    description: "账号、线下活动报名",
    action: {
      type: "internal",
      QRcontact: assistPhoto,
      color: "info",
      label: "联系",
    },
  },
];
