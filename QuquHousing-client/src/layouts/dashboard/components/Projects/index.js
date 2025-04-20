// @mui material components
import Card from "@mui/material/Card";
import { Scene, PolygonLayer, LineLayer, PointLayer, Popup, MarkerLayer, Marker } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import React from "react";
import { difference, intersect, multiPolygon, center } from "@turf/turf";


const green_colors = [ //TODO：代表流动性，颜色约浅流动性约好
  '#C7EA46',
  '#6BBB58',
  '#7CB05E',
  '#4E955D',
  '#1E824C',
  '#2A9D8F',
  '#40C9A2',
  '#56A2B8',
  '#256EFF',
  '#004B39',
];

export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    const data = require("assets/QuquHousing/border_bizcircle_amap.json");
    const subwayLines = require("assets/QuquHousing/subway_lines.json");
    const subwayStations = require("assets/QuquHousing/subway_stations.json");
    const highwayLines = require("assets/QuquHousing/highway_lines.json");
    // const isochrone = require("assets/QuquHousing/漕河泾_isochrone_40.json");

    window._AMapSecurityConfig = {
      securityJsCode: '622e6f4391a6cd9ef95684e7d4b2bc06',
    }

    this.state = {
      mapLoading: true,
      mapLoadFailed: false,
      retryCount: 0,
      maxRetries: 3,
      data: data,
      subwayLines: subwayLines,
      subwayStations: subwayStations,
      highwayLines: highwayLines,
      scene: null,
    }

    this.loadMap = this.loadMap.bind(this);
  };

  strToArray2D = (str) => {
    var result = []
    if (str) {
      var tmp = str.slice(1, -1).split('], ');
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
        const delta = 0.0003;
        coord = [
          [ele.lattitude - delta, ele.longitude - delta],
          [ele.lattitude + delta, ele.longitude - delta],
          [ele.lattitude + delta, ele.longitude + delta],
          [ele.lattitude - delta, ele.longitude + delta]
        ]
      }
      data.features.push({
        "type": "Feature",
        "id": index,
        "properties": {
          "name": ele.name,
          "density": Math.round(ele.est_price),
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [coord],
        }
      });
    });
    return (data);
  }

  // processData_with_liquidityFilter = (raw, filter) => {
  //   var data = {
  //     "type": "FeatureCollection",
  //     "features": [],
  //   };
  //   var i = 0;
  //   raw.forEach((ele, index) => {
  //     if (ele.liquidity >= filter) {
  //       var coord = [];
  //       if (ele.boundary) {
  //         coord = this.strToArray2D(ele.boundary);
  //       } else if ((ele.lattitude) && (ele.longitude)) { //如果没有小区边际坐标，用中心点加上一定的范围推测小区范围
  //         const delta = 0.0003;
  //         coord = [
  //           [ele.lattitude - delta, ele.longitude - delta],
  //           [ele.lattitude + delta, ele.longitude - delta],
  //           [ele.lattitude + delta, ele.longitude + delta],
  //           [ele.lattitude - delta, ele.longitude + delta]
  //         ]
  //       }
  //       data.features.push({
  //         "type": "Feature",
  //         "id": i,
  //         "properties": {
  //           "name": ele.name,
  //           "density": Math.round(ele.est_price),
  //         },
  //         "geometry": {
  //           "type": "Polygon",
  //           "coordinates": [coord],
  //         }
  //       });
  //     }
  //     i = i + 1;
  //   });
  //   return (data);
  // }

  processMarkerData = (raw) => {
    var data = {
      "type": "FeatureCollection",
      "features": [],
    };
    raw.forEach((ele, index) => {
      var coord = [];
      if ((ele.lattitude) && (ele.longitude)) {
        coord = [ele.lattitude, ele.longitude];
      }
      data.features.push({
        "type": "Feature",
        "id": index,
        "properties": {
          "name": ele.name,
          "liquidity": ele.liquidity,
        },
        "geometry": {
          "type": "Point",
          "coordinates": coord,
        }
      });
    });
    return (data);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.showHighway !== prevState.showHighway) {
  //     return {showHighway: nextProps.showHighway};
  //   }
  //   return null;
  // }

  geoJSON_multipoly_to_turf = (geojson_featurecollection) => {
    var result = [];
    for (var i = 0; i < geojson_featurecollection.features.length; i++) {
      result.push(geojson_featurecollection.features[i].geometry.coordinates);
    }
    return multiPolygon(result);
  }

  turf_multipoly_to_geoJSON = (mp) => {
    var result = {
      "type": "FeatureCollection",
      "features": [],
    };
    for (var i = 0; i < mp.geometry.coordinates.length; i++) {
      result.features.push({
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": mp.geometry.coordinates[i]
        }
      });
    }
    return result;
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { mapLoadFailed, retryCount, maxRetries } = this.state;
    if (mapLoadFailed && retryCount <= maxRetries) {
      this.loadMap();
      return;
    }

    if (prevProps.showHighway !== this.props.showHighway) {
      var layer_highwayLines = this.state.scene.getLayerByName("highwayLines");
      this.props.showHighway ? layer_highwayLines.show() : layer_highwayLines.hide();
      this.state.scene.render();
      return;
    };

    if (prevProps.showSubway !== this.props.showSubway) {
      var layer_subwayLines = this.state.scene.getLayerByName("subwayLines");
      var layer_subwayStations = this.state.scene.getLayerByName("subwayStations");
      this.props.showSubway ? layer_subwayLines.show() : layer_subwayLines.hide();
      this.props.showSubway ? layer_subwayStations.show() : layer_subwayStations.hide();
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

    if (prevProps.showCompoundName !== this.props.showCompoundName) {
      var layer_compoundName = this.state.scene.getLayerByName("compound_name");
      this.props.showCompoundName ? layer_compoundName.show() : layer_compoundName.hide();
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

    if (prevProps.isochronePolygon !== this.props.isochronePolygon) {
      // 更新isochrone显示
      var layer_isochrone = this.state.scene.getLayerByName("isochrone");
      layer_isochrone.setData(this.props.isochronePolygon);
      layer_isochrone.show();
    }

    if (prevProps.isochronePolygon2 !== this.props.isochronePolygon2) {
      if ((this.props.isochronePolygon) && (this.props.isochronePolygon2)) {
        //计算重叠部分
        var layer_isochrone_overlap = this.state.scene.getLayerByName("isochrone_overlap");
        var layer_isochrone = this.state.scene.getLayerByName("isochrone");
        var layer_isochrone_workplace2 = this.state.scene.getLayerByName("isochrone_workplace2");

        var multipoly1 = this.geoJSON_multipoly_to_turf(this.props.isochronePolygon);
        var multipoly2 = this.geoJSON_multipoly_to_turf(this.props.isochronePolygon2);

        var inter = intersect(multipoly1, multipoly2);
        if (inter) {
          var diff1 = difference(multipoly1, multipoly2);
          var diff2 = difference(multipoly2, multipoly1);
          layer_isochrone_overlap.setData(this.turf_multipoly_to_geoJSON(inter));
          layer_isochrone.setData(this.turf_multipoly_to_geoJSON(diff1));
          layer_isochrone_workplace2.setData(this.turf_multipoly_to_geoJSON(diff2));
          layer_isochrone_overlap.show();
        } else {
          layer_isochrone_overlap.hide();
          layer_isochrone_workplace2.setData(this.props.isochronePolygon2);
        }
        layer_isochrone_workplace2.show();
      }
    }

    // 只要mapData更新了，就是新fetch了后台的数据回来
    if ((this.props.mapData) && (prevProps.mapData !== this.props.mapData) && (this.props.mapData.length > 0)) {
      const processed_data = this.processData(this.props.mapData);
      var layer1 = this.state.scene.getLayerByName("polygon");
      layer1.setData(processed_data).setAutoFit(true);
      // var layer2 = this.state.scene.getLayerByName("polygon_boundary");
      // layer2.setData(data);
      var layer_compoundName = this.state.scene.getLayerByName("compound_name");
      layer_compoundName.setData(processed_data);

      // 增加小区marker
      if (this.props.isochronePolygon) {
        var layer_compoundMarker = this.state.scene.getLayerByName("compound_marker");
        const markerData = this.processMarkerData(this.props.mapData);
        layer_compoundMarker.setData(markerData);
        layer_compoundMarker.show();
      }

      // 显示所在商圈板块的边界
      var layer_bizcircle = this.state.scene.getLayerByName("bizcircle");
      layer_bizcircle.setData(this.props.borderBizcircle);
      layer_bizcircle.show();

      this.state.scene.render();
    }

    // 更新选择小区的时候
    if ((this.props.mapData) && (this.props.mapData.length > 0) && (prevProps.CompoundIndexSelected !== this.props.CompoundIndexSelected)) {
      const processed_data = this.processData(this.props.mapData);
      // 选择某个小区的时候，地图上也更新该小区的Popup
      const feature = processed_data.features[this.props.CompoundIndexSelected];
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
            offsets: [0, 0],
            closeButton: false,
            closeOnClick: true,
          })
            .setLngLat([avg_lnt, avg_lat])
            .setHTML(`<span>${feature.properties.name}: ${feature.properties.density}</span>`);

          this.state.scene.addPopup(popup);
          // this.state.scene.map.setCenter([avg_lnt, avg_lat]); TODO: 需要点击之后自动变成地图中心点
        }
      }
    }


    // 统一return，如果只是在其中一个里面return，那么另一个在下次判断的时候，prevProps和this.props总会一样
    if ((prevProps.isochronePolygon !== this.props.isochronePolygon) || (prevProps.isochronePolygon2 !== this.props.isochronePolygon2) || (prevProps.mapData !== this.props.mapData)) {
      this.state.scene.render();
      return;
    }
  }

  loadMap() {
    try {
      const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          pitch: 0,
          style: 'dark',
          center: [121.49726357369, 31.248988223529],
          zoom: 10.07,
          token: "95ff7a00fc9da3ebe5f58feed1d53566"
        }),
        logoVisible: false,
      });

      const { selectCompound } = this.props;

      scene.addImage(
        'marker',
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ'
      );

      scene.on('loaded', () => {
        this.setState({ mapLoading: false });
        this.setState({ mapLoadFailed: false }); // Set as successfully loaded
        this.setState({ scene: scene });

        const layer = new PolygonLayer({
          name: "polygon",
        })
          .source(this.state.data)
          .color(
            "density",
            [
              // "#1A4397",
              "#2555B7",
              "#3165D1",
              "#467BE8",
              "#6296FE",
              "#7EA6F9",
              "#98B7F7",
              "#BDD0F8",
            ].reverse()
          )
          .shape("fill")
          .style({
            opacity: 0.5,
          })
          .active(true);

        const layer_compoundName = new PolygonLayer({
          name: "compound_name",
          zIndex: 3,
        })
          .source(this.state.data)
          .color('white')
          .shape('name', 'text')
          .size(12)
          .style({
            textAnchor: 'center',
            textOffset: [0, 0],
            spacing: 2,
            padding: [1, 1],
            stroke: '#ffffff', // 描边颜色
            strokeWidth: 0.3, // 描边宽度
            strokeOpacity: 1.0,
          });

        const layer_compoundMarker = new PointLayer({
          name: "compound_marker",
          zIndex: 3,
          visible: false,
        })
          .source(this.state.data)
          .shape('marker')
          .size(12);
        this.state.scene.addLayer(layer_compoundMarker);

        const layer_bizcircleName = new PolygonLayer({
          name: "bizcircle_name",
          zIndex: 3,
          visible: false,
        })
          .source(this.state.data)
          .color('grey')
          .shape('name', 'text')
          .size(12)
          .style({
            textAnchor: 'center',
            textOffset: [0, 0],
            spacing: 2,
            padding: [1, 1],
          });

        const layer2 = new LineLayer({
          name: "polygon_boundary",
          zIndex: 2,
          visible: false,
        })
          .source(this.state.data)
          .color("grey")
          .size(0.8);

        this.state.scene.addLayer(layer);
        this.state.scene.addLayer(layer2);
        this.state.scene.addLayer(layer_bizcircleName);
        this.state.scene.addLayer(layer_compoundName);

        //TODO: 增加地图背后的水印

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
          .size(5)
          .color('isRunning', v => {
            switch (v) {
              case 0:
                return 'red';
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
            offsets: [0, 0],
            closeButton: false,
            closeOnClick: true,
          })
            .setLngLat(e.lngLat)
            .setHTML(`<span>${e.feature.properties.line}: ${e.feature.properties.station}</span>`);
          this.state.scene.addPopup(popup);
        })

        layer.on('mousemove', e => {
          const popup = new Popup({
            offsets: [0, 0],
            closeButton: false,
            closeOnClick: true,
          })
            .setLngLat(e.lngLat)
            .setHTML(`<span>${e.feature.properties.name}: ${e.feature.properties.density}</span>`);
          this.state.scene.addPopup(popup);
        });

        //增加点击事件，触发小区选择
        layer.on('click', function (e) {
          selectCompound(e.feature.id);
        });

        //增加等时圈显示
        const layer_isochrone = new PolygonLayer({
          name: "isochrone",
          zIndex: 1,
          visible: false,
        })
          .source(this.state.data)
          .color('#2343F0')
          .shape("fill")
          .style({
            opacity: 0.5,
          })
          .active(false);
        this.state.scene.addLayer(layer_isochrone);

        const layer_isochrone_workplace2 = new PolygonLayer({
          name: "isochrone_workplace2",
          zIndex: 1,
          visible: false,
        })
          .source(this.state.data)
          .color('#00C6FF')
          .shape("fill")
          .style({
            opacity: 0.5,
          })
          .active(false);
        this.state.scene.addLayer(layer_isochrone_workplace2);

        const layer_isochrone_overlap = new PolygonLayer({
          name: "isochrone_overlap",
          zIndex: 1,
          visible: false,
        })
          .source(this.state.data)
          .color('#9C27B0')
          .shape("fill")
          .style({
            opacity: 0.5,
          })
          .active(false);
        this.state.scene.addLayer(layer_isochrone_overlap);
      });

    } catch (error) {
      console.log(error);
      this.setState({ mapLoadFailed: true });
    }
  }

  render() {
    return (
      <Card sx={{ height: "100%" }}>
        {this.state.mapLoading ? <p>地图加载中，请稍候...</p> : null}
        <div id="map" />
      </Card>
    );
  }
}