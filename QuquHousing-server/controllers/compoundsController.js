const turf = require('@turf/turf'); //地图应用工具turf.js
// app.use(bodyParser.json());
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/Server_db.db');
const sql_res_limit = 40; //每次query返回数量最大值
const sql_res_limit_district = 1000;
const now = new Date();
const this_year = now.getFullYear();
const MAX_NUM_COMPOUNDS_RETRIEVED = 5000;

const fs = require('fs');
var bizIsochrone = [];
fs.readFile('./database/BizArea_Isochrone_Complete.json', 'utf8', function (err, data) {
    if (err) throw err;
    bizIsochrone = JSON.parse(data);
});

class Compounds {
    static get_boundary(id, cb) {
        db.get('SELECT boundary FROM compounds_boundary WHERE lianjia_id = ?', id, cb);
    }

    static list_compounds_bizcircle(bizcircle, price, numRooms, area, sinceBuilt, cb) {
        // 每个小区有不同的户型（房间数分布），每种户型对应了一个面积，面积又对应了总价格
        const year = 2023 - sinceBuilt;
        if (price > 0 & area > 0) {
            price = price * 10000;
            var compounds = db.all('SELECT name, year_built, num_units, lianjia_id, est_price, boundary FROM compounds_info \
            WHERE bizcircle = ? AND year_built >= ? AND min_price <= ? AND max_price >= ? AND min_area <= ? \
            AND max_area >= ?', [bizcircle, year, price, price, area, area], cb);
        } else if (price > 0) {
            price = price * 10000;
            db.all('SELECT name, year_built, num_units, lianjia_id, est_price, boundary FROM compounds_info \
            WHERE bizcircle = ? AND year_built >= ? AND min_price <= ? AND max_price >= ?', [bizcircle, year, price, price], cb);
        } else if (area > 0) {
            db.all('SELECT name, year_built, num_units, lianjia_id, est_price, boundary FROM compounds_info \
            WHERE bizcircle = ? AND year_built >= ? AND min_area <= ? AND max_area >= ?', [bizcircle, year, area, area], cb);
        } else {
            db.all('SELECT name, year_built, num_units, lianjia_id, est_price, boundary FROM compounds_info \
            WHERE bizcircle = ? AND year_built >= ?', [bizcircle, year], cb);
        };
    }

    static get_compounds(id_list, cb) {
        var param_str = "?";
        for (var i = 1; i < id_list.length; i++) {
            param_str += ", ?"
        };
        db.all('SELECT lianjia_id, name, year_built, est_price, boundary FROM compounds_info \
            WHERE lianjia_id IN (' + param_str + ')', id_list, cb);
    }

