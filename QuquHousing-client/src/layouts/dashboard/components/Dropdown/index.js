import { MenuItem, Select } from "@mui/material";

const Dropdown = ({ submenus, isSubmenu }) => {
    return (
        <Select
        sx={{
            height: 50,
        }}>
            {submenus.map((submenu, index) => {
                <MenuItem key={index}>{submenu.label}</MenuItem>
            })}
        </Select>
    )
}

export default Dropdown;