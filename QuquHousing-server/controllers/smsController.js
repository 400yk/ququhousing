// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const $Dysmsapi20170525 = require('@alicloud/dysmsapi20170525');
const $OpenApi = require('@alicloud/openapi-client');
const $Util = require('@alicloud/tea-util');
const _ = require('lodash');
const { SIGN_TEMPLATE, SMS_METHOD, SHENZHI_SMS_APPCODE } = require('../config/smsAlibaba');

var phone_code_list = {};

class Client {
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(accessKeyId, accessKeySecret) {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
        config.endpoint = `dysmsapi.aliyuncs.com`;
        return new $Dysmsapi20170525.default(config);
    }
    static async main(phone, code) {
        // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
        // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例使用环境变量获取 AccessKey 的方式进行调用，仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
        let client = Client.createClient(process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'], process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET']);
        let sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
            phoneNumbers: phone,
            signName: SIGN_TEMPLATE["signName"],
            templateCode: SIGN_TEMPLATE["templateCode"],
            templateParam: "{\"code\":\"" + code + "\"}",
        });
        try {
            // 复制代码运行请自行打印 API 的返回值
            const response = await client.sendSmsWithOptions(sendSmsRequest, new $Util.RuntimeOptions({}));
            console.log(response);
            return response.statusCode;
        }
        catch (error) {
            // 错误 message
            console.log(error.message);
            // 诊断地址
            // console.log(error.data["Recommend"]);
            $Util.default.assertAsString(error.message);
            return 404;
        }
    }
}

const requestSMS = async (req, res) => {
    // Method: 用哪一家的方法。aliyun，shenzhi等
    const phone = req.body.phone;
    var code = "" + _.random(9) + _.random(9) + _.random(9) + _.random(9);
    let statusCode;
    SMS_METHOD === "aliyun" ? 
        statusCode = await Client.main(phone, code):
        statusCode = await shenZhiSms(phone, code);

    if (statusCode === 200) { // 短信发送成功
        if (phone_code_list[phone]) {
            phone_code_list[phone].push(code);
        } else {
            phone_code_list[phone] = [code];
        }
        // 五分钟后删除验证码
        setTimeout(() => {
            _.pull(phone_code_list[phone], code);
            if (phone_code_list[phone] && phone_code_list[phone].length == 0) {
                delete phone_code_list[phone];
            }
        }, 5 * 60 * 1000)
    }
    res.sendStatus(statusCode);
}

const verifyCode = (phone, code) => {
    try {
        return (phone_code_list[phone].indexOf(code) > -1);
    } catch (err) {
        console.log(err);
        return false;
    }
}

const verifyPhone = (req, res) => {
    const phone = req.body.phone;
    const code = req.body.code;
    const result = verifyCode(phone, code);
    result ? res.sendStatus(200) : res.sendStatus(403);
}


const shenZhiSms = async (phone, code) => {
  const host = 'https://dfsns.market.alicloudapi.com';
  const path = '/data/send_sms';
  const method = 'POST';
  const appcode = SHENZHI_SMS_APPCODE;
  const headers = {
    'Authorization': `APPCODE ${appcode}`,
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  };

  const bodys = {
    'content': 'code:'+code,
    'template_id': 'CST_ptdie100',
    'phone_number': phone
  };

  try {
    const response = await fetch(`${host}${path}`, {
      method: method,
      headers: headers,
      body: new URLSearchParams(bodys)
    });

    const data = await response.text();
    console.log(data);
    return response.status;
  } catch (error) {
    console.error(error);
    return 500;
  }
}



module.exports = { requestSMS, verifyCode, verifyPhone };
