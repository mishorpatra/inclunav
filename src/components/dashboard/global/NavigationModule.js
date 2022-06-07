import {
    floorList,
    imgDetails,
    getAllBuildingElements,
    venueList,
    buildingList,
    getGpsLocation,
    globalNavigation,
    getUserPortfolio,
    osmRoutes,
    pickupPoints,
    navContent,
    refPoint
  } from "../../../store/actions/index";
  import { connect } from "react-redux";

  import {
    getHaversineDistance,distance,obtaincoordinates
  } from "./module";

  import L from "leaflet";

  var myStyle_background = {
    //Style to display the background tile
    fillColor: "#d9d0c9",
    fillOpacity: 1,
    color: "#d9d0c9",
    weight: 2,
    opacity: 0.1,
    border: "none",
    width: "200px",
    height: "200px"
  };
/**
 * @id M1.2.1
 * @author Anirudh & Sai
 * 
 */
class Graph {
    constructor(noOfVertices) {
      this.noOfVertices = noOfVertices;
      this.AdjList = new Map();
      this.Adjweights = new Map();
    }
    addVertex(v) {
      this.AdjList.set(v, []);
      this.Adjweights.set(v, []);
    }
    hasvertex(v) {
      return this.AdjList.has(v);
    }
    edges(v) {
      return this.AdjList.get(v);
    }
    addEdge(v, w, wt, undir) {
      if (undir) {
        this.AdjList.get(v).push(w);
        this.Adjweights.get(v).push(wt);
        this.AdjList.get(w).push(v);
        this.Adjweights.get(w).push(wt);
      } else {
        this.AdjList.get(v).push(w);
        this.Adjweights.get(v).push(wt);
      }
    }
  
    printGraph() {
      var get_keys = this.AdjList.keys();
      for (var i of get_keys) {
        var get_values = this.AdjList.get(i);
        var val = this.Adjweights.get(i);
        var conc = "";
        var conc2 = "";
        for (let j of get_values) {
          conc = conc + j + " ";
        }
        for (let j of val) {
          conc2 = conc2 + j + " ";
        }
      }
    }
  }

  export const callwhile =  (srcfloor, srcVal, m, n, dest_x, dest_y, single, canvasid)=> {
    var min = Number.MAX_VALUE;
    var minleave = [];
    var var_i;
    var notthere;
    for (let i = 0; i < m; i++) {
      var row = [],
        row1 = [],
        row3 = [],
        row4 = [];
      for (let j = 0; j < n; j++) {
        row.push(1);
        row1.push(-1);
        row3.push(Number.MAX_VALUE);
        var row5 = [];
        row4.push(row5);
      }
      this.shortestpath.push(row4);
      this.grids.push(row);
      this.visited.push(row1);
      this.minimumcost.push(row3);
    }
    var ind1 = this.findFloor(srcfloor, this.grids_all);
    if (ind1 !== -1 && this.grids_all[ind1].properties.grid_1 != null) {
      for (let i = 0; i < this.grids_all[ind1].properties.grid_1.length; i++) {
        var nodes = this.grids_all[ind1].properties.grid_1[i].split(",");
        for (let j = 0; j < nodes.length; j++) {
          var val = nodes[j];
          var x = val % m;
          var y = parseInt(val / m);
          this.grids[x][y] = 0;
        }
      }
    }
    var src_x = srcVal % m;
    var src_y = parseInt(srcVal / m);
    this.leaves.push([src_x, src_y]);
    this.shortestpath[src_x][src_y].push([src_x, src_y]);
    this.minimumcost[src_x][src_y] = 0;
    while (this.leaves.length > 0) {
      min = Number.MAX_VALUE;
      for (let i = 0; i < this.leaves.length; i++) {
        if (min > this.minimumcost[this.leaves[i][0]][this.leaves[i][1]]) {
          min = this.minimumcost[this.leaves[i][0]][this.leaves[i][1]];
          minleave = this.leaves[i];
          var_i = i;
        }
      }
      this.visited[minleave[0]][minleave[1]] = 1;
      if (single == true) {
        if (minleave[0] == dest_x && minleave[1] == dest_y) {
          break;
        }
      } else {
        var check = true;
        for (var ch = 0; ch < parseInt(this.flrconn.length); ch++) {
          if (
            this.visited[parseInt(this.flrconn[ch][0])][
              parseInt(this.flrconn[ch][1])
            ] == 1
          ) {
          } else {
            check = false;
          }
        }
        if (check == true) {
          for (var ch = 0; ch < parseInt(this.flrconn.length); ch++) {
            var vert = srcfloor + "," + srcVal + "," + "virtual";
            this.graph.addEdge(
              vert,
              this.flrconn[ch][2],
              this.minimumcost[parseInt(this.flrconn[ch][0])][
                parseInt(this.flrconn[ch][1])
              ],
              true
            );
          }
          this.reset_var();
          break;
        }
      }
      this.leaves.splice(var_i, 1);
      for (var j = minleave[0] - 1; j <= minleave[0] + 1; j++) {
        for (var k = minleave[1] - 1; k <= minleave[1] + 1; k++) {
          if (j >= 0 && j < m && k >= 0 && k < n) {
            if (this.visited[j][k] == -1 && this.grids[j][k] == 1) {
              if (
                this.minimumcost[j][k] >
                this.minimumcost[minleave[0]][minleave[1]] +
                  Math.sqrt(
                    (minleave[0] - j) * (minleave[0] - j) +
                      (minleave[1] - k) * (minleave[1] - k)
                  )
              ) {
                this.minimumcost[j][k] =
                  this.minimumcost[minleave[0]][minleave[1]] +
                  Math.sqrt(
                    (minleave[0] - j) * (minleave[0] - j) +
                      (minleave[1] - k) * (minleave[1] - k)
                  );
                this.shortestpath[j][k] = this.shortestpath[minleave[0]][
                  minleave[1]
                ].concat([[j, k]]);
                notthere = 1;
                for (var p = 0; p < this.leaves.length; p++) {
                  if (this.leaves[p][0] == j && this.leaves[p][1] == k) {
                    notthere = 0;
                  }
                }
                if (notthere == 1) {
                  this.leaves.push([j, k]);
                }
              }
            }
          }
        }
      }
    }
    if (single == true) {
      let sp = this.shortestpath[dest_x][dest_y];
      this.callGlobal(sp)
    // return min
    }
  }

  export const getVenueList = (coordinates = null) => {
    this.props.venueList(() => {
      this.setState(
        {
          venueList: this.props.vnList.data
        }
      );
    });
  };

  export const selectedVenue = (vn, coordinates = null) => {
    this.setState(
      {
        selectedVenue: vn,
        venueMarker: { lat: coordinates[0], lng: coordinates[1] }
      },
      () => {
        this.getBuildingList(vn);
      }
    );
  };

  export const getBuildingList = (venueName, coordinates = null) => {
    this.props.buildingList({ venueName: venueName }, () => {
      this.setState(
        {
          buildingList: this.props.bldList.data
        },
        () => {
          let lat = this.state.buildingList[0].lat
          let lng = this.state.buildingList[0].lng
          const map = this.leafletMap.leafletElement;
          map.flyTo(new L.LatLng(lat, lng), map.getZoom(), {
            animate: true,
            duration: 1
          });
        }
      );
    });
  };

  export const getData = building => {
    let data = { venueName: this.state.selectedVenue, buildingName: building };
    this.props.floorList(data, () => {
      let flrList = this.props.flrList.data;
      this.setState({
        flrList: flrList,
        selectedBuilding: building
      });
    });
  };

  export const getCompleteData = floor => {
    let { selectedVenue, selectedBuilding } = this.state;
    this.props.globalNavigation(
      { venueName: selectedVenue, buildingName: selectedBuilding },
      () => {
        let data = this.props.androidNav;
        const floors = [...new Set(data.map(s => s.floor))];
        //polygon data or nonwalkables of all floors
        var poly_data = data
          .slice(data.length - floors.length, data.length)
          .filter(r => {
            return r.floor === floor;
          });
        //reduced data without non walkables
        var red_data = data.slice(0, data.length - floors.length).filter(r => {
          return r.floor === floor;
        });
        this.setState(
          {
            floor: floors[0],
            floors: floors,
            redData: red_data,
            polyData: poly_data
          },
          () => {
            let { selectedVenue, selectedBuilding } = this.state;
            this.props.refPoint(
              selectedVenue,
              selectedBuilding,
              "ground",
              () => {
                this.setState(
                  {
                    glbCoords: this.props.globalCoords[0].coordinates
                  },
                  () => {
                    let arr = this.props.globalCoords[0].coordinates.map(r => {
                      return [
                        parseFloat(r.globalRef.lng),
                        parseFloat(r.globalRef.lat)
                      ];
                    });
                    var poly = {
                      // background layer for SIT building
                      type: "FeatureCollection",
                      features: [
                        {
                          type: "Feature",
                          properties: {},
                          geometry: {
                            type: "Polygon",
                            coordinates: [
                              arr
                              // [ [77.19015095013468, 28.545269361046977 ],[77.19040173667757, 28.54534708573104 ],[77.19028371948092, 28.54564396115854 ],[77.19003561514704, 28.545566236693578 ],[77.19015095013468, 28.545269361046977 ]]
                            ]
                          }
                        }
                      ]
                    };
                    const map = this.leafletMap.leafletElement;
                    L.geoJson(poly, { style: myStyle_background }).addTo(map);

                    this.setState({
                      backgroundPoly: poly
                    });
                    this.handleLocalGlobal();
                  }
                );
              }
            );
          }
        );
      }
    );
  };

  export const handleLocalGlobal = () => {
    let crd = this.props.globalCoords[0].coordinates;
    var coords = []; // "breadth":"154","length":"173" , conversion: *3.28084
    coords[0] = {
      lat: parseFloat(crd[0].globalRef.lat),
      lon: parseFloat(crd[0].globalRef.lng),
      localx: parseInt(crd[0].localRef.lat),
      localy: parseInt(crd[0].localRef.lng)
    };
    coords[1] = {
      lat: parseFloat(crd[3].globalRef.lat),
      lon: parseFloat(crd[3].globalRef.lng),
      localx: parseInt(crd[3].localRef.lng),
      localy: parseInt(crd[3].localRef.lat)
    };
    coords[2] = {
      lat: parseFloat(crd[2].globalRef.lat),
      lon: parseFloat(crd[2].globalRef.lng),
      localx: parseInt(crd[2].localRef.lng),
      localy: parseInt(crd[2].localRef.lat)
    };
    coords[3] = {
      lat: parseFloat(crd[1].globalRef.lat),
      lon: parseFloat(crd[1].globalRef.lng),
      localx: parseInt(crd[1].localRef.lng),
      localy: parseInt(crd[1].localRef.lat)
    };
    let { redData, polyData } = this.state;
    let red_data = redData;
    let poly_data = polyData;
    //finding the point with lowest latitude and highest longitude
    var least_lat = 0;
    var high_lon = 0;
    //finding the point with lowest latitude and highest longitude
    for(let i=0; i<coords.length ;i++){
      if(coords[i].lat == coords[least_lat].lat){ //handling two points with equal lat
        if(coords[i].lon > coords[least_lat].lon){least_lat = i;}
      }
      else if(coords[i].lat < coords[least_lat].lat){least_lat = i;}
    }
    //evaluating high_lon
    var c1 = (least_lat == 3) ? 0:(least_lat+1)
    var c2 = (least_lat == 0) ? 3:(least_lat-1)
    var high_lon = (coords[c1].lon > coords[c2].lon) ? c1:c2
    ///lengths between given 4 global co-ordinates
    var lengths = [];
    for (let i = 0; i < coords.length; i++) {
      var temp1;
      if (i == coords.length - 1) {
        temp1 = getHaversineDistance(coords[i], coords[0]);
      } else {
        temp1 = getHaversineDistance(coords[i], coords[i + 1]);
      }
      lengths.push(temp1);
    }
    // building angle with equator or true horizontal
    var b = getHaversineDistance(coords[least_lat], coords[high_lon]);

    const horizontal = obtaincoordinates(coords[least_lat], 0, b);
    var c = getHaversineDistance(coords[least_lat], horizontal);
    var a = getHaversineDistance(coords[high_lon], horizontal);
    var out =
      (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
    // Vertical alignment or lift correction
    var diff = []; //array to store offset of each floor
    var ground_lift = red_data.filter(x => {
      return x.element.subType == "lift" && x.floor == "ground";
    });
  
    if (ground_lift.length != 0) {
      var nth_lift = 0; //loop to find which lift is across more floors
      for (let i = 0; i < ground_lift.length; i++) {
        var temp = red_data.filter(x => {
          return (
            x.element.subType == "lift" &&
            x.properties.name == ground_lift[i].properties.name
          );
        });
        if (
          temp.length >=
          red_data.filter(x => {
            return (
              x.element.subType == "lift" &&
              x.properties.name == ground_lift[nth_lift].properties.name
            );
          }).length
        ) {
          nth_lift = i;
        }
      }
      // console.log(nth_lift, ground_lift[nth_lift].properties.name)
      var lifts = red_data.filter(x => {
        return (
          x.element.subType == "lift" &&
          x.properties.name == ground_lift[nth_lift].properties.name
        );
      });
      for (let i = 0; i < lifts.length; i++) {
        var temp = {};
        temp.x = lifts[i].coordinateX - ground_lift[nth_lift].coordinateX;
        temp.y = lifts[i].coordinateY - ground_lift[nth_lift].coordinateY;
        temp.floor = lifts[i].floor;
        diff.push(temp);
      }
      // console.log(diff)
    }

    // loop to calculate all the coordinates of local points
    var local_coords = { localx: 0, localy: 0 };
    for (let i = 0; i < red_data.length; i++) {
      if (diff.length > 1) {
        //vertical correction across floors
        var test = diff.filter(x => {
          return x.floor == red_data[i].floor;
        });
        local_coords.localx = red_data[i].coordinateX - test[0].x;
        local_coords.localy = red_data[i].coordinateY - test[0].y;
      } else {
        local_coords.localx = red_data[i].coordinateX;
        local_coords.localy = red_data[i].coordinateY;
      }
      var l = distance(coords[least_lat], coords[high_lon]);
      var m = distance(local_coords, coords[high_lon]);
      var n = distance(coords[least_lat], local_coords);
      var theta =
        (Math.acos((l * l + n * n - m * m) / (2 * l * n)) * 180) / Math.PI;
      if ((l * l + n * n - m * m) / (2 * l * n) > 1 || m == 0 || n == 0) {
        theta = 0;
      } //staright line case
      let ang = theta + out;

      var dist = distance(coords[least_lat], local_coords) * 0.3048; //to convert to meter
      var ver = dist * Math.sin((ang * Math.PI) / 180.0);
      var hor = dist * Math.cos((ang * Math.PI) / 180.0);

      var final = obtaincoordinates(coords[least_lat], ver, hor);

      red_data[i].properties.latitude = final.lat;
      red_data[i].properties.longitude = final.lon;
    }

    //converting to geoJSON format
    let geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    for (let i = 0; i < red_data.length; i++) {
      var p = red_data[i];
      if (p.name == "") {
        //to deal with empty name field
        p.name = p.properties.name;
      }
      geoJSON.features.push({
        type: "Feature",
        properties: {
          name: p.name,
          floor: p.floor,
          type: p.element.subType,
          floorElement: p.element.type,
          localx: p.coordinateX,
          localy: p.coordinateY,
          ...p.properties
        },
        geometry: {
          type: "Point",
          coordinates: [p.properties.longitude, p.properties.latitude]
        }
      });
    }

    ///// nonWalkableGrids Calculations
    var local_coords = { localx: 0, localy: 0 };
    for (let k = 0; k < poly_data.length; k++) {
      var temp2 = [];
      var floor_length = poly_data[k].properties.floorLength;
      for (let j = 0; j < poly_data[k].properties.clickedPoints.length; j++) {
        var line = poly_data[k].properties.clickedPoints[j];
        var numbers = line.split(",").map(Number);
        var temp1 = [];
        for (let i = 0; i < numbers.length; i++) {
          local_coords.localx = numbers[i] % floor_length;
          local_coords.localy = numbers[i] / floor_length;

          //for vertical allignment across floors
          if (diff.length > 1) {
            var test = diff.filter(x => {
              return x.floor == poly_data[k].floor;
            });
            local_coords.localx = local_coords.localx - test[0].x;
            local_coords.localy = local_coords.localy - test[0].y;
          }

          var l = distance(coords[least_lat], coords[high_lon]);
          var m = distance(local_coords, coords[high_lon]);
          var n = distance(coords[least_lat], local_coords);
          var theta =
            (Math.acos((l * l + n * n - m * m) / (2 * l * n)) * 180) / Math.PI;
          if ((l * l + n * n - m * m) / (2 * l * n) > 1 || m == 0 || n == 0) {
            theta = 0;
          } //staright line case

          let ang = theta + out;
          var dist = distance(coords[least_lat], local_coords) * 0.3048; //to convert to meter
          var ver = dist * Math.sin((ang * Math.PI) / 180.0);
          var hor = dist * Math.cos((ang * Math.PI) / 180.0);

          var final = obtaincoordinates(coords[least_lat], ver, hor);
          var temp = [];
          temp.push(final.lon, final.lat);
          temp1.push(temp);
        }
        temp2.push(temp1);
      }
      poly_data[k]["global"] = temp2;
    }

    //converting to geoJSON format
    let geoJSON_poly = {
      type: "FeatureCollection",
      features: []
    };
    for (let j = 0; j < poly_data.length; j++) {
      for (let i = 0; i < poly_data[j].global.length; i++) {
        geoJSON_poly.features.push({
          type: "Feature",
          properties: {
            floor: poly_data[j].floor
          },
          geometry: {
            type: "LineString",
            coordinates: poly_data[j].global[i]
          }
        });
      }
    }

    this.setState({
      geoJSON: geoJSON,
      geoJSONPoly: geoJSON_poly,
      currentPos: {
        lat: geoJSON.features[0].properties.latitude,
        lng: geoJSON.features[0].properties.longitude
      }
    });
  };

  
  // handle pickup points

  export const handleCall = (e, position) => {
    if (String(position.properties.contactNo) === "null") {
      /*to handle null values*/
      e.preventDefault();
      alert(` No contact number associated`);
    } else {
      window.location.href = "tel:" + position.properties.contactNo;
    }
  };

  export const handleInternet = (e, position) => {
    if (String(position.properties.url) === "null") {
      /*to handle null values*/
      e.preventDefault();
      alert(` No website associated`);
    } else {
      window.open(position.properties.url, "_blank" /*Open in a new window.*/);
    }
  };

  export const handleWhatsapp = (e, position) => {
    if (String(position.properties.contactNo) == "null") {
      /*to handle null values*/
      e.preventDefault();
      alert(` No whatsapp number associated`);
    } else {
      window.open(
        "https://api.whatsapp.com/send?phone=" + position.properties.contactNo,
        "_blank" /*Open in a new window.*/
      );
    }
  };

  export const handleEmail = (e, position) => {
    console.log("e",e,position)
    if( String(position.properties.email) == "null" ){ /*to handle null values*/
      e.preventDefault();
      alert(` No Email associated`);
    }
    else{ window.location.href = `mailto: ${position.properties.email}`; }  
  };

  export const handleInfo = (e, position) => {
    const info =
      "\n" +
      "Name :  " +
      position.properties.name +
      "\n" +
      "Floor num. :  " +
      position.properties.floor +
      "\n" +
      "Contact num. :  " +
      position.properties.contactNo +
      "\n" +
      "Timings :  " +
      position.properties.startTime +
      " - " +
      position.properties.endTime;
    e.preventDefault();
    alert(` ${info}`);
  };

 export const setNavigation = () => {
    this.props.getAllBuildingElements({venueName:this.state.selectedVenue,buildingName:this.state.selectedBuilding} , () => {
      let nodes = this.props.navigationInfo;
    this.grids_all = [];
      let lists = [];
      let num_vert = 0;
      let fc = new Map();
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].properties.floorElement === "FloorConnection") {
          num_vert++;
          var v = nodes[i].properties.type + "," + nodes[i].properties.name;
          var val = nodes[i].properties.floor + "," + nodes[i].properties.node;
          if (fc.has(v) === false) {
            fc.set(v, [val]);
          } else {
            fc.get(v).push(val);
          }
        }
      }
      this.graph = new Graph(num_vert + 2);
      for (let i = 0; i < nodes.length; i++) {
        var sel = nodes[i].properties;
        lists.push(sel);
        if (nodes[i].properties.floorElement === "FloorConnection") {
          var val = nodes[i].properties.floor + "," + nodes[i].properties.node;
          this.graph.addVertex(val);
        }

        if (nodes[i].properties.floorElement === "Floor") {
          if (nodes[i].properties.length == 8) {
            var v = nodes[i].properties.frConn[0].split(",");
            var flrmatrix = nodes[i].properties.flr_dist_matrix[0].split(",");
            var len = v.length / 2;
            if (v.length % 2 === 0) {
              for (var j = 0; j < v.length; j = j + 2) {
                var val =
                  parseInt(nodes[i].properties.length) * parseInt(v[j + 1]) +
                  parseInt(v[j]);
                var vert1 = nodes[i].properties.floor + "," + val;
                for (var k = j + 2; k < v.length; k = k + 2) {
                  val =
                    parseInt(nodes[i].properties.length) * parseInt(v[k + 1]) +
                    parseInt(v[k]);
                  var vert2 = nodes[i].properties.floor + "," + val;
                  this.graph.addEdge(
                    vert1,
                    vert2,
                    flrmatrix[len * (j / 2) + k / 2],
                    true
                  );
                }
              }
            } else {
            }
          }
          this.grids_all.push(nodes[i]);
        }
      }

      let getKeys = fc.keys();

      for (let i of getKeys) {
        var get_values = fc.get(i);
        var cnt = 0;
        var prev = null;
        for (var j of get_values) {
          if (cnt > 0) {
            this.graph.addEdge(prev, j, 0, true);
            prev = j;
          }
          if (cnt === 0) {
            prev = j;
          }
          cnt++;
        }
      }

      this.setState({
        list: lists
      },()=>{
        this.handleSubmit()
      });
    });
  };


  export const handleSubmit = () => {
    let {  srcName,dstName, dstfloorL,dstfloorB } = this.state;
    let srcVal = "";
    let dstVal = "";
    let srcfloor = "";
    let dstfloor = "";

    for(let k=0;k<this.props.navigationInfo.length;k++){
              if((this.props.navigationInfo[k].properties.floorElement!==undefined) && this.props.navigationInfo[k].properties.floorElement === "Rooms"){
                if(srcName === this.props.navigationInfo[k].properties.roomName){
                  srcVal = this.props.navigationInfo[k].properties.node
                  srcfloor = this.props.navigationInfo[k].properties.floor
                  dstfloor = this.props.navigationInfo[k].properties.floor
  
                }
                if(dstName === this.props.navigationInfo[k].properties.roomName){
                  dstVal = this.props.navigationInfo[k].properties.node
                }
              }
    } 

    let dstFlrDt = this.state.flrList.filter((r,i)=>{
      return r.floor === srcfloor 
    })
    let srcfloorL =dstFlrDt[0].floorL;
    let srcfloorB =dstFlrDt[0].floorB;

    if (srcVal != null && dstVal != null) {
      let dest_x = this.state.dstData.properties.localx;
      let dest_y = this.state.dstData.properties.localy;
      if (srcfloor === dstfloor) {
        callwhile(
          srcfloor,
          srcVal,
          srcfloorL,
          srcfloorB,
          dest_x,
          dest_y,
          true,
          "myCanvassrc"
        );
        this.setState({
          samefloor: true,
        });
      } else {
        this.setState({
          samefloor: false,
          buildingView:true
        });
        this.findpath();
      }
    } else {
    }
    
  };


 export const findFloor = (key, array) => {
    if (array !== undefined) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].type) {
          if (array[i].geomtery.type === "Polygon") {
            if (array[i].properties.floor === key) {
              return i;
            }
          }
        }
        if (array[i].floor === key) {
          return i;
        }
      }
    }
    return -1;
  };
  export const reset_var = ()=> {
    this.grids = [];
    this.visited = [];
    this.shortestpath = [];
    this.minimumcost = [];
    this.leaves = [];
  }

 

export const callGlobal = (sp)=>{
  let crd = this.props.globalCoords[0].coordinates;
  var coords = []; // "breadth":"154","length":"173" , conversion: *3.28084
  coords[0] = {
    lat: parseFloat(crd[0].globalRef.lat),
    lon: parseFloat(crd[0].globalRef.lng),
    localx: parseInt(crd[0].localRef.lat),
    localy: parseInt(crd[0].localRef.lng)
  };
  coords[1] = {
    lat: parseFloat(crd[3].globalRef.lat),
    lon: parseFloat(crd[3].globalRef.lng),
    localx: parseInt(crd[3].localRef.lng),
    localy: parseInt(crd[3].localRef.lat)
  };
  coords[2] = {
    lat: parseFloat(crd[2].globalRef.lat),
    lon: parseFloat(crd[2].globalRef.lng),
    localx: parseInt(crd[2].localRef.lng),
    localy: parseInt(crd[2].localRef.lat)
  };
  coords[3] = {
    lat: parseFloat(crd[1].globalRef.lat),
    lon: parseFloat(crd[1].globalRef.lng),
    localx: parseInt(crd[1].localRef.lng),
    localy: parseInt(crd[1].localRef.lat)
  };
  //finding the point with lowest latitude and highest longitude
  var least_lat = 0;
  var high_lon = 0;
  //finding the point with lowest latitude and highest longitude
  for(let i=0; i<coords.length ;i++){
    if(coords[i].lat == coords[least_lat].lat){ //handling two points with equal lat
      if(coords[i].lon > coords[least_lat].lon){least_lat = i;}
    }
    else if(coords[i].lat < coords[least_lat].lat){least_lat = i;}
  }
  //evaluating high_lon
  var c1 = (least_lat == 3) ? 0:(least_lat+1)
  var c2 = (least_lat == 0) ? 3:(least_lat-1)
  var high_lon = (coords[c1].lon > coords[c2].lon) ? c1:c2
  ///lengths between given 4 global co-ordinates
  var lengths = [];
  for (let i = 0; i < coords.length; i++) {
    var temp1;
    if (i == coords.length - 1) {
      temp1 = getHaversineDistance(coords[i], coords[0]);
    } else {
      temp1 = getHaversineDistance(coords[i], coords[i + 1]);
    }
    lengths.push(temp1);
  }
  // building angle with equator or true horizontal
  var b = getHaversineDistance(coords[least_lat], coords[high_lon]);
  const horizontal = obtaincoordinates(coords[least_lat], 0, b);
  var c = getHaversineDistance(coords[least_lat], horizontal);
  var a = getHaversineDistance(coords[high_lon], horizontal);
  var out =
    (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
  // Vertical alignment or lift correction
  var diff = []; //array to store offset of each floor

  // loop to calculate all the coordinates of local points
  var local_coords = { localx: 0, localy: 0 };
  for (let i = 0; i < sp.length; i++) {
    if (diff.length > 1) {
      //vertical correction across floors
      local_coords.localx = sp[i][0];
      local_coords.localy = sp[i][1];
    } else {
      local_coords.localx = sp[i][0];
      local_coords.localy = sp[i][1];
    }
    var l = distance(coords[least_lat], coords[high_lon]);
    var m = distance(local_coords, coords[high_lon]);
    var n = distance(coords[least_lat], local_coords);
    var theta =
      (Math.acos((l * l + n * n - m * m) / (2 * l * n)) * 180) / Math.PI;
    if ((l * l + n * n - m * m) / (2 * l * n) > 1 || m == 0 || n == 0) {
      theta = 0;
    } //staright line case
    let ang = theta + out;
    var dist = distance(coords[least_lat], local_coords) * 0.3048; //to convert to meter
    var ver = dist * Math.sin((ang * Math.PI) / 180.0);
    var hor = dist * Math.cos((ang * Math.PI) / 180.0);
    var final = obtaincoordinates(coords[least_lat], ver, hor);

    sp[i][0] = final.lat;
    sp[i][1] = final.lon;
  }
  //converting to geoJSON format
  let geoJSON = {
    type: "FeatureCollection",
    features: []
  };


sp.shift()
sp.pop()
sp.pop()

  for (let i = 0; i < sp.length; i++) {
    var p = sp[i];
    geoJSON.features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [p[0], p[1]]
      }
    });
  }
  const map = this.leafletMap.leafletElement;
    let src = this.state.srcData.geometry.coordinates
    let dst = this.state.dstData.geometry.coordinates
  this.setState({
    showpath:true,
    showMarker:false,
    zoom:19,
    pathgeoJSON:geoJSON
  },()=>{
    var southWest = L.latLng(src[1], src[0]),
    northEast = L.latLng(dst[1],dst[0]),
    bounds = L.latLngBounds(southWest, northEast);
    map.fitBounds(bounds);
  })
}

  const mapStateToProps = state => {
    return {
      getImage: state.imgDetails,
      allNodes: state.getAllElem,
      flrList: state.floorList,
      userProfile: state.userPortfolio,
      navigationInfo: state.navigationInfo,
      vnList: state.venueList,
      bldList: state.buildingList,
      gpsLocation: state.gpsLocation,
      androidNav: state.globalNavigation,
      globalRoutes: state.osmRoutes,
      pickupPoint: state.pickupPoints,
      currentTab: state.navContent,
      globalCoords: state.refPoint
    };
  };
  
  export default connect(mapStateToProps, {
    floorList,
    imgDetails,
    getAllBuildingElements,
    venueList,
    buildingList,
    getGpsLocation,
    globalNavigation,
    getUserPortfolio,
    osmRoutes,
    pickupPoints,
    navContent,
    refPoint
  })();
  