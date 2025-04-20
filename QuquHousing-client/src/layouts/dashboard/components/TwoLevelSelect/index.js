import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, MenuList, Paper, Popper, Button } from '@mui/material';
import Checkbox from "@mui/material/Checkbox";
import { Card } from '@mui/material';
import { Menu } from '@mui/material';
import { DISTRICT_BIZCIRCLE } from "layouts/utils";
import MDInput from 'components/MDInput';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const TwoLevelSelect = ({ setDistrict, setBizcircle }) => {

  const [anchor, setAnchor] = useState([]);
  const [mainAnchorEl, setMainAnchorEl] = useState(null);

  const [isAllBizInDis, setIsAllBizInDis] = useState(
    DISTRICT_BIZCIRCLE.map(() => false)
  );
  const [selectedDis, setSelectedDis] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState([]);
  const [openSecondLevel, setOpenSecondLevel] = useState(
    DISTRICT_BIZCIRCLE.map(() => false)
  );

  useEffect(() => {
    // change list to stirng with ‘，’ as separation
    if (selectedBiz.length > 0) {
      // 在板块名称列表里面排除区的名称
      const filtered_Biz = selectedBiz.filter((biz) => biz.slice(0,2) !== "全部");
      if (filtered_Biz?.length > 0) {
        const biz_str = filtered_Biz.join('，');
        setBizcircle(biz_str);
      } else {
        setBizcircle("");
      }
    } else {
      setBizcircle("");
    }
  }, [selectedBiz]);

  useEffect(() => {
    if (selectedDis.length > 0) {
      const dis_str = selectedDis.join('，');
      setDistrict(dis_str);
    } else {
      setDistrict("");
    }
  }, [selectedDis]);

  return (
    <FormControl style={{ marginTop: "15px" }} variant="outlined" fullWidth>
      <MDInput
        id="select-label"
        label="区域/板块"
        multiline
        value={selectedBiz}
        InputProps={{
          endAdornment: (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedDis([]);
                setSelectedBiz([]);
                setIsAllBizInDis(DISTRICT_BIZCIRCLE.map(() => false));
              }}
            >
              <ClearIcon />
            </IconButton>
          ),
        }}
        onClick={(e) => setMainAnchorEl(e.currentTarget)}>
      </MDInput>
      <Menu
        anchorEl={mainAnchorEl}
        placement="buttom-start"
        open={Boolean(mainAnchorEl)}
        keepMounted
        style={{ maxHeight: 'calc(100vh - 15px)', overflowY: 'auto' }}
        onClose={() => {
          // setAnchor([]);
          setMainAnchorEl(null);
          setOpenSecondLevel(openSecondLevel.map(() => false));
        }}
      >
        {DISTRICT_BIZCIRCLE.map((district, index) => (
          <MenuItem
            key={district.label}
            value={district.label}
            onMouseEnter={(e) => {
              setAnchor((prevAnchor) => [
                ...prevAnchor.slice(0, index),
                e.currentTarget,
                ...prevAnchor.slice(index + 1),
              ]);
              setOpenSecondLevel(openSecondLevel.map((k, i) =>
                i === index ? (k === false ? true : false) : false
              ));
            }}
          >{district.label}</MenuItem>
        ))}
      </Menu>

      {/* Second-level menu */}
      {DISTRICT_BIZCIRCLE.map((district, index) => (
        <Popper
          key={index}
          open={openSecondLevel[index]}
          anchorEl={anchor[index] ? anchor[index] : mainAnchorEl}
          style={{ zIndex: 9999 }}
          placement="right-start">
          <Card>
            <MenuList
              autoFocusItem={openSecondLevel[index]}
              id="menu-list-grow"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0px", maxHeight: 'calc(100vh - 96px)', overflowY: 'auto' }}
            >
              {/* Replace the following MenuItem components with your actual second-level options */}
              {district.bizcircles.map((biz, ind) => (
                <MenuItem
                  id={ind}
                  key={biz}
                  style={{ margin: '0px 0px', gridColumn: `span 1` }}
                  disabled={ind !== 0 && isAllBizInDis[index]} //该区的“全部”选中
                  onClick={(e) => {
                    // 根据disabled设置，这里只有两种情况会触发，一个是点击了首项，一个是首项未选中点击了板块项
                    if (ind === 0) { //如果选择的是全区，如 “全部黄浦”
                      const disName = biz.slice(2, 4);

                      if (!isAllBizInDis[index]) { //如果当前是没有选中的状态，从没选中到选中
                        setSelectedDis((prevDis) => [...prevDis, disName]);

                        // 取消该区里面的所有板块的选择，增加“全部黄浦”
                        let newSelectedBiz = selectedBiz.filter((k) =>
                          !district.bizcircles.includes(k)
                        );
                        newSelectedBiz.push(biz);
                        setSelectedBiz(newSelectedBiz);
                      } else { // 从选中到未选中
                        setSelectedBiz(selectedBiz.filter((k) =>
                          !district.bizcircles.includes(k)
                        ));
                        setSelectedDis(selectedDis.filter((k) =>
                          k !== disName
                        ));
                      }

                      setIsAllBizInDis(isAllBizInDis.map((k, j) =>
                        j === index ? !k : k
                      ));

                    } else {
                      setSelectedBiz((prevSelected) => {
                        const selectedIndex = prevSelected.indexOf(biz);
                        if (selectedIndex === -1) {
                          return [...prevSelected, biz];
                        } else {
                          return prevSelected.filter((item) => item !== biz);
                        }
                      });
                    }
                  }}
                >
                  {ind === 0 ? (
                    <Checkbox
                      size='small'
                      style={{ margin: '0px 0px', padding: '0px' }}
                      checked={isAllBizInDis[index]}
                    />
                  ) : (
                    <Checkbox
                      size='small'
                      style={{ margin: '0px 0px', padding: '0px' }}
                      checked={(selectedBiz.includes(biz) || isAllBizInDis[index])}
                    />
                  )}
                  &nbsp; {biz}
                </MenuItem>
              ))}
            </MenuList>
          </Card>
        </Popper>
      ))}
    </FormControl>
  );
};

export default TwoLevelSelect;
