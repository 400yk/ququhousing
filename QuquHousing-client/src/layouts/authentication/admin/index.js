import MDButton from "components/MDButton";
import Users from "../users/Users";
import MDBox from "components/MDBox";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

const Admin = () => {
    const handlePaymentSuccess = () => {
        try {
          const response = axiosPrivate.post('/renewal', {
            "renewMonths": 6, //三种会员收费，1个月、6个月，12个月
          });
          console.log("充值成功");
        } catch (err) {
          console.log(err);
          console.log("充值失败");
        }
      }


    return (
        <DashboardLayout>
            <MDButton onClick={handlePaymentSuccess}>充值按钮</MDButton>
            {/* <DashboardNavbar /> */}
            <MDBox py={3}>
                <h1>管理者页面</h1>
                <Grid container spacing={3}>
                    <Users />
                </Grid>
                <MDBox mt={1.5}>
                    <Link to="/dashboard">
                        <MDButton variant="gradient" color="info">回到首页</MDButton>
                    </Link>
                </MDBox>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Admin;