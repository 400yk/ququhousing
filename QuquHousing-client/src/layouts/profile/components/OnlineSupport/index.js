
// react-routers components
import { Link } from "react-router-dom";
import { useState } from "react";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";

import { Popper } from "@mui/material";

function OnlineSupportList({ title, profiles, shadow }) {
    const [anchor, setAnchor] = useState(null);
    // const showPopup = !!anchor; //双非运算符，相当于boolean
    const [showPopup, setShowPopup] = useState(
        profiles.map(() => false)
    );
    const [buttonTexts, setButtonTexts] = useState(
        profiles.map(() => "联系")
    );

    const renderProfiles = profiles.map(({ image, name, description, action }, index) => (
        <MDBox key={name} component="li" display="flex" alignItems="center" py={1} mb={1}>
            <MDBox mr={2}>
                <MDAvatar src={image} alt="something here" shadow="md" />
            </MDBox>
            <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
                <MDTypography variant="button" fontWeight="medium">
                    {name}
                </MDTypography>
                <MDTypography variant="caption" color="text">
                    {description}
                </MDTypography>
            </MDBox>
            <MDBox ml="auto">
                <MDBox>
                    <MDButton key={index} id={index}
                        onClick={(e) => {
                            setAnchor(anchor ? null : e.target);
                            const newTexts = buttonTexts.map((text, i) =>
                                i === index ? (text === "联系" ? "关闭" : "联系") : "联系"
                            );
                            setButtonTexts(newTexts);
                            setShowPopup(showPopup.map((k, i) =>
                                i === index ? (k === false ? true : false) : false
                            ));
                        }}
                        variant="text"
                        color="info">
                        {buttonTexts[index]}
                    </MDButton>
                    <Popper
                        open={showPopup[index]}
                        anchorEl={document.getElementById(index)}
                        placement="left-start"
                    >
                        <Card style={{ padding: "15px" }}>
                            <img src={action.QRcontact} />
                        </Card>
                    </Popper>
                </MDBox>
            </MDBox>
        </MDBox>
    ));

    return (
        <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
            <MDBox pt={2} px={2}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    {title}
                </MDTypography>
            </MDBox>
            <MDBox p={2}>
                <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                    {renderProfiles}
                </MDBox>
            </MDBox>
        </Card>
    );
}

// Setting default props for the ProfilesList
OnlineSupportList.defaultProps = {
    shadow: true,
};

// Typechecking props for the ProfilesList
OnlineSupportList.propTypes = {
    title: PropTypes.string.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    shadow: PropTypes.bool,
};

export default OnlineSupportList;
