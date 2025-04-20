import React, { useEffect, useState, useRef } from 'react';
import useAxiosPrivate from "hooks/useAxiosPrivate";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import expirePhoto from 'assets/images/QRPay/expire.png';
import warningPhoto from 'assets/images/QRPay/warning.png';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

let timer = null;

const OrderPopup = ({ open, setOpen, needPay, setNeedPay, expirationDate, setExpirationDate }) => {
    const [orderExpireTime, setOrderExpireTime] = useState(120); // 订单过期时间（单位：秒）
    const [orderNum, setOrderNum] = useState('');
    const [QRPayImg, setQRPayImg] = useState(null);
    const [paySuccess, setPaySuccess] = useState(false);
    const [needPayActual, setNeedPayActual] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();

    const axiosPrivate = useAxiosPrivate();

    const formatTime = (num) => {
        return num < 10 ? `0${num}` : `${num}`;
    };

    const generateOrderNum = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = formatTime(currentDate.getMonth() + 1);
        const day = formatTime(currentDate.getDate());
        const hours = formatTime(currentDate.getHours());
        const minutes = formatTime(currentDate.getMinutes());
        const seconds = formatTime(currentDate.getSeconds());

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    useEffect(() => {
        if (needPay > 0) {
            setErrMsg("");
            const checkPay = async (realtimeOrderNum) => {
                const response = await axiosPrivate.get(`/order/checkPay?orderNum=${realtimeOrderNum}&needPay=${needPay}`);

                if (response.status === 200) {
                    // 支付成功
                    const { message, QRPayImage, newExpiration } = response.data;
                    setQRPayImg(QRPayImage);
                    setExpirationDate(newExpiration.slice(0, 10));
                    clearInterval(timer);
                    timer = null;
                    setPaySuccess(true);
                    console.log(message);
                    console.log('停止计时');
                } else {
                    const { message } = response.data;
                    console.log(message);
                }
            };

            const startCountdown = (realtimeOrderNum) => {
                // 设置倒计时120秒
                const timeCountDown = 120;
                let a = timeCountDown;
                timer = setInterval(() => {   //倒计时函数
                    a = a - 1;
                    setOrderExpireTime(a);
                    if (a <= 0) {
                        setQRPayImg(expirePhoto);
                        clearInterval(timer);
                        timer = null;
                        setOrderExpireTime(120);
                    } else if (a % 2 === 0) { //每两秒检查一次是否支付成功
                        checkPay(realtimeOrderNum);
                    }
                }, 1000);
            };

            // 创建订单
            const createOrder = async () => {
                //State updates in React are asynchronous. This means that setOrderNum won't immediately change the value of orderNum within the same code block.
                const realtimeOrderNum = generateOrderNum();
                setOrderNum(realtimeOrderNum);
                const orderPrice = needPay;
                try {
                    const response = await axiosPrivate.post('/order', {
                        "orderNum": realtimeOrderNum,
                        "orderPrice": orderPrice
                    });

                    if (response.status === 200) {
                        const { needPayFromServer } = response.data;
                        const { QRPayImage } = response.data;

                        setNeedPayActual(needPayFromServer);
                        setQRPayImg(QRPayImage);
                        startCountdown(realtimeOrderNum);
                    } else {
                        setQRPayImg(warningPhoto);
                        setErrMsg("订单创建失败！");
                        errRef.current.focus();
                        console.log('Failed to create order');
                    }
                } catch (err) {
                    setQRPayImg(warningPhoto);
                    err?.response?.data?.message ? setErrMsg(err.response.data.message) : setErrMsg("订单创建失败！");
                    errRef.current.focus();
                    console.log(err);
                }
            };

            createOrder();

            return () => {
                clearInterval(timer);
                setErrMsg("");
            };
        } else {
            return () => {
                if (timer) {
                    clearInterval(timer);
                    setOrderExpireTime(0);
                    timer = null;
                    setErrMsg("");
                }
            };
        }
    }, [needPay]);

    useEffect(() => {
        if (!open && timer) {
            clearInterval(timer);
            setOrderExpireTime(0);
            timer = null;
            setNeedPay(0);
            setErrMsg("");
        }
    }, [open])

    return (
        <BootstrapDialog
            fullWidth
            maxWidth="md"
            onClose={() => setOpen(false)}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                蛐蛐找房会员充值
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => setOpen(false)}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    m: 'auto',
                    width: 'fit-content',
                }}
                dividers>

                <MDTypography gutterBottom>
                    支付金额:&nbsp;&nbsp;&nbsp;¥{needPayActual}
                </MDTypography>

                <img src={QRPayImg} id="zsmQrcode" className="zsmQrcode" mt="5px" mb="10px" />
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" style={{ color: "red" }}>{errMsg}</p>
                {paySuccess ? (
                    <MDBox>
                        <MDTypography>恭喜！您的会员已经续期</MDTypography>
                        <MDTypography>当前会员有效期至：{expirationDate}</MDTypography>
                    </MDBox>
                ) : (
                    <MDBox>
                        <MDTypography gutterBottom>
                            请识别上方收款码输入{needPayActual}元
                        </MDTypography>
                        <MDTypography gutterBottom>
                            输入的金额必须要完全一致
                        </MDTypography>
                        <p>
                            倒计时: {formatTime(parseInt(orderExpireTime / 60))}:{formatTime(orderExpireTime % 60)}
                        </p>
                    </MDBox>
                )}
                <p id="orderNum" style={{ display: 'none' }}>{orderNum}</p>
                <p id="needPay" style={{ display: 'none' }}>{needPayActual}</p>
            </DialogContent>
            <DialogActions>
                <MDButton autoFocus onClick={() => {
                    setOpen(false);
                    setPaySuccess(false);
                }}>
                    返回
                </MDButton>
            </DialogActions>
        </BootstrapDialog >
    )
}


export default OrderPopup;