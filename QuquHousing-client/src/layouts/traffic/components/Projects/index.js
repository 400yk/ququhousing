// @mui material components
import Card from "@mui/material/Card";
import { Scene, PolygonLayer, LineLayer, PointLayer, Popup, MapTheme, MouseLocation, Marker } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import React from "react";
import colorLegend from "assets/QuquHousing/colorLegend.png";
import { ControlEvent, DrawControl, DrawEvent, DrawPolygon } from '@antv/l7-draw';
// import lodash from "lodash";

const colorRange = ["#0000FF", "#3366CC", "#6699CC", "#99CCFF", "#FFFFFF", "#FFCCCC", "#FF6699", "#FF3300", "#CC0000", "#660000"];
// const colorRange = ["#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828", "#B71C1C", "#8B0000"];
const w = 10000;
const k = 1000;
var domain_totalPrice = [
  300*w, 400*w, 600*w, 800*w, 1000*w, 1200*w, 1500*w, 2000*w, 3000*w, 
];
// var domain_unitPrice = [
//   5*w, 6*w, 7*w, 8*w, 9*w, 10*w, 12*w, 15*w, 20*w, 
// ];
var domain_unitPrice = [
  0.25*k, 0.5*k, 1*k, 2*k, 3*k, 4*k, 5*k, 6*k, 7*k,
];
var domain_subwayStation_score = [
  500, 1000, 1500, 2000, 2500, 3000
];
const colorRange_subwayStation = ["#00C6FF", "#3366FF", "#6633FF", "#9900FF", "#CC00FF", "#FF0099", "#9d2933" ];
// const colorRange_subwayStation = ['#ff0000', '#ff6600', '#ffc200', '#ffff00', '#99ffff', '#33ffff', '#00ffff'].reverse();
import { lineIntersect, intersect, area } from "@turf/turf";

