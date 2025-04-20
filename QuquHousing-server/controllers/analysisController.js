var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/Server_db.db');
const sql_res_limit = 5000; //每次query返回数量最大值
const sql_res_limit_district = 5000; 
const this_year = 2023;

class Analysis {
    static get_fallback_compounds(bizcircle, district, sinceBuilt, fallPct, cb) { //每次点击小区名称时候返回by房间数的信息
        const sql_query = 'SELECT lianjia_id, name, round(avg_pct_change*100, 2) as avg_pct_change, avg_max_price, avg_listing_price, year_built, num_units, est_price, parking_ratio, floor_area_ratio, \
        green_coverage_ratio, car_separation, building_type, property_type, property_fee, property_manager, elevator_rate, area_usage_rate, \
        exterior_material, roominfo3, avg_area, boundary, lattitude, longitude FROM fallback_compounds WHERE year_built >= ? '
        if (district.length > 0) {
            db.all(sql_query +
            'AND district = ? AND avg_pct_change <= ?', 
            [sinceBuilt, district, fallPct/100], cb);
        } else if (bizcircle.length > 0) {
            db.all(sql_query +
            'AND bizcircle = ? AND avg_pct_change <= ?', 
            [sinceBuilt, bizcircle, fallPct/100], cb);
        } else {
            db.all(sql_query +
            'AND avg_pct_change <= ?',
            [sinceBuilt, fallPct/100], cb);
        }
    }

    static get_priceUnincreased_compounds(bizcircle, district, sinceBuilt, fallPct, cb) {
        const sql_query = 'SELECT lianjia_id, name, round(avg_chg_from_pre_2020_oct*100, 2) as avg_pct_change, avg_price_pre_2020_oct, avg_listing_price, year_built, num_units, est_price, parking_ratio, floor_area_ratio, \
        green_coverage_ratio, car_separation, building_type, property_type, property_fee, property_manager, elevator_rate, area_usage_rate, \
        exterior_material, roominfo3, avg_area, boundary, lattitude, longitude FROM price_unchg_or_less_compounds WHERE year_built >= ? '
        if (district.length > 0) {
            db.all(sql_query +
            'AND district = ? AND avg_chg_from_pre_2020_oct <= ?', 
            [sinceBuilt, district, fallPct/100], cb);
        } else if (bizcircle.length > 0) {
            db.all(sql_query +
            'AND bizcircle = ? AND avg_chg_from_pre_2020_oct <= ?', 
            [sinceBuilt, bizcircle, fallPct/100], cb);
        } else {
            db.all(sql_query +
            'AND avg_chg_from_pre_2020_oct <= ?',
            [sinceBuilt, fallPct/100], cb);
        }
    }

    static get_priceIncreased_compounds(bizcircle, district, sinceBuilt, fallPct, cb) {
        const sql_query = 'SELECT lianjia_id, name, round(avg_pct_change_total*100, 2) as avg_pct_change, min_pct_change_total as min_pct_change, avg_price_prev, avg_price_after, avg_listing_price, \
        year_built, num_units, est_price, parking_ratio, floor_area_ratio, \
        green_coverage_ratio, car_separation, building_type, property_type, property_fee, property_manager, elevator_rate, area_usage_rate, \
        exterior_material, roominfo3, avg_area, boundary, lattitude, longitude FROM rise_compounds WHERE year_built >= ? '
        if (district.length > 0) {
            db.all(sql_query +
            'AND district = ? AND avg_pct_change_total >= ? ORDER BY avg_pct_change_total DESC', 
            [sinceBuilt, district, fallPct/100], cb);
        } else if (bizcircle.length > 0) {
            db.all(sql_query +
            'AND bizcircle = ? AND avg_pct_change_total >= ? ORDER BY avg_pct_change_total DESC', 
            [sinceBuilt, bizcircle, fallPct/100], cb);
        } else {
            db.all(sql_query +
            'AND avg_pct_change_total >= ? ORDER BY avg_pct_change_total DESC',
            [sinceBuilt, fallPct/100], cb);
        }
    }    
};

const PnLAnalysis = (req, res, next) => {
    if (req.body.topic == 'peakFall') {
        //目前还没有用到area这个参数
        Analysis.get_fallback_compounds(req.body.bizcircle, req.body.district, req.body.sinceBuilt, req.body.fallPct, (err, data) => {
            if (err) return next(err);
                res.json(data);
        });
    } else if (req.body.topic == 'priceUnincreased') {
        Analysis.get_priceUnincreased_compounds(req.body.bizcircle, req.body.district, req.body.sinceBuilt, req.body.fallPct, (err, data) => {
            if (err) return next(err);
                res.json(data);
        });
    } else if (req.body.topic == 'priceIncreased') {
        Analysis.get_priceIncreased_compounds(req.body.bizcircle, req.body.district, req.body.sinceBuilt, req.body.fallPct, (err, data) => {
            if (err) return next(err);
                res.json(data);
        });        
    }
};

module.exports = {PnLAnalysis};