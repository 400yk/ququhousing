var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/Server_db.db');
const sql_res_limit = 5000; //每次query返回数量最大值
const sql_res_limit_district = 5000; 
const this_year = 2023;

class Bizcircle {
    static get_roommodel(bizcircle, district, cb) {
        var param_str = "?";
        var sql_args = [];
        sql_args.push(this_year);
        if (district.length > 0) { //如果有区域输入选项，优先显示区域
            if (district.includes('，')) {
                const district_list = district.split('，');
                sql_args.push(district_list[0]);
                for (var i = 1; i < district_list.length; i++) {
                    param_str += ", ?";
                    sql_args.push(district_list[i]);
                }
            } else {
                sql_args.push(district);
            };

            sql_args.push(sql_res_limit_district);

            //预估年成交套数的核心逻辑：交易数量乘以5，除以建成年代减5年（不满五交易很少的情况）
            db.all('SELECT *, round(count(*) * 5.0 / MAX(1, ? - year_built - 5), 2) as liquidity, avg(price) as avg_price FROM ( \
                    SELECT name, lianjia_id, (area * est_price) as price, year_built FROM compounds_roommodel \
                    WHERE district IN (' + param_str + ')  AND est_price > 0 \
                ) \
                GROUP by lianjia_id \
                ORDER by name \
            LIMIT ?', sql_args, cb);
        } else {
            if (bizcircle.includes('，')) {
                const biz_list = bizcircle.split('，');
                sql_args.push(biz_list[0]);
                for (var i = 1; i < biz_list.length; i++) {
                    param_str += ", ?";
                    sql_args.push(biz_list[i]);
                }
            } else {
                sql_args.push(bizcircle);
            };
            
            sql_args.push(sql_res_limit);

            //预估年成交套数的核心逻辑：交易数量乘以5，除以建成年代减5年（不满五交易很少的情况）
            db.all('SELECT *, round(count(*) * 5.0 / MAX(1, ? - year_built - 5), 2) as liquidity, avg(price) as avg_price FROM ( \
                    SELECT name, lianjia_id, (area * est_price) as price, year_built FROM compounds_roommodel \
                    WHERE bizcircle IN (' + param_str + ') AND est_price > 0 \
                ) \
                GROUP by lianjia_id \
                ORDER by name \
            LIMIT ?', sql_args, cb);
        };
    }

    static get_compounds_roominfo(id_list, cb) { //每次点击小区名称时候返回by房间数的信息
        var param_str = "?";
        for (var i = 1; i < id_list.length; i++) {
            param_str += ", ?";
        };
        db.all('SELECT lianjia_id, name, year_built, num_units, est_price, parking_ratio, floor_area_ratio, \
            green_coverage_ratio, car_separation, building_type, property_type, property_fee, property_manager, elevator_rate, area_usage_rate, \
            exterior_material, roominfo3, avg_area, boundary, lattitude, longitude FROM compounds_info \
            WHERE lianjia_id IN (' + param_str + ')', id_list, cb);
    }
}

const analyzeBircircle = (req, res, next) => {
    // bizcircle = JSON.parse(req.body.body).bizcircle;
    // district = JSON.parse(req.body.body).district;
    if ((req.body.bizcircle) || (req.body.district)) {
        //目前还没有用到area这个参数
        Bizcircle.get_roommodel(req.body.bizcircle, req.body.district, (err, data_room) => {
            if (err) return next(err);
            var id_set = new Set();
            data_room.forEach(element => {
                id_set.add(element['lianjia_id']);
            });
            const id_list = Array.from(id_set);
            Bizcircle.get_compounds_roominfo(id_list, (err, data) => {
                if (err) return next(err);
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; i < data_room.length; j++) {
                        if (data[i].lianjia_id === data_room[j].lianjia_id) {
                            data[i].roomSelected = data_room[j].roomSelected;
                            data[i].liquidity = data_room[j].liquidity;
                            break;
                        };
                    };
                };
                res.json(data);
            });
        });
    }
}

module.exports = { analyzeBircircle }