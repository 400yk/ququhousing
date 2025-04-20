// @mui material components
import Card from "@mui/material/Card";
import { Scene, PolygonLayer, LineLayer, PointLayer, Popup, MapTheme, MouseLocation, Marker } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import React from "react";
import colorLegend from "assets/QuquHousing/colorLegend.png";
import { ControlEvent, DrawControl, DrawEvent, DrawPolygon } from '@antv/l7-draw';

const colorRange = ["#0000FF", "#3366CC", "#6699CC", "#99CCFF", "#FFFFFF", "#FFCCCC", "#FF6699", "#FF3300", "#CC0000", "#660000"];
// const colorRange = ['#001f3f', '#154360', '#296582', '#3c829e', '#5082b9', '#6582d2', '#7a82e9', '#9182ff', '#a782ff', '#be82ff']
const w = 10000;
const k = 1000;
var domain_totalPrice = [
  300*w, 400*w, 600*w, 800*w, 1000*w, 1200*w, 1500*w, 2000*w, 3000*w, 
];
// var domain_unitPrice = [
//   5*w, 6*w, 7*w, 8*w, 9*w, 10*w, 12*w, 15*w, 20*w, 
// ];
var domain_unitPrice = [
  10, 50, 100, 200, 300, 500, 750, 1000, 1500,
];

export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    // const data = require("assets/QuquHousing/border_bizcircle_amap.json"); 
    const data = require("layouts/bizcircle/components/Projects/data/border_bizcircle_amap_cnt_trans_since2019_gt500w.json"); 

    const subwayLines = require("assets/QuquHousing/subway_lines.json"); 
    const subwayStations = require("assets/QuquHousing/subway_stations.json");
    const highwayLines = require("assets/QuquHousing/highway_lines.json");
    // const colorLegend = require("assets/QuquHousing/colorLegend.png");

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

    if (prevProps.showCompoundName !== this.props.showCompoundName) {
      var layer_compoundName = this.state.scene.getLayerByName("compound_name");
      this.props.showCompoundName? layer_compoundName.show(): layer_compoundName.hide();
      this.state.scene.render();
      return;
    }

    if (prevProps.showTotalPrice !== this.props.showTotalPrice) {
      var layer = this.state.scene.getLayerByName("polygon");
      var density = this.props.showTotalPrice? 'totalPrice': 'density';
      var domain = this.props.showTotalPrice? domain_totalPrice: domain_unitPrice;
      layer
      .color(density, colorRange)
      .scale(density, {
        type: 'threshold',
        domain: domain
      });
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
      var layer = this.state.scene.getLayerByName("polygon_boundary");
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

    if (this.props.mapData?.length > 0) {
      const rawData = this.props.mapData;
      const data = this.processData(rawData);
      var layer = this.state.scene.getLayerByName("polygon");
      layer.setData(data).setAutoFit(true);
  
      // var layer2 = this.state.scene.getLayerByName("polygon_boundary");
      // layer2.setData(data);
      var layer_compoundName = this.state.scene.getLayerByName("compound_name");
      layer_compoundName.setData(data);

      // 显示所在商圈板块的边界
      var layer_bizcircle = this.state.scene.getLayerByName("bizcircle");
      layer_bizcircle.setData(this.props.borderBizcircle);
      layer_bizcircle.show();

      this.state.scene.render();


      // 选择某个小区的时候，地图上也更新该小区的Popup
      const CompoundIndexSelected = this.props.CompoundIndexSelected;
      const feature = data.features[CompoundIndexSelected];
      if ((feature) && (feature.geometry)) {
        if (feature.geometry.coordinates) { 
          const popupCoords = feature.geometry.coordinates[0];
          var avg_lnt = 0; //选择小区边界点的平均经纬度作为popup出现的位置
          var avg_lat = 0;
          for (var i = 0; i < popupCoords.length; i++) {
            avg_lnt += popupCoords[i][0];
            avg_lat += popupCoords[i][1];
          }
          avg_lnt = avg_lnt / popupCoords.length;
          avg_lat = avg_lat / popupCoords.length;
          const popup = new Popup({
            offsets: [ 0, 0 ],
            closeButton: false,
            closeOnClick: true,
          })  
          .setLngLat([avg_lnt, avg_lat])
          .setHTML(`<span>${feature.properties.name}: ${feature.properties.unitPrice}</span>`);

          this.state.scene.addPopup(popup);
          // this.state.scene.map.setCenter([avg_lnt, avg_lat]); TODO: 需要点击之后自动变成地图中心点
        }
      }
    }
  }

  componentDidMount() {
    const {selectCompound} = this.props;
    
    this.state.scene.on("loaded", () => {
      // const drawControl = new DrawControl(this.state.scene, {});
      // this.state.scene.addControl(drawControl);
      // drawControl.on(ControlEvent.DrawChange, (changeType) => {
      //   console.log(changeType);
      // });
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
 
      const layer_compoundName = new PolygonLayer({
        name: "compound_name",
        zIndex: 3,
        visible: this.props.showCompoundName,
      })
        .source(this.state.data)
        .color('white')
        .shape('name', 'text')
        .size(12)
        .style({
          textAnchor: 'center',
          textOffset: [ 0, 0 ],
          spacing: 2,
          padding: [ 1, 1 ],          
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 0.3, // 描边宽度
          strokeOpacity: 1.0,        
        });

      const layer_bizcircleName = new PolygonLayer({
        name: "bizcircle_name",
        zIndex: 3,
        visible: false,
      })
        .source(this.state.data)
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
        name: "polygon_boundary",
        zIndex: 2,
        visible: false,
      })
        .source(this.state.data)
        .color("white")
        .size(0.8);
      
      this.state.scene.addLayer(layer);
      this.state.scene.addLayer(layer2);
      this.state.scene.addLayer(layer_bizcircleName);
      this.state.scene.addLayer(layer_compoundName);
      this.state.scene.addLayer(layer_bizcircleScore);

      const layer_bizcircle = new LineLayer({
        name: "bizcircle",
        zIndex: 4,
        visible: false,
      })
      .source(this.state.data)
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
            return 'grey';
          case 1:
            return 'white';
          default: 
            return 'grey';
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
      .size(7)
      .color('isRunning', v => {
        switch (v) {
          case 0:
            return 'grey';
          case 1:
            return 'white';
          default: 
            return 'grey';
        }
      })
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