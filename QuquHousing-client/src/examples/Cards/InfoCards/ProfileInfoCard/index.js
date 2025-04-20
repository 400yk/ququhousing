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

// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { TextField } from "@mui/material";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useState } from "react";

import { USER_REGEX, PWD_REGEX, PHONE_REGEX, VERICODE_REGEX } from "layouts/utils";

function ProfileInfoCard({ title, description, info, action, shadow, nickname, setNickname, updateServerNickName, password, setPassword, updateServerPassword }) {
  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;

  const [editNickname, setEditNickName] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);

    if (!PWD_REGEX.test(event.target.value)) {
      setPasswordError('密码必须至少6位数长度。');
    } else {
      setPasswordError(null);
    }
  };

  const handlePasswordSubmit = (e) => {
    if (!PWD_REGEX.test(password)) {
      setPasswordError('密码必须至少6位数长度。');
    } else {
      setPasswordError(null);
      
      updateServerPassword();
      setEditPassword(!editPassword);
    }
  }

  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(info).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);

      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });

  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = labels.map((label, key) => (
    <MDBox key={label} display="flex" justifyContent="space-between" py={1} pr={2}>
      <MDBox>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          {label}: &nbsp;
        </MDTypography>

        {/* <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{values[key]}
        </MDTypography> */}
      </MDBox>
      <MDTypography component={Link} to={action.route} variant="body2" color="secondary" sx={{ display: 'flex', justifyContent: "flex-end" }}>
        <Tooltip title={action.tooltip} placement="top">
          <Icon>edit</Icon>
        </Tooltip>
      </MDTypography>
    </MDBox>
  ));

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox>
        <MDBox lineHeight={1.25}>
          <MDBox key={labels[0]} display="flex" justifyContent="space-between" py={1} pr={2}>
            <MDBox>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {labels[0]}: &nbsp;
              </MDTypography>
              {editNickname ? (
                <MDInput
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  variant="standard"
                  defaultValue={values[0]} />
              ) : (
                <MDTypography variant="button" fontWeight="regular" color="text">
                  &nbsp;{values[0]}
                </MDTypography>
              )}
            </MDBox>
            {editNickname ? (
              <MDBox onClick={() => {
                updateServerNickName();
                setEditNickName(!editNickname);
              }}>
                <MDTypography variant="button" fontWeight="light" color="blue">
                  确认
                </MDTypography>
              </MDBox>
            ) : (
              <MDBox onClick={() => setEditNickName(!editNickname)} variant="body2" color="secondary" sx={{ display: 'flex', justifyContent: "flex-end" }}>
                <Tooltip title={action.tooltip} placement="top">
                  <Icon>edit</Icon>
                </Tooltip>
              </MDBox>
            )}
          </MDBox>
          <MDBox key={labels[1]} display="flex" justifyContent="space-between" py={1} pr={2}>
            <MDBox>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {labels[1]}: &nbsp;
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{values[1]}
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox key={labels[2]} display="flex" justifyContent="space-between" py={1} pr={2}>
            <MDBox>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {labels[2]}: &nbsp;
              </MDTypography>
              {editPassword ? (
                <MDInput
                  value={password}
                  onChange={handlePasswordChange}
                  variant="standard"
                  type="password"
                  error={passwordError}
                  helperText={passwordError}
                />
              ) : (
                <MDTypography variant="button" fontWeight="regular" color="text">
                  &nbsp;{values[2]}
                </MDTypography>
              )}
            </MDBox>
            {editPassword ? (
              <MDBox onClick={handlePasswordSubmit}>
                <MDTypography variant="button" fontWeight="light" color="blue">
                  确认
                </MDTypography>
              </MDBox>
            ) : (
              <MDBox onClick={() => setEditPassword(!editPassword)} variant="body2" color="secondary" sx={{ display: 'flex', justifyContent: "flex-end" }}>
                <Tooltip title={action.tooltip} placement="top">
                  <Icon>edit</Icon>
                </Tooltip>
              </MDBox>
            )}
          </MDBox>

          <MDBox key={labels[3]} display="flex" justifyContent="space-between" py={1} pr={2}>
            <MDBox>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {labels[3]}: &nbsp;
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{values[3]}
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox key={labels[4]} display="flex" justifyContent="space-between" py={1} pr={2}>
            <MDBox>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {labels[4]}: &nbsp;
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{values[4]}
              </MDTypography>
            </MDBox>
            <MDTypography component={Link} to={action.route} variant="body2" color="secondary" sx={{ display: 'flex', justifyContent: "flex-end" }}>
              <Link to="/payment">
                <MDTypography variant="button" fontWeight="light" color="blue">
                  点此充值
                </MDTypography>
              </Link>
            </MDTypography>
          </MDBox>

        </MDBox>
      </MDBox>

    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
};

export default ProfileInfoCard;
