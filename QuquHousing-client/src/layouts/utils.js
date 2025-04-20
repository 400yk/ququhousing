// const DISTRICTS = [
//     { value: "黄浦", label: "黄浦" },
//     { value: "徐汇", label: "徐汇" },
//     { value: "静安", label: "静安" },
//     { value: "长宁", label: "长宁" },
//     { value: "虹口", label: "虹口" },
//     { value: "杨浦", label: "杨浦" },
//     { value: "普陀", label: "普陀" },
//     { value: "浦东", label: "浦东" },
//     { value: "闵行", label: "闵行" },
//     { value: "宝山", label: "宝山" },
//     { value: "嘉定", label: "嘉定" },
//     { value: "青浦", label: "青浦" },
//     { value: "松江", label: "松江" },
//     { value: "奉贤", label: "奉贤" },
//     { value: "金山", label: "金山" },
//     { value: "崇明", label: "崇明" },
//   ];

const DISTRICTS = [
  "黄浦",
  "徐汇",
  "静安",
  "长宁",
  "虹口",
  "杨浦",
  "普陀",
  "浦东",
  "闵行",
  "宝山",
  "嘉定",
  "青浦",
  "松江",
  "奉贤",
  "金山",
  "崇明",
];

const DISTRICT_BIZCIRCLE = [
  {
    id: 1,
    label: "黄浦",
    bizcircles: [
      "全部黄浦",
      "打浦桥",
      "董家渡",
      "淮海中路",
      "黄浦滨江",
      "老西门",
      "南京东路",
      "蓬莱公园",
      "人民广场",
      "世博滨江",
      "五里桥",
      "新天地",
      "豫园",
    ]
  },
  {
    id: 2,
    label: "徐汇",
    bizcircles: [
      "全部徐汇",
      "漕河泾",
      "长桥",
      "衡山路",
      "华东理工",
      "华泾",
      "建国西路",
      "康健",
      "龙华",
      "上海南站",
      "田林",
      "万体馆",
      "斜土路",
      "徐汇滨江",
      "徐家汇",
      "植物园",
    ]
  },
  {
    id: 3,
    label: "静安",
    bizcircles: [
      "全部静安",
      "不夜城",
      "曹家渡",
      "大宁",
      "江宁路",
      "静安寺",
      "南京西路",
      "彭浦",
      "西藏北路",
      "阳城",
      "永和",
      "闸北公园",
    ]
  },
  {
    id: 4,
    label: "长宁",
    bizcircles: [
      "全部长宁",
      "北新泾",
      "古北",
      "虹桥",
      "天山",
      "西郊",
      "仙霞",
      "新华路",
      "镇宁路",
      "中山公园",
    ]
  },
  {
    id: 5,
    label: "虹口",
    bizcircles: [
      "全部虹口",
      "北外滩",
      "江湾镇",
      "凉城",
      "临平路",
      "鲁迅公园",
      "曲阳",
      "四川北路",
    ]
  },
  {
    id: 6,
    label: "杨浦",
    bizcircles: [
      "全部杨浦",
      "鞍山",
      "东外滩",
      "黄兴公园",
      "控江路",
      "五角场",
      "新江湾城",
      "中原",
      "周家嘴路",
    ]
  },
  {
    id: 7,
    label: "普陀",
    bizcircles: [
      "全部普陀",
      "曹杨",
      "甘泉宜川",
      "光新",
      "桃浦",
      "万里",
      "武宁",
      "长风",
      "长寿路",
      "长征",
      "真光",
      "真如",
      "中远两湾城",
    ]
  },
  {
    id: 8,
    label: "浦东",
    bizcircles: [
      "全部浦东",
      "北蔡",
      "碧云",
      "曹路",
      "川沙",
      "大团镇",
      "高行",
      "航头",
      "合庆",
      "花木",
      "惠南",
      "金桥",
      "金杨",
      "康桥",
      "老港镇",
      "联洋",
      "临港新城",
      "陆家嘴",
      "梅园",
      "南码头",
      "泥城镇",
      "前滩",
      "三林",
      "世博",
      "书院镇",
      "唐镇",
      "塘桥",
      "外高桥",
      "万祥镇",
      "潍坊",
      "新场",
      "宣桥",
      "杨东",
      "杨思",
      "洋泾",
      "御桥",
      "源深",
      "张江",
      "周浦",
      "祝桥",
    ]
  },
  {
    id: 9,
    label: "闵行",
    bizcircles: [
      "全部闵行",
      "春申",
      "古美",
      "航华",
      "华漕",
      "金虹桥",
      "金汇",
      "静安新城",
      "老闵行",
      "龙柏",
      "马桥",
      "梅陇",
      "闵浦",
      "浦江",
      "七宝",
      "莘庄",
      "莘庄北广场",
      "莘庄南广场",
      "吴泾",
      "西郊",
      "颛桥",
    ]
  },
  {
    id: 10,
    label: "宝山",
    bizcircles: [
      "全部宝山",
      "大场镇",
      "大华",
      "高境",
      "共富",
      "共康",
      "顾村",
      "罗店",
      "罗泾",
      "上大",
      "淞宝",
      "淞南",
      "通河",
      "杨行",
      "月浦",
      "张庙",
    ]
  },
  {
    id: 11,
    label: "嘉定",
    bizcircles: [
      "全部嘉定",
      "安亭",
      "丰庄",
      "华亭",
      "嘉定老城",
      "嘉定新城",
      "江桥",
      "菊园新区",
      "马陆",
      "南翔",
      "外冈",
      "新成路",
      "徐行",
    ]
  },
  {
    id: 12,
    label: "青浦",
    bizcircles: [
      "全部青浦",
      "白鹤",
      "华新",
      "金泽",
      "练塘",
      "夏阳",
      "香花桥",
      "徐泾",
      "盈浦",
      "赵巷",
      "重固",
      "朱家角",
    ]
  },
  {
    id: 13,
    label: "松江",
    bizcircles: [
      "全部松江",
      "车墩",
      "洞泾",
      "九亭",
      "泖港",
      "佘山",
      "莘闵别墅",
      "石湖荡",
      "泗泾",
      "松江大学城",
      "松江老城",
      "松江新城",
      "小昆山",
      "新浜",
      "新桥",
      "叶榭",
    ]
  },
  {
    id: 14,
    label: "奉贤",
    bizcircles: [
      "全部奉贤",
      "奉城",
      "奉贤金汇",
      "海湾",
      "南桥",
      "青村",
      "四团",
      "西渡",
      "柘林",
      "庄行",
    ]
  },
  {
    id: 15,
    label: "崇明",
    bizcircles: [
      "全部崇明",
      "堡镇",
      "陈家镇",
      "崇明其它",
      "崇明新城",
      "横沙岛",
      "长兴岛",
    ]
  },
  {
    id: 16,
    label: "金山",
    bizcircles:
      [
        "全部金山",
      ]
  },
  {
    id: 17,
    label: "上海周边",
    bizcircles: [
      "全部上海周边",
      "周边上海周边",
      "周边南通",
      "周边启东",
      "周边嘉兴",
      "周边太仓",
      "周边常熟市",
      "周边昆山",
      "周边海门",
      "周边苏州",
    ]
  }
];