export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    // const data = require("assets/QuquHousing/border_bizcircle_amap_with_score_GeoJSON.json"); 
    // const data = require("assets/QuquHousing/border_mesh_with_score_GeoJSON_0.007.json"); 
    const data = null;
    const allDistricts = require("assets/QuquHousing/border_district_amap.json");
    const allBizcircles = require("assets/QuquHousing/border_bizcircle_amap.json");
    const subwayLines = require("assets/QuquHousing/subway_lines.json"); 
    const subwayStations = require("assets/QuquHousing/subway_stations_with_score_GeoJSON.json");
    const highwayLines = require("assets/QuquHousing/highway_lines.json");

    window._AMapSecurityConfig = {
      securityJsCode:'622e6f4391a6cd9ef95684e7d4b2bc06',
    }

    const scene = new Scene({
      id: "map",
      map: new GaodeMap({
        style: "dark",
        center: [121.49726357369, 31.248988223529],
        zoom: 10.07,
        token: "95ff7a00fc9da3ebe5f58feed1d53566",
      }),
      logoVisible: false,
    });

    this.state = {
      data: data,
      subwayLines: subwayLines,
      subwayStations: subwayStations,
      highwayLines: highwayLines,
      colorLegend: colorLegend,
      scene: scene,
      bizcircles: allBizcircles,
      districts: allDistricts,
    }
  };

  strToArray2D = (str) => {
    var result = []
    if (str) {
      var tmp = str.slice(1,-1).split('], ');
      if (tmp) {
        tmp.forEach((ele) => {
          var each_coord_pair = ele.slice(1,).split(', ');
          result.push([parseFloat(each_coord_pair[0]), parseFloat(each_coord_pair[1])]);
        });
      }
    }
    return (result);
  }

  processData = (raw) => {
    var data = {
      "type": "FeatureCollection",
      "features": [],
    };
    raw.forEach((ele, index) => {
      var coord = [];
      if (ele.boundary) {
        coord = this.strToArray2D(ele.boundary);
      } else if ((ele.lattitude) && (ele.longitude)) { //如果没有小区边际坐标，用中心点加上一定的范围推测小区范围
        const delta = 0.0001;
        coord = [
          [ele.lattitude - delta, ele.longitude - delta],
          [ele.lattitude + delta, ele.longitude - delta],
          [ele.lattitude + delta, ele.longitude + delta],
          [ele.lattitude - delta, ele.longitude + delta]
        ]
      }
      if ((coord) && (ele.est_price * ele.avg_area > 0)) {
        data.features.push({
          "type": "Feature",
          "id": index,
          "properties": {
            "name": ele.name,
            "totalPrice": Math.round(ele.est_price * ele.avg_area), //按照总价进行颜色排序
            "density": Math.round(ele.est_price),
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [coord],
          }
        });
      }
    });
    return (data);
  }

  inside = (point, vs) => {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.showHighway !== this.props.showHighway) {
      var layer_highwayLines = this.state.scene.getLayerByName("highwayLines");
      this.props.showHighway? layer_highwayLines.show(): layer_highwayLines.hide();
      this.state.scene.render();
      return;
    };

    if (prevProps.showSubway !== this.props.showSubway) {
      var layer_subwayLines = this.state.scene.getLayerByName("subwayLines");
      var layer_subwayStations = this.state.scene.getLayerByName("subwayStations");
      this.props.showSubway? layer_subwayLines.show(): layer_subwayLines.hide();
      this.props.showSubway? layer_subwayStations.show(): layer_subwayStations.hide();
      this.state.scene.render();
      return;
    }

    if (prevProps.showDistrict !== this.props.showDistrict) {
      var layer_district = this.state.scene.getLayerByName("district");
      this.props.showDistrict? layer_district.show(): layer_district.hide();
      this.state.scene.render();
      return;
    }

    if (prevProps.showScore !== this.props.showScore) {
      var layer = this.state.scene.getLayerByName("polygon_score");
      this.props.showScore? layer.show(): layer.hide();
      this.state.scene.render();
      return;
    }

    if (prevProps.showSatellite !== this.props.showSatellite) {
      if (this.props.showSatellite) {
        const tileLayer = new AMap.TileLayer.Satellite({
          name: 'satellite',
        });
        tileLayer.setMap(this.state.scene.map);
      } else {
        this.state.scene.map.getLayerByClass('AMap.TileLayer.Satellite').setMap(null);
      };
      this.state.scene.render();
      return;      
    }

    if (prevProps.showBizcircle !== this.props.showBizcircle) {
      var layer = this.state.scene.getLayerByName("bizcircle_boundary");
      var layer_bizcircleName = this.state.scene.getLayerByName("bizcircle_name");
      if (this.props.showBizcircle) {
        layer.show();
        layer_bizcircleName.show();
      } else {
        layer.hide();
        layer_bizcircleName.hide();
      };
      this.state.scene.render();
      return;           
    }

    if (this.props.borderBizcircle && typeof(this.props.borderBizcircle) != "undefined" && Object.keys(this.props.borderBizcircle).length > 0 && prevProps.borderBizcircle !== this.props.borderBizcircle) {
      var layer = this.state.scene.getLayerByName("polygon");
      var layer_score = this.state.scene.getLayerByName("polygon_score");
      var layer_bizcircle = this.state.scene.getLayerByName("bizcircle_boundary");
      var layer_bizcircleName = this.state.scene.getLayerByName("bizcircle_name");
      var layer_district = this.state.scene.getLayerByName("district");
      var layer_subwayLines = this.state.scene.getLayerByName("subwayLines");
      var layer_subwayStations = this.state.scene.getLayerByName("subwayStations");

      var intersection = {
        "type": "FeatureCollection",
        "features": [],
      };
      var bboundary = this.props.borderBizcircle.features[0].geometry.coordinates[0];
      var total_area = area(this.props.borderBizcircle.features[0]);
      var avg_score = 0;
      
      // 筛选只在borderBizcircle覆盖范围内的数据
      for (var i = 0; i < this.state.data.features.length; i++) {
        var inter = intersect(this.state.data.features[i], this.props.borderBizcircle.features[0]);
        if (inter !== null) {
          inter.properties.name = this.state.data.features[i].properties.name;
          inter.properties.density = this.state.data.features[i].properties.density;
          intersection.features.push(inter);
          avg_score += area(inter) / total_area * inter.properties.density;
        }
      };
      // 输出平均分数
      console.log(this.props.borderBizcircle.features[0].properties.name + " " + avg_score.toString());
      layer.setData(intersection);
      layer_score.setData(intersection);
  
      var intersection = {
        "type": "FeatureCollection",
        "features": [],
      };
      for (var i = 0; i < this.state.bizcircles.features.length; i++) {
        var inter = intersect(this.state.bizcircles.features[i], this.props.borderBizcircle.features[0]);
        if (inter !== null) {
          inter.properties.name = this.state.bizcircles.features[i].properties.name;
          inter.properties.density = this.state.bizcircles.features[i].properties.density;
          intersection.features.push(inter);
        }
      };
      layer_bizcircle.setData(intersection);
      layer_bizcircleName.setData(intersection);


      // var layer2 = this.state.scene.getLayerByName("polygon_boundary");
      // layer2.setData(data);
      layer_district.setData(this.props.borderBizcircle);
      layer_district.show();

      // 更新地铁站及地铁线
      var subway_intersection = {
        "type": "FeatureCollection",
        "features": [],
      };
      for (var i = 0; i < this.state.subwayLines.features.length; i++) {
        var subwayline_coord = this.state.subwayLines.features[i].geometry.coordinates[0];
        var feature_i = JSON.parse(JSON.stringify(this.state.subwayLines.features[i])); //这里利用deep copy

        var line_intersect = lineIntersect(feature_i, this.props.borderBizcircle.features[0]);
        feature_i.geometry.coordinates = []; //必须是deep copy，否则改变this.state.subwayLines

        if (line_intersect.features.length > 0) {
          if (line_intersect.features.length == 1) { //只有一个点相交的两种情况
            if (this.inside(subwayline_coord[0], bboundary)) { //如果第一个点在内
              for (var j = 0; j < subwayline_coord.length; j++) {
                if (this.inside(subwayline_coord[j], bboundary)) {
                  feature_i.geometry.coordinates.push(subwayline_coord[j]);
                } else {
                  feature_i.geometry.coordinates.push(line_intersect.features[0].geometry.coordinates);
                  break;
                }
              }
            } else { //如果第一个点在外
              var flag = true;
              for (var j = 0; j < subwayline_coord.length; j++) {
                if (this.inside(subwayline_coord[j], bboundary)) {
                  if (flag) {
                    feature_i.geometry.coordinates.push(line_intersect.features[0].geometry.coordinates);
                    flag = false;
                  }
                  feature_i.geometry.coordinates.push(subwayline_coord[j]);
                }
              }
            }
          }
          else if (line_intersect.features.length == 2) { //两个点相交的情况
            // 判断一下顺序，
            var i1 = line_intersect.features[0].geometry.coordinates;
            var i2 = line_intersect.features[1].geometry.coordinates;
            var l1 = [];

            for (var j = 0; j < subwayline_coord.length; j++) {
              if (this.inside(subwayline_coord[j], bboundary)) {
                l1 = subwayline_coord[j];
                break;
              }
            }
            if (((i1[0]-l1[0])**2 + (i1[1]-l1[1])**2) > ((i2[0]-l1[0])**2 + (i2[1]-l1[1])**2)) { //判断距离
              var tmp = i1;
              i1 = i2;
              i2 = tmp;
            }

            feature_i.geometry.coordinates.push(i1);
            for (var j = 0; j < subwayline_coord.length; j++) {
              if (feature_i.properties.line == "地铁4号线" && this.props.borderBizcircle.features[0].properties.name == "徐汇") {
                // HARD CODE
                feature_i.geometry.coordinates = feature_i.geometry.coordinates.concat(subwayline_coord.slice(316,321));
                feature_i.geometry.coordinates = feature_i.geometry.coordinates.concat(subwayline_coord.slice(0,55));
                break;
              } else {
                if (this.inside(subwayline_coord[j], bboundary)) {
                  feature_i.geometry.coordinates.push(subwayline_coord[j]);
                }
              }
            }
            feature_i.geometry.coordinates.push(i2);
          } else { //存在多个intersect
            for (var j = 0; j < subwayline_coord.length; j++) {
              if (this.inside(subwayline_coord[j], bboundary)) {
                feature_i.geometry.coordinates.push(subwayline_coord[j]);
              }
            }
          }
        } else { // 还有一种情况，是地铁线完全在区内部的
          if (typeof(subwayline_coord) != "undefined") {
            if (this.inside(subwayline_coord[0], bboundary)) {
              for (var j = 0; j < subwayline_coord.length; j++) {
                if (this.inside(subwayline_coord[j], bboundary)) {
                  feature_i.geometry.coordinates.push(subwayline_coord[j]);
                }
              }
            }
          }
        }
        if (feature_i.geometry.coordinates.length > 0) {
          feature_i.geometry.coordinates = [feature_i.geometry.coordinates];
          subway_intersection.features.push(feature_i);
        }
      }
      layer_subwayLines.setData(subway_intersection);

      var subway_intersection = {
        "type": "FeatureCollection",
        "features": [],
      };
      for (var i = 0; i < this.state.subwayStations.features.length; i++) {
        var subwaystation_coord = this.state.subwayStations.features[i].geometry.coordinates;
        var feature_i = JSON.parse(JSON.stringify(this.state.subwayStations.features[i])); //这里必须是deep copy
        feature_i.geometry.coordinates = [];
        if (this.inside(subwaystation_coord, bboundary)) {
          feature_i.geometry.coordinates = subwaystation_coord;
        }
        if (feature_i.geometry.coordinates.length > 0) {
          subway_intersection.features.push(feature_i);
        }
      }
      layer_subwayStations.setData(subway_intersection);


      this.state.scene.render();
    }
  }

  componentDidMount() {
    const {selectCompound} = this.props;
    
    this.state.scene.on("loaded", () => {
      const mapTheme = new MapTheme({});
      this.state.scene.addControl(mapTheme);

      const drawPolygon = new DrawPolygon(this.state.scene, {
        areaOptions: {},
      });
      drawPolygon.enable();
    
      drawPolygon.on(DrawEvent.Change, (allFeatures) => {
        console.log(allFeatures);
      });

      var density = this.props.showTotalPrice? 'totalPrice': 'density';
      var domain = this.props.showTotalPrice? domain_totalPrice: domain_unitPrice;

      const layer = new PolygonLayer({
        name: "polygon",
      })
        .source(this.state.data)
        .color(density, colorRange)
        .scale(density, {
          type: 'threshold',
          domain: domain
        })
        .shape("fill")
        .style({
          opacity: 0.75,  
        })
        .active(true);

        const layer_score = new PolygonLayer({
          name: "polygon_score",
          zIndex: 3,
          visible: false,
        })
          .source(this.state.data)
          .color('white')
          .shape('density', 'text')
          .size(10)
          .style({
            textAnchor: 'center',
            textOffset: [ 0, 0 ],
            spacing: 2,
            padding: [ 1, 1 ],            
          });  
 
      const layer_district = new LineLayer({
        name: "district",
        zIndex: 3,
        visible: this.props.showDistrict,
      })
        .source(this.state.districts)
        .color('red')
        .size(0.8);

      const layer_bizcircleName = new PolygonLayer({
        name: "bizcircle_name",
        zIndex: 3,
        visible: false,
      })
        .source(this.state.bizcircles)
        .color('white')
        .shape('name', 'text')
        .size(12)
        .style({
          textAnchor: 'center',
          textOffset: [ 0, 0 ],
          spacing: 2,
          padding: [ 1, 1 ],            
        });  

      const layer_bizcircleScore = new PolygonLayer({
        name: "bizcircle_score",
        zIndex: 4,
        visible: false,
      })
        .source(this.state.data)
        .color('white')
        .shape('density', 'text')
        .size(12)
        .style({
          textAnchor: 'center',
          textOffset: [ 0, -30 ],
          spacing: 2,
          padding: [ 1, 1 ],            
        });          

      const layer2 = new LineLayer({
        name: "bizcircle_boundary",
        zIndex: 2,
        visible: false,
      })
        .source(this.state.bizcircles)
        .color("white")
        .size(0.8);
      
      this.state.scene.addLayer(layer);
      this.state.scene.addLayer(layer2);
      this.state.scene.addLayer(layer_bizcircleName);
      this.state.scene.addLayer(layer_district);
      this.state.scene.addLayer(layer_bizcircleScore);
      this.state.scene.addLayer(layer_score);

      const layer_bizcircle = new LineLayer({
        name: "bizcircle",
        zIndex: 4,
        visible: false,
      })
      .source(this.state.bizcircles)
      .size(1)
      .color("#F90505");
      this.state.scene.addLayer(layer_bizcircle);

      const layer_highwayLines = new LineLayer({
        name: "highwayLines",
        zIndex: 3,
        visible: this.props.showHighway,
      })
      .source(this.state.highwayLines)
      .size(2)
      .shape('line')
      .color('white')
      .texture('arrow')
      // .animate({
      //   interval: 1, // 间隔
      //   duration: 1, // 持续时间，延时
      //   trailLength: 2 // 流线长度
      // })
      .style({
        opacity: 1,
        lineTexture: true,
        iconStep: 10,
        iconStep: 10, // 设置贴图纹理的间距
        borderWidth: 0.0, // 默认文 0，最大有效值为 0.5
        borderColor: '#fff' // 默认为 #ccc
      });
      // .color('white');
      this.state.scene.addLayer(layer_highwayLines);

      const layer_subwayLines = new LineLayer({
        name: "subwayLines",
        zIndex: 2,
        visible: this.props.showSubway,
      })
      .source(this.state.subwayLines)
      .shape('line')
      .color('isRunning', v => { //正在建设中的地铁用灰色表示
        switch (v) {
          case 0:
            return null;
          case 1:
            return 'white';
          default: 
            return null;
        }
      });
      this.state.scene.addLayer(layer_subwayLines);

      const layer_subwayStations = new PointLayer({
        name: "subwayStations",
        zIndex: 6,
        visible: this.props.showSubway,
      })
      .source(this.state.subwayStations)
      .shape('simple')
      .size(6)
      .scale('score', {
        type: 'threshold',
        domain: domain_subwayStation_score
      })      
      .color('score', colorRange_subwayStation)
      // .color('isRunning', v => {
      //   switch (v) {
      //     case 0:
      //       return null;
      //     case 1:
      //       return colorRange_subwayStation;
      //     default: 
      //       return null;
      //   }
      // })
      .active(true);
      this.state.scene.addLayer(layer_subwayStations);
      
      layer_subwayStations.on('mousemove', e => {
        const popup = new Popup({
          offsets: [ 0, 0 ],
          closeButton: false,
          closeOnClick: true,
        })
        .setLngLat(e.lngLat)
        .setHTML(`<span>${e.feature.properties.line}: ${e.feature.properties.station}</span>`);
        this.state.scene.addPopup(popup);        
      });

      // TODO: 当鼠标停留在某一地铁线上，只高亮该地铁线
      // layer_subwayLines.on('mousemove', e => {
      //   const hoveredLineName = e.feature.properties.line;
      //   layer_subwayLines.hide();
      //   layer_subwayStations.hide();
      //   layer_subwayLines.filter('line', (name) => {
      //     if (name === hoveredLineName) {
      //     }
      //   });
      // });

      const mouseLocation = new MouseLocation({
        // transform: (position) => {
        //   return position;
        // },
        position: 'topleft',
      });
      this.state.scene.addControl(mouseLocation);

      layer.on('mousemove', e => {
        const popup = new Popup({
          offsets: [ 0, 0 ],
          closeButton: false,
          closeOnClick: true,
          name: "compoundPopup",
        })
        .setLngLat(e.lngLat)
        .setHTML(`<span>${e.feature.properties.name}: ${e.feature.properties.density}</span>`);
        this.state.scene.addPopup(popup);
      });

      //增加点击事件，触发小区选择
      layer.on('click', function(e) {
        selectCompound(e.feature.id);
      });

    });
  }

  render() {
    return (
      <Card sx={{ height: "100%" }}>
        <div id="map" />;
      </Card>
    );
  }
}


// ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'].reverse()