
// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

import React from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default class CompoundsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortRef: "price_chg_asc"
    };
  }

  render() {
    const { title, profiles, shadow, selectCompound, CompoundIndexSelected } = this.props;
    const selectedColorCode = '#C6D8FB';
    const sortMethods = {
      price_chg_desc: { method: (a, b) => (a.val.price_chg > b.val.price_chg? -1:1)},
      price_chg_asc: { method: (a, b) => (a.val.price_chg < b.val.price_chg? -1:1)},
      est_price_desc: { method: (a, b) => (a.val.est_price > b.val.est_price? -1:1)},
      est_price_asc: { method: (a, b) => (a.val.est_price < b.val.est_price? -1:1)},
      year_built: { method: (a, b) => (a.val.year_built > b.val.year_built? -1:1)},
    };

    const indices = profiles.map((e, i) => {return {ind: i, val: e}}); //保留sort之前的顺序在indices
    indices.sort(sortMethods[this.state.sortRef].method);
    const renderProfiles = indices.map((each, index) => (
      <MDBox key={each.val.name} id={each.ind} component="li" display="flex" alignItems="center" py={1} mb={1}
        sx={{
          backgroundColor: CompoundIndexSelected === each.ind? selectedColorCode: '#fff',
          '&:hover': {
            backgroundColor: selectedColorCode,
          },
        }}
        onClick = {() => selectCompound(each.ind)} 
        >
        <MDBox mr={2}>
          <MDAvatar src={each.val.image} alt="something here" shadow="md" />
        </MDBox>
        <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
          <MDTypography variant="button" fontWeight="medium">
            {each.val.name}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {each.val.description}
          </MDTypography>
        </MDBox>
        <MDBox ml="auto">
          {each.val.action.type === "internal" ? (
            <MDButton component={Link} to={each.val.action.route} variant="text" color="info">
              {each.val.action.label}
            </MDButton>
          ) : (
            <MDButton
              component="a"
              href={each.val.action.route}
              target="_blank"
              rel="noreferrer"
              variant="text"
              color={each.val.action.color}
            >
              {each.val.action.label}
            </MDButton>
          )}
        </MDBox>
      </MDBox>
    ));

    const handleChange = (event) => {
      this.setState({
        sortRef: event.target.value
      });
    };

    return (
      <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {title}
          </MDTypography>
          <Select justify-content="flex-end" value={this.state.sortRef} onChange={handleChange}>
            <MenuItem value="price_chg_asc">按照跌幅</MenuItem>
            <MenuItem value="price_chg_desc">按照涨幅</MenuItem>
            <MenuItem value="year_built">按照房龄</MenuItem>
            <MenuItem value="est_price_desc">按照单价从高到低</MenuItem>
            <MenuItem value="est_price_asc">按照单价从低到高</MenuItem>
          </Select>
        </MDBox>
        <MDBox p={2}>
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {renderProfiles}
          </MDBox>
        </MDBox>
      </Card>
    );
  }
}

// Setting default props for the ProfilesList
CompoundsList.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfilesList
CompoundsList.propTypes = {
  title: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  shadow: PropTypes.bool,
};

