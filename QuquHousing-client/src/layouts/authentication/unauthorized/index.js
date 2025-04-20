// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import React from "react";

function Unauthorized() {
  const navigate = useNavigate();
  const goback = () => navigate(-1);

  return (
    <CoverLayout image={bgImage}>
      <Card>
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
                未授权
              </MDTypography>
              <MDTypography display="block" variant="button" color="white" my={1}>
                该页面仅授权账户使用
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
                <MDBox mt={4} mb={1}>
                  <MDButton variant="gradient" onClick={goback} color="info" fullWidth>
                    回到上个页面
                  </MDButton>
                </MDBox>
              </MDBox>
          </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Unauthorized;