const WORKPLACES = [
  "陆家嘴",
  "南京西路",
  "淮海路",
  "张江",
  "新天地",
  "徐家汇",
  "虹桥古北",
  "漕河泾",
  "外滩",
  "人民广场",
  "竹园",
  "金桥",
  "前滩",
  "北外滩",
  "市北",
  "徐汇滨江",
  "虹桥商务区",
  "浦西世博",
  "不夜城",
  "五角场",
  "花木",
  "临空",
  "苏河湾",
  "新民洋",
  "莘庄",
  "大宁",
  "吴中路",
  "长风",
  "真如",
  "东外滩",
  "四川北路",
  "后滩",
  "浦东世博",
  "长寿路",
  "紫竹",
  "临港"
];

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PHONE_REGEX = /^1[3|4|5|6|7|8|9]\d{9}$/;
const VERICODE_REGEX = /^[0-9]{4,4}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;
const PWD_REGEX = /^.{6,24}$/;


const _get_border_input_list = (jsonBorder, region_list) => {
  let biz_list;
  if (region_list.includes('，')) {
    biz_list = region_list.split('，');
  } else {
    biz_list = [region_list];
  }

  var borders = {
    "type": "FeatureCollection",
    "features": [],
  };

  for (var j = 0; j < biz_list.length; j++) { //对于每一个输入的板块
    for (var i = 0; i < jsonBorder.features.length; i++) {
      if (jsonBorder.features[i].properties.name === biz_list[j]) {
        var feature = jsonBorder.features[i];
        feature.geometry.coordinates[0].push(feature.geometry.coordinates[0][0]); //画周边图首尾需要连接，所以最后插入第一个坐标点
        borders.features.push(feature);
        break;
      }
    };
  };
  return (borders);
}


const getBorderBizcircle = (district, bizcircle) => {
  if (district.length > 0 && bizcircle.length > 0) {
    const allDistricts = require("assets/QuquHousing/border_district_amap.json");
    const allBizcircles = require("assets/QuquHousing/border_bizcircle_amap.json");
    var border_district = _get_border_input_list(allDistricts, district);
    const border_bizcircle = _get_border_input_list(allBizcircles, bizcircle);
    border_district.features = border_district.features.concat(border_bizcircle.features);
    return (border_district);
  } else if (district.length > 0) { //如果输入了区域，则优先计算区域边缘坐标
    const allDistricts = require("assets/QuquHousing/border_district_amap.json");
    const border_district = _get_border_input_list(allDistricts, district);
    return (border_district);
  } else { //如果输入多个板块，一起计算多个板块的边缘坐标
    const allBizcircles = require("assets/QuquHousing/border_bizcircle_amap.json");
    const border_bizcircle = _get_border_input_list(allBizcircles, bizcircle);
    return (border_bizcircle);
  }
}

module.exports = { DISTRICTS, DISTRICT_BIZCIRCLE, WORKPLACES, _get_border_input_list, getBorderBizcircle, USER_REGEX, PWD_REGEX, PHONE_REGEX, VERICODE_REGEX }