// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";


// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Billing page components
import MDButton from "components/MDButton";

import OrderPopup from "./components/Order";

import { useState, useEffect } from "react";
import useAxiosPrivate from "hooks/useAxiosPrivate";


function Payment() {

  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const [memberMonths, setMemberMonths] = useState(0);
  const [needPay, setNeedPay] = useState(0);
  const [expirationDate, setExpirationDate] = useState(null);

  const [memberOfferings, setMemberOfferings] = useState([]);



  useEffect(() => {

    const getMemberOfferings = async () => {
      try {
        const response = await axiosPrivate.get('/order');
        setMemberOfferings(response.data.memberOfferings);
        setExpirationDate(response.data.expirationDate.slice(0, 10));
      } catch (err) {
        console.log(err);
        console.log("获取会员类型失败！");
      }
    }

    getMemberOfferings();

  }, []);

  return (
    <DashboardLayout>
      {/* <DashboardNavbar absolute isMini /> */}
      <MDBox mt={3}>
        <OrderPopup
          open={open}
          setOpen={setOpen}
          needPay={needPay}
          setNeedPay={setNeedPay}
          expirationDate={expirationDate}
          setExpirationDate={setExpirationDate}
        />
        <MDBox mb={3}>
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            会员有效期至：{expirationDate}
          </MDTypography>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={5}>
            {memberOfferings.map((membership) => (
              <Grid item xs={12} md={6} lg={4} key={membership.memberMonths}>
                <Card>
                  <MDBox pt={3} px={2} display="flex" justifyContent="center">
                    <MDTypography variant="h6" fontWeight="medium">
                      {membership.name}
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={1} pb={2} px={2} >
                    <MDTypography
                      variant="h3"
                      display="flex" justifyContent="center"
                      mt={3}>
                      {membership.totalPrice}元/{membership.unit}
                    </MDTypography>
                    <MDTypography
                      display="flex" justifyContent="center"
                      variant="subtitle2"
                      color="info"
                      fontWeight="bold"
                      mt={1} mb={5}>
                      {membership.note}
                    </MDTypography>
                    <MDButton
                      id={membership.id}
                      fullWidth
                      color="info"
                      onClick={() => {
                        setMemberMonths(membership.memberMonths);
                        setNeedPay(membership.totalPrice);
                        setOpen(true);
                      }}>点击购买</MDButton>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Payment;