    static get_compounds_detailinfo(id_list, cb) { //每次点击小区名称时候返回详细信息（最详细版本）
        var param_str = "?";
        for (var i = 1; i < id_list.length; i++) {
            param_str += ", ?"
        };
        db.all('SELECT lianjia_id, name, year_built, num_units, est_price, parking_ratio, floor_area_ratio, \
            green_coverage_ratio, car_separation, building_type, property_type, property_fee, property_manager, elevator_rate, area_usage_rate, \
            exterior_material, roominfo, avg_area, boundary FROM compounds_info \
            WHERE lianjia_id IN (' + param_str + ')', id_list, cb);
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

    static get_roommodel(compound, bizcircle, district, price_min, price_max, numRooms, sinceBuilt, cb) {
        // 如果房间数有5房，那么也扩充到5房以上的场景(最多到14房)
        if (numRooms.indexOf(5) > -1) {
            for (var j = 6; j < 15; j++) {
                numRooms.push(j);
            };
        };

        price_min = price_min * 10000;
        price_max = price_max * 10000;

        var bedroom_args = numRooms[0].toString();
        for (var i = 1; i < numRooms.length; i++) {
            bedroom_args = bedroom_args + "," + numRooms[i];
        };

        let where_clause;
        if (compound.length > 0) {
            where_clause = "name = '" + compound + "'";
        } else if (district.length > 0 && bizcircle.length > 0) {
            const dis_list = district.replace("，", "\',\'");
            const biz_list = bizcircle.replace("，", "\',\'");
            where_clause = "district IN (\'" + dis_list + "\') OR bizcircle IN (\'" + biz_list + "\')";
        } else if (district.length > 0) {
            const dis_list = district.replace("，", ",");
            where_clause = "district IN (\'" + dis_list + "\')";
        } else if (bizcircle.length > 0) {
            const biz_list = bizcircle.replace("，", ",");
            where_clause = "bizcircle IN (\'" + biz_list + "\')";
        }

        const sql_query = `SELECT lianjia_id, name, round(sum(each_cnt), 2) as liquidity, group_concat(concat) AS roomSelected \
        FROM ( \
            SELECT name, lianjia_id, price, round_area, round(cnt * 5.0 / MAX(1, ${this_year} - year_built -5), 2) as each_cnt,'[' || round(cnt * 5.0 / MAX(1, ${this_year} - year_built -5), 2) || ',' || bedrooms || ',' || bathrooms || ',' || round_area || ',' || price || ']' as concat \
            FROM ( \
                SELECT *, count(*) as cnt FROM ( \
                SELECT name, lianjia_id, year_built, (area * est_price) as price, round(area) as round_area, bedrooms, bathrooms FROM compounds_roommodel \
                WHERE (${where_clause}) AND bedrooms IN (${bedroom_args}) AND price <= ${price_max} AND price >= ${price_min} \
            ) \
            GROUP by lianjia_id, bedrooms, round_area \
            ORDER by name, round_area )\
        ) \
        GROUP by lianjia_id \
        LIMIT ${sql_res_limit_district}`;

        //预估年成交套数的核心逻辑：交易数量乘以5，除以建成年代减5年（不满五交易很少的情况）
        db.all(sql_query, cb);
    }

    // 从数据库读取所有小区的id、名字、以及坐标信息.
    static get_roommodel_with_coord(price_min, price_max, numRooms, sinceBuilt, cb) {
        // 如果房间数有5房，那么也扩充到5房以上的场景(最多到14房)
        if (numRooms.indexOf(5) > -1) {
            for (var j = 6; j < 15; j++) {
                numRooms.push(j);
            };
        };

        var param_str = "?";
        price_min = price_min * 10000;
        price_max = price_max * 10000;

        var sql_args = [this_year, this_year, numRooms[0]];
        for (var i = 1; i < numRooms.length; i++) {
            param_str += ", ?";
            sql_args.push(numRooms[i]);
        };

        sql_args.push(price_max);
        sql_args.push(price_min);
        sql_args.push(sinceBuilt);
        sql_args.push(MAX_NUM_COMPOUNDS_RETRIEVED);

        //预估年成交套数的核心逻辑：交易数量乘以5，除以建成年代减5年（不满五交易很少的情况）
        db.all(" \
        SELECT a.*, b.lattitude, b.longitude FROM \
        (SELECT lianjia_id, name, round(sum(each_cnt), 2) as liquidity, group_concat(concat) AS roomSelected \
        FROM ( \
            SELECT name, lianjia_id, price, round_area, round(cnt * 5.0 / MAX(1, ? - year_built -5), 2) as each_cnt,'[' || round(cnt * 5.0 / MAX(1, ? - year_built -5), 2) || ',' || bedrooms || ',' || bathrooms || ',' || round_area || ',' || price || ']' as concat \
            FROM ( \
                SELECT *, count(*) as cnt FROM ( \
                SELECT name, lianjia_id, year_built, (area * est_price) as price, round(area) as round_area, bedrooms, bathrooms \
                FROM compounds_roommodel \
                WHERE bedrooms IN (" + param_str + ") AND price <= ? AND price >= ? AND year_built >= ? \
            ) \
            GROUP by lianjia_id, bedrooms, round_area )\
        ) \
        GROUP by lianjia_id \
        LIMIT ?) a \
        LEFT JOIN (SELECT lianjia_id, lattitude, longitude FROM compounds_info) b \
        on a.lianjia_id = b.lianjia_id \
        ", sql_args, cb);
    }


    // 根据前端请求的工作地、通勤时间、通勤耗时，筛选数据库里面对应的等时圈
    static filter_isochrone(workplace, workplace2, commuteTime, commuteMethod, cb) {
        if (workplace2) {
            var isochrone = null;
            var isochrone_workplace2 = null;
            for (var i = 0; i < bizIsochrone.length; i++) {
                if (bizIsochrone[i].name === workplace) {
                    var isochrones = bizIsochrone[i].isochrones;
                    for (var j = 0; j < isochrones.length; j++) {
                        if (isochrones[j].contour_time === commuteTime) {
                            isochrone = isochrones[j].method[commuteMethod];
                            break;
                        };
                    }
                    break;
                };
            }
            for (var i = 0; i < bizIsochrone.length; i++) {
                if (bizIsochrone[i].name === workplace2) {
                    var isochrones = bizIsochrone[i].isochrones;
                    for (var j = 0; j < isochrones.length; j++) {
                        if (isochrones[j].contour_time === commuteTime) {
                            isochrone_workplace2 = isochrones[j].method[commuteMethod];
                            break;
                        };
                    }
                    break;
                };
            }
            return cb(null, isochrone, isochrone_workplace2);
        } else {
            for (var i = 0; i < bizIsochrone.length; i++) {
                if (bizIsochrone[i].name === workplace) {
                    var isochrones = bizIsochrone[i].isochrones;
                    for (var j = 0; j < isochrones.length; j++) {
                        if (isochrones[j].contour_time === commuteTime) {
                            var isochrone = isochrones[j].method[commuteMethod];

                            return cb(null, isochrone, null);
                        };
                    }
                    break;
                };
            }
        }
    }
}

const searchCompounds = (req, res, next) => {
    if ((req.body.bizcircle) || (req.body.district) || (req.body.compound)) {
        //目前还没有用到area这个参数
        Compounds.get_roommodel(req.body.compound, req.body.bizcircle, req.body.district, req.body.totalPrice_min, req.body.totalPrice_max, req.body.numRooms, req.body.sinceBuilt, (err, data_room) => {
            if (err) return next(err);
            var id_set = new Set();
            data_room.forEach(element => {
                id_set.add(element['lianjia_id']);
            });
            const id_list = Array.from(id_set);
            Compounds.get_compounds_roominfo(id_list, (err, data) => {
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
};

const searchByIsochrone = (req, res, next) => {
    if (req.body.workplace) {
        Compounds.filter_isochrone(req.body.workplace, req.body.workplace2, req.body.commuteTime, req.body.commuteMethod, (err, data, data_workplace2) => {
            if (err) return next(err);
            const isochrone = data;
            const isochrone_workplace2 = data_workplace2;
            Compounds.get_roommodel_with_coord(req.body.totalPrice_min, req.body.totalPrice_max, req.body.numRooms, req.body.sinceBuilt, (err, data_room) => {
                if (err) return next(err);
                const compounds_coords = data_room;

                // 判断小区是否在等时圈内， 如果是，添加到结果列表
                var compounds_in_isochrone = [];
                for (var i = 0; i < compounds_coords.length; i++) {
                    var lat = compounds_coords[i].lattitude;
                    var lng = compounds_coords[i].longitude;
                    var point = turf.point([lat, lng]); // 小区的坐标

                    // isochrone是一个FeatureCollection, 判断isochrone这个GeoJSON对象是否包含小区的坐标.
                    var break_flag = false;
                    for (var j = 0; j < isochrone.features.length; j++) {
                        if (turf.booleanPointInPolygon(point, isochrone.features[j].geometry)) {
                            // 除了在第一个通勤范围里面，也需要在第二个通勤范围里面
                            if (isochrone_workplace2) {
                                break_flag = false;
                                for (var k = 0; k < isochrone_workplace2.features.length; k++) {
                                    if (turf.booleanPointInPolygon(point, isochrone_workplace2.features[k].geometry)) {
                                        compounds_in_isochrone.push(compounds_coords[i].lianjia_id);
                                        break_flag = true;
                                        break;
                                    }
                                }
                                if (break_flag) {
                                    break;
                                }
                            } else {
                                compounds_in_isochrone.push(compounds_coords[i].lianjia_id);
                                break;
                            }
                        };
                    }

                };

                // 获取在等时圈内的小区的详细信息
                const id_list = Array.from(compounds_in_isochrone);
                Compounds.get_compounds_roominfo(id_list, (err, data) => {
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
                    res.json(
                        {
                            "isochrone": isochrone,
                            "isochrone_workplace2": isochrone_workplace2,
                            "compounds": data
                        }
                    );
                });
            });
        });
    }
};

module.exports = { searchCompounds, searchByIsochrone };