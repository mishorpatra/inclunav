import React, { Component } from 'react';
import { render } from 'react-dom';

import {
    Map as MapContainer,
    Marker,
    Popup,
    TileLayer,
  } from "react-leaflet";
  import L from "leaflet";
  import "leaflet-control-geocoder/dist/Control.Geocoder.js";
  import config from "../../../config";
  import { connect } from "react-redux";
  import {
    floorList,
    imgDetails,
    getAllBuildingElements,
    venueList,
    buildingList,
    getGpsLocation,
    androidNavigation,
    getUserPortfolio
  } from "../../../store/actions/index";
  import { Typeahead } from "react-bootstrap-typeahead";
  import "react-bootstrap-typeahead/css/Typeahead.css";
  import "leaflet-routing-machine";
  import "lrm-graphhopper";
  import Instructions from "./Instructions";
  import NavigationDetails from './NavigationDetails';
  import GlobalDetails from './GlobalDetails';
  import InstructionTab from './InstructionTab';
  import SourceMenu from "./SourceMenu";
  import DestinationMenu from "./DestinationMenu";

import { Stage, Layer,Star, Rect, Text } from 'react-konva';
import Konva from 'konva';

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


class ColoredRect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          center: { lat: 28.6139, lng: 77.209 },
          currentPos: { lat: 28.6139, lng: 77.209 },
          gpsLocation: "",
          buildingAddress: "",
          zoomLevel: "18",
          showStrtMenu: false,
          showDstMenu: false,
          //
          buildingName: "",
          srcName: "Select Source",
          srcfloor: "none",
          dstfloor: "none",
          list: [],
          dstName: "Select Destination",
          srcVal: null,
          dstVal: null,
          scale: 2.4,
          srcfloorL: null,
          srcfloorB: null,
          dstfloorL: null,
          dstfloorB: null,
          samefloor: true,
          canvaslist: [],
          ind: 0,
          sideDrawerOpen: false,
          isLoading: false,
          sidebarLeft: false,
          imgName: null,
          value: "",
          suggestions: [],
          dstValue: "",
          dstSuggestions: [],
          venueName: "",
          venueList: [],
          buildingList: [],
          buildingView: false,
          pathCaption: [],
          pathFloor: [],
          currentStep: 0,
          srcReadOnly: false,
          dstReadOnly: false,
          currentLocation: "",
          locationList: [],
          selectedSrcLocation: { buildingName: "Building", venueName: "Venue" },
          selectedDstLocation: { buildingName: "Building", venueName: "Venue" },
          srcBuildingLocation: { buildingName: "", venueName: "" },
          dstBuildingLocation: { buildingName: "", venueName: "" },
          srcFloorList: [],
          dstFloorList: [],
          selectedDestination: "Select Destination",
          dstAddress: "Select Destination",
          canvasWidth: null,
          canvasHeight: null,
          tmpSrcLocation: {},
          tmpDstLocation: {},
          floorAngle: 0,
          pathAngle:0,
          next: true,
          showDirections: false,
          pathArray: [],
          srtdInstruction: [],
          srtdFlr: [],
          toggle: false,
          osmRoutes: null,
          globalDistance: 0,
          globalTime: 0,
          showInstructions: false,
          zoom:false,
          language:'en',
          visionType:'vision',
          height:'<5ft',
          ageGroup:'adult',
          walkingType:'walk',
          pause:false,
          firstFlrInstruction:[],
          secondFlrInstruction:[],
          firstFlr:'',
          secondFlr:'',
          currentFloor:'',
          instructionReady:false,
          color: 'green',
          pathPoints:[]

        };
        this.shortestPathVar = [];
        this.grids_all = [];
        this.grids = [];
        this.visited = [];
        this.shortestpath = [];
        this.minimumcost = [];
        this.leaves = [];
        this.graph = null;
        this.flrconn = [];
        this.num_floors = 0;
        this.animateRef = false;
        this.instructions = [];
        this.show = 0;
        this.actualAngle = 0;
        this.croppedRegion = {};
      }
    
      componentDidMount() {
        // if (window.navigator.geolocation) {
        //   navigator.geolocation.getCurrentPosition(success => {
          let success  =  {coords:{ latitude: 28.6139, longitude: 77.209 }}
            let coordinates = [success.coords.latitude, success.coords.longitude];
            this.props.getGpsLocation(
              { lat: success.coords.latitude, lng: success.coords.longitude },
              () => {
                this.getUserDetails()
                var cvWidth = Math.max(
                  document.getElementById("myCanvassrc").clientWidth,
                  window.innerWidth || 0
                );
                var cvHeight = Math.max(
                  document.getElementById("myCanvassrc").clientHeight,
                  window.innerHeight || 0
                );
    
                var srcBar = document.getElementById("src-bar");
                var navHeight = document.getElementById("nav-height");
                var element = document.getElementById("myCanvassrc");
                var topPos = element.getBoundingClientRect().top;
                let realHeight =
                  cvHeight - (srcBar.clientHeight + navHeight.clientHeight);
    
                this.setState(
                  {
                    // currentLocation: this.props.gpsLocation.display_name,
                    currentLocation: "IIT Delhi",
                    canvasWidth: cvWidth,
                    canvasHeight: realHeight,
                    center: {
                      lat: success.coords.latitude,
                      lng: success.coords.longitude
                    },
                    currentPos: {
                      lat: success.coords.latitude,
                      lng: success.coords.longitude
                    }
                  },
                  () => {
                    const map = this.leafletMap.leafletElement;
                    let lat = success.coords.latitude;
                    let lng = success.coords.longitude;
                    map.flyTo(
                      new L.LatLng(
                        success.coords.latitude,
                        success.coords.longitude
                      ),
                      map.getZoom(),
                      {
                        animate: true,
                        duration: 0.5
                      }
                    );
                  }
                );
              }
            );
            this.getVenueList(coordinates);
        //   });
        // } else {
        //   // x.innerHTML = "Geolocation is not supported by this browser.";
        // }
      }
    
      getUserDetails = ()=>{
        let id = localStorage.getItem('id');
          let token = localStorage.getItem('token');
          this.props.getUserPortfolio({id,token},()=>{
            // console.log("user profile",this.props.userProfile)
            if(this.props.userProfile.success === false){
              localStorage.clear();
              this.props.history.push('/')
            }else{
              let data = this.props.userProfile.properties
              this.setState({
                language:data.language,
                visionType:data.visionType,
                height:data.height,
                ageGroup:data.ageGroup,
                walkingType:data.navigationMode
              })          
            }
          })
      }
    
      fetchLocation = (venueName, buildingName, point) => {
        let data = { venueName, buildingName };
        this.props.floorList(data, () => {
          let flrListData = this.props.flrList.data;
          let prevData = this.state.center;
          this.setState(
            {
              center: { lat: flrListData[0].lat, lng: flrListData[0].lng },
              currentPos: { lat: flrListData[0].lat, lng: flrListData[0].lng },
              [point]: {
                venueName,
                buildingName,
                lat: flrListData[0].lat,
                lng: flrListData[0].lng,
                floorAngle:parseInt(flrListData[0].buildingOrientation)
              }
            },
            () => {
              this.props.getAllBuildingElements(data, () => {
                const map = this.leafletMap.leafletElement;
                map.flyTo(
                  new L.LatLng(flrListData[0].lat, flrListData[0].lng),
                  map.getZoom(),
                  {
                    animate: true,
                    duration: 0.5
                  }
                );
                let nodes = this.props.navigationInfo;
                let lists = [];
                for (let i = 0; i < nodes.length; i++) {
                  var sel = nodes[i].properties;
                  lists.push(sel);
                }
    
                const uniqueLists = Array.from(
                  new Set(
                    lists.map(o => {
                      if (o.floorElement === "Rooms") {
                        return o.coordinates;
                      } else if (o.floorElement === "FloorConnection") {
                        return o.coordinates;
                      } else if (o.floorElement === "Services") {
                        return o.coordinates;
                      } else if (o.floorElement === "RestRooms") {
                        return o.coordinates;
                      } else {
                        // return o.coordinates
                      }
                    })
                  )
                ).map(id => {
                  return lists.find(a => a.coordinates === id);
                });
                let freeBeacon = uniqueLists.map(r=>{
                  if(r.floorElement === "Services"){
                    if(r.type === "Beacons" ){
                      return null
                    }else{
                      return r
                    }
                  }else{
                    return r
                  } 
                })
    
                let freeData = freeBeacon.filter( (el)=> {
                  return el != null;
                });
                freeData.sort((a, b)=> {
                  if(a.floorElement === "Rooms"){
                    if(a.roomName !== undefined){
                      return a.roomName < b.roomName ? -1 : (a.roomName > b.roomName ? 1 : 0);
                    }else{
                      return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
                    }
                  }else{
                    return a.type < b.type ? -1 : (a.type > b.type ? 1 : 0);
                  }
                });
                if (point === "srcBuildingLocation") {
                  this.setState({
                    srcFloorList: freeData
                  });
                } else if (point === "dstBuildingLocation") {
                  let me = this;
                  let srcLat = this.state.srcBuildingLocation.lat;
                  let srcLng = this.state.srcBuildingLocation.lng;
                  if (!srcLat && !srcLng){
                    srcLat = prevData.lat;
                    srcLng = prevData.lng;
                  }
    
                  map.fitBounds(
                    L.latLngBounds(
                      L.latLng(srcLat, srcLng),
                      L.latLng(flrListData[0].lat, flrListData[0].lng)
                    )
                  );
                  this.setState({
                    dstFloorList: freeData,
                    zoomLevel: "10"
                  });
                }
              });
            }
          );
        });
      };
    
      getVenueList = (coordinates = null) => {
        this.props.venueList(() => {
          this.setState(
            {
              venueList: this.props.vnList.data
            },
            () => {
              this.findNearVenue(coordinates);
            }
          );
        });
      };
    
      findNearVenue = coordinates => {
        let { venueList } = this.state;
        let distList = venueList.map(r => {
          return this.getDistance(coordinates, r);
        });
        let arr = [];
        let list = this.state.venueList.map((r, i) => {
          if (r.buildingList) {
            let dt = r.buildingList.map(k => {
              arr.push({
                venueName: r.venueName,
                buildingName: k,
                venueDistance: distList[i].distance
              });
              return {
                venueName: r.venueName,
                buildingName: k,
                venueDistance: distList[i].distance
              };
            });
            return dt;
          } else {
            arr.push({
              venueName: r.venueName,
              buildingName: "",
              venueDistance: distList[i].distance
            });
            return {
              venueName: r.venueName,
              buildingName: "",
              venueDistance: distList[i].distance
            };
          }
        });
        var lowest = Number.POSITIVE_INFINITY;
        var highest = Number.NEGATIVE_INFINITY;
        var tmp;
        let nearLocation;
        for (var i = distList.length - 1; i >= 0; i--) {
          tmp = distList[i].distance;
          if (tmp < lowest) {
            nearLocation = distList[i];
            lowest = tmp;
          }
          if (tmp > highest) highest = tmp;
        }
        let listArr = this.state.locationList.map(r => {
          let k = distList.map(d => {
            if (d.venueName === r.venueName) {
              return { r, distance: d.distance };
            }
          });
        });
        let sortedArr = this.quickSort(arr);
        if (lowest < 1) {
          this.setState(
            {
              currentVenue: nearLocation,
              locationList: arr
            },
            () => {
              this.getBuildingList(nearLocation.venueName, coordinates);
            }
          );
        } else {
          this.setState({
            currentVenue: {
              address: "",
              coordinates: [],
              dateCreated: "",
              distance: 2,
              id: 35,
              liveStatus: true,
              organization: "",
              venueName: ""
            },
            selectedLocation: { venueName: "Venue", buildingName: "Building" },
            locationList: arr,
            currentBuilding: {
              address: "",
              buildingName: "",
              coordinates: [],
              distance: 2,
              lat: 0,
              lng: 0
            }
          });
        }
      };
    
      quickSort = arr => {
        if (arr.length < 2) {
          return arr;
        }
        let pivot = arr[0];
        let lesserVal = [];
        let greaterVal = [];
        for (let k = 0; k < arr.length; k++) {
          if (arr[k].venueDistance < pivot.venueDistance) {
            lesserVal.push(arr[k]);
          } else {
            greaterVal.push(arr[k]);
          }
        }
      };
    
      getBuildingList = (venueName, coordinates) => {
        this.props.buildingList({ venueName: venueName }, () => {
          this.setState(
            {
              buildingList: this.props.bldList.data
            },
            () => {
              if (this.state.buildingList.length > 0) {
                this.findNearBuilding(coordinates);
              } else {
                this.setState({
                  selectedLocation: { venueName: venueName, buildingName: "" }
                });
              }
            }
          );
        });
      };
    
      findNearBuilding = coordinates => {
        let { buildingList } = this.state;
        let distList = buildingList.map(r => {
          let p = [r.lat, r.lng];
          r.coordinates = p;
          return this.getDistance(coordinates, r);
        });
        var lowest = Number.POSITIVE_INFINITY;
        var highest = Number.NEGATIVE_INFINITY;
        var tmp;
        let nearLocation;
        for (var i = distList.length - 1; i >= 0; i--) {
          tmp = distList[i].distance;
          if (tmp < lowest) {
            nearLocation = distList[i];
            lowest = tmp;
          }
          if (tmp > highest) highest = tmp;
        }
        if (lowest < 50) {
          this.setState(
            {
              currentBuilding: nearLocation,
              selectedLocation: {
                venueName: this.state.currentVenue.venueName,
                buildingName: nearLocation.buildingName
              }
            },
            () => {
              this.setNavigation(this.state.selectedLocation);
              this.fetchLocation(
                this.state.selectedLocation.venueName,
                this.state.selectedLocation.buildingName
              );
            }
          );
        }
      };
    
      rad = function(x) {
        return (x * Math.PI) / 180;
      };
    
      getDistance = function(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.coordinates[0] - p1[0]);
        var dLong = this.rad(p2.coordinates[1] - p1[1]);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(p1[0])) *
            Math.cos(this.rad(p2.coordinates[0])) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = (R * c) / 1000;
        p2.distance = d;
        return p2; // returns the distance in km
      };
    
      setNavigation = data => {
                                        // this.props.androidNavigation(data, () => {
                                    // })
        this.grids_all = [];
        this.props.getAllBuildingElements(data, () => {
          let nodes = this.props.navigationInfo;
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
          // if(this.state.srcfloor === this.state.dstfloor){
    
          this.setState({
            // canvasWidth: cvWidth,
            // canvasHeight: height_of_canvas,
            list: lists
          });
          // }
        });
      };
    
      toggle = (type, value) => event => {
        this.setState(state => {
          return {
            [type]: value
          };
        });
      };
    
      findFloor = (key, array) => {
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
    
      color_canvas_spl = (i, canvasid, color, srcfloorL) => {
    
        let { scale } = this.state;
    
        if(color === "red"){
          let srcDiv = document.getElementById("srcImage");
          let canvas = document.getElementById(canvasid);
          let context = canvas.getContext("2d");
    
          var wrh = this.state.dstfloorL / this.state.dstfloorB;
          var newWidth = this.state.canvasWidth;
          var newHeight = newWidth / wrh;
          if (newHeight > this.state.canvasHeight) {
            newHeight = this.state.canvasHeight;
            newWidth = newHeight * wrh;
          }
    
          let gpx,gpy;
          if(canvasid === "canvas0"){
            gpx = newWidth / this.state.srcfloorL;
            gpy = newHeight / this.state.srcfloorB;  
          }else{
            gpx = newWidth / this.state.dstfloorL;
            gpy = newHeight / this.state.dstfloorB;
          }
    
          let pos_x = gpx * (i % srcfloorL);
          let pos_y = gpy * parseInt(i / srcfloorL);
          context.fillStyle = color;
          // context.fillRect(pos_x, pos_y, scale, scale);  
          context.drawImage(srcDiv, pos_x, pos_y, 10, 10);
        }else if(color === "yellow"){
          let lift = document.getElementById("lift");
          let stairs = document.getElementById("stairs");
          let canvas = document.getElementById(canvasid);
          let context = canvas.getContext("2d");
          var wrh = this.state.dstfloorL / this.state.dstfloorB;
          var newWidth = this.state.canvasWidth;
          var newHeight = newWidth / wrh;
          if (newHeight > this.state.canvasHeight) {
            newHeight = this.state.canvasHeight;
            newWidth = newHeight * wrh;
          }
          
          let gpx,gpy;
    
          if(canvasid === "canvas0"){
            gpx = newWidth / this.state.srcfloorL;
            gpy = newHeight / this.state.srcfloorB;  
          }else{
            gpx = newWidth / this.state.dstfloorL;
            gpy = newHeight / this.state.dstfloorB;
          }
    
          let pos_x = gpx * (i % srcfloorL);
          let pos_y = gpy * parseInt(i / srcfloorL);
    
          var rot = (Math.PI / 2) * 3;
          var x = pos_x;
          var y = pos_y;
          var step = Math.PI / 5;
          let frConnType = "";
          let data = this.props.navigationInfo.map(r => {
            return r.properties;
          });
          for (let k = 0; k < data.length; k++) {
            if (data[k].node === i) {
              frConnType = data[k].type;
            }
          }
          if (frConnType === "Stairs") {
            var half_scale = scale / 2;
            pos_x = pos_x + half_scale;
            pos_y = pos_y + half_scale;
            context.drawImage(stairs, pos_x - 12.5, pos_y - 6.25, 25, 25);
          } else if (frConnType === "Lift") {
            var half_scale = scale / 2;
            pos_x = pos_x + half_scale;
            pos_y = pos_y + half_scale;
            context.drawImage(lift, pos_x - 12, pos_y + 6.25, 25, 25);
          }
           
        }else if(color === "green"){
          let dstDiv = document.getElementById("dstImage");
          let { scale } = this.state;
          let canvas = document.getElementById(canvasid);
          let context = canvas.getContext("2d");
    
          var wrh = this.state.dstfloorL / this.state.dstfloorB;
          var newWidth = this.state.canvasWidth;
          var newHeight = newWidth / wrh;
          if (newHeight > this.state.canvasHeight) {
            newHeight = this.state.canvasHeight;
            newWidth = newHeight * wrh;
          }
    
          let gpx,gpy;
          if(canvasid === "canvas0"){
            gpx = newWidth / this.state.srcfloorL;
            gpy = newHeight / this.state.srcfloorB;  
          }else{
            gpx = newWidth / this.state.dstfloorL;
            gpy = newHeight / this.state.dstfloorB;
          }
    
          let pos_x = gpx * (i % srcfloorL);
          let pos_y = gpy * parseInt(i / srcfloorL);
          context.fillStyle = color;
          // context.fillRect(pos_x, pos_y, scale, scale);  
          context.drawImage(dstDiv, pos_x, pos_y, 10, 10);
        }
      };
    
      
      color_canvas = (i, place, color) => {
        let srcDiv = document.getElementById("srcImage");
        let dstDiv = document.getElementById("dstImage");
        if (place === "srcmap") {
          let { srcfloorL, scale } = this.state;
          var canvas = document.getElementById("myCanvassrc");
          var context = canvas.getContext("2d");
          // let gpx = this.state.canvasWidth / this.state.srcfloorL;
          // let gpy = this.state.canvasHeight / this.state.srcfloorB;
    
          var wrh = this.state.srcfloorL / this.state.srcfloorB;
          var newWidth = this.state.canvasWidth;
          var newHeight = newWidth / wrh;
          if (newHeight > this.state.canvasHeight) {
            newHeight = this.state.canvasHeight;
            newWidth = newHeight * wrh;
          }
    
          let gpx = newWidth / this.state.srcfloorL;
          let gpy = newHeight / this.state.srcfloorB;
    
          var posX = gpx * (i % srcfloorL);
          var posY = gpy * parseInt(i / srcfloorL);
          var halfScale = scale / 2;
          posX = posX + halfScale;
          posY = posY + halfScale;
          if (color === "green") {
            var half_scale = scale / 2;
            posX = posX + half_scale;
            posY = posY + half_scale;
            context.globalAlpha = 1;
            context.drawImage(dstDiv, posX - 15, posY - 25, 12, 15);
          }else if(color === "#bdbdbd"){
            let { dstfloorL, scale } = this.state;
            var half_scale = scale / 2;
            posX = posX + half_scale;
            posY = posY + half_scale;
            context.fillStyle = color;
            context.globalAlpha = 1;
            context.fillRect(posX, posY, scale, scale);  
          } else {
            var half_scale = scale / 2;
            posX = posX + half_scale;
            posY = posY + half_scale;
            context.globalAlpha = 1;
            context.drawImage(srcDiv, posX-9,posY, 15, 15);
          }
        } else {
          let { dstfloorL, scale } = this.state;
          let canvas = document.getElementById("myCanvasdst");
          let context = canvas.getContext("2d");
          let posX = scale * (i % dstfloorL);
          let posY = scale * parseInt(i / dstfloorL);
          context.fillStyle = color;
          context.fillRect(posX, posY, scale, scale);
        }
      };
    
      find = (key, array) => {
        if (array !== undefined) {
          for (let i = 0; i < array.length; i++) {
            if (parseInt(array[i].node) === key) {
              return i;
            }
          }
        }
        return -1;
      };
    
      find_fl = (key, array) => {
        if (array !== undefined) {
          for (let i = 0; i < array.length; i++) {
            if (
              parseInt(array[i].node) === key &&
              array[i].floor == "floorconnection"
            ) {
              return i;
            }
          }
        }
        return -1;
      };
    
      handleSubmit = () => {
        let { srcVal, srcfloor, dstfloor, dstVal,dstfloorL,dstfloorB } = this.state;
        if (srcVal != null && dstVal != null) {
          var divimg = document.getElementById("mydiv1");
          var divcan = document.getElementById("mydiv");
          var len = divimg.childNodes.length;
          for (var i = 0; i < len; i++) {
            var elem = divimg.childNodes[0].remove();
          }
    
          len = divcan.childNodes.length;
          for (var i = 0; i < len; i++) {
            var elem = divcan.childNodes[0].remove();
          }
    
          if (srcfloor === dstfloor) {
            var cvWidth = document.getElementById("myCanvassrc").clientWidth;
            let ratio = cvWidth / dstfloorL;
            let height_of_canvas = ratio * dstfloorB;
            let factor = Math.ceil(parseInt(cvWidth) / dstfloorL);
    
            this.setState({
              samefloor: true,
              scale:factor
            });
            
            var img1 = new Image();
            var img = document.getElementById("myImage");
            img1.src = img.src;
            img1.hidden = true;
            var color_canvas = this.color_canvas;
            var me = this;
            var dest_x = this.state.dstVal % this.state.dstfloorL;
            var dest_y = parseInt(this.state.dstVal / this.state.dstfloorL);
            let imgDiv = document.getElementById("myImage");
            this.imgDiv = imgDiv;
            let angle = 0;
    
      // status of the pointer(s)
      let pointerangle;
    
            var canvas = window.d3.select("canvas").call(
                window.d3
                  .zoom()
                  .scaleExtent([1, 8])
                  .on("zoom", zoom)
              ),
              context = canvas.node().getContext("2d"),
              width = canvas.property("width"),
              height = canvas.property("height");
            var active = window.d3.select(null);
            var zoom1 = window.d3.zoom().on("zoom", zoom);
            var initialTransform = window.d3.zoomIdentity.translate(0, 0).scale(1);
            function zoom() {
              me.setState(
                {
                  animation: false,
                  // pathCaption: [],
                  pathFloor: [],
                  pathArray: [],
                  currentStep: 0,
                  zoom: true
                },
                () => {
                  var transform = window.d3.event.transform;
                  context.save();
                  context.clearRect(0, 0, width, height);
                  context.translate(transform.x, transform.y);
                  context.scale(transform.k, transform.k);
                  draw();
                  context.restore();
                }
              );
            }
            function draw() {
              if (active.node() === this) return reset();
              active.classed("active", false);
              active = window.d3.select(this).classed("active", true);
              var wrh = me.state.dstfloorL / me.state.dstfloorB;
              var newWidth = width;
              var newHeight = newWidth / wrh;
              if (newHeight > height) {
                newHeight = height;
                newWidth = newHeight * wrh;
              }
              context.rotate(angle);
              context.globalAlpha = 0.2;
              context.drawImage(
                img1,
                0,
                0,
                img1.width,
                img1.height,
                0,
                0,
                newWidth,
                newHeight
              );
              // me.loadNonwalkable("myCanvassrc")
              me.callwhile(
                me.state.srcfloor,
                me.state.srcVal,
                me.state.srcfloorL,
                me.state.srcfloorB,
                dest_x,
                dest_y,
                true,
                "myCanvassrc"
              );
              color_canvas(srcVal, "srcmap", "red");
              color_canvas(dstVal, "srcmap", "green");
            }
    
            function reset() {
              active.classed("active", false);
              active = window.d3.select(null);
              canvas
                .transition()
                .duration(750)
                .call(zoom1.transform, initialTransform);
            }
            function timer(ms) {
              return new Promise(res => setTimeout(res, ms));
            }
    
            function zoomTo() {
              let X = me.croppedRegion.maxX[0] - me.croppedRegion.minX[0];
              let Y = me.croppedRegion.maxY[1] - me.croppedRegion.minY[1];
              var wrh = me.state.dstfloorL / me.state.dstfloorB;
              var newWidth = width;
              var newHeight = newWidth / wrh;
              if (newHeight > height) {
                newHeight = height;
                newWidth = newHeight * wrh;
              }
              let gpx = newWidth / me.state.srcfloorL;
              let gpy = newHeight / me.state.srcfloorB;
              let scale = Math.min(width / (X * gpx), height / (Y * gpy));
              //Zoomed
              let distX =
                width / 2 - me.croppedRegion.minX[0] * gpx - (X / 2) * gpx;
              let distY =
                height / 2 - me.croppedRegion.minY[1] * gpy - (Y / 2) * gpy;
              var transform = window.d3.zoomIdentity.translate(distX, distY);
              // .scale(1.2)
              // .translate(-4*X,-4*Y)
              canvas
                .transition()
                .duration(750)
                .call(zoom1.transform, transform);
            }
            img1.onload = function() {
              draw();
              zoomTo();
            };
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
    
      loadNonwalkable = () => {
        let { srcVal, srcfloor, dstfloor, dstVal } = this.state;
        let navInfo = this.props.androidNav;
        let floorData = navInfo.filter(r=>{
          return r.floor === srcfloor
        })
        let polygons = floorData[0].properties.clickedPoints;
        for (let i = 0; i < polygons.length; i++) {
          let nodes = polygons[i].split(",");
          var start = nodes[0];
          for (let j = 1; j < nodes.length; j++) {
            this.oldpath(start, nodes[j]);
            this.color_canvas(start,"srcmap","#bdbdbd");
            start = nodes[j];
          }
          this.color_canvas(nodes[0],"srcmap", "#bdbdbd");
        }
      }
    
      loadMultiFloorNonwalkable = (id) => {
        let { srcVal, srcfloor, dstfloor, dstVal } = this.state;
        let navInfo = this.props.androidNav;
        let floorData
    
        if(id ===" canvas0"){
          floorData = navInfo.filter(r=>{
            return r.floor === srcfloor
          })
        }else{
          floorData = navInfo.filter(r=>{
            return r.floor === dstfloor
          })
        }
    
        let polygons = floorData[0].properties.clickedPoints;
        for (let i = 0; i < polygons.length; i++) {
          let nodes = polygons[i].split(",");
          var start = nodes[0];
          for (let j = 1; j < nodes.length; j++) {
            this.oldpathMulti(start, nodes[j],id);
            // this.color_canvas(start,"srcmap","#bdbdbd",id);
            start = nodes[j];
          }
          // this.color_canvas(nodes[0],"srcmap", "#bdbdbd",id);
        }
      }
    
      oldpath = (x, y) => {
        // x = coord_val  y=coord_val in normal
        var a, b, c, d, e, f, g;
        let { dstfloorL } = this.state;
    
        a = parseInt(x / dstfloorL);
        b = x % dstfloorL;
    
        c = parseInt(y / dstfloorL);
        d = y % dstfloorL;
    
        e = Math.floor((a + c) / 2);
        f = Math.floor((b + d) / 2);
        if ((e === a) & (f === b)) {
          g = dstfloorL * c + b;
          this.color_canvas(g,"srcmap","#bdbdbd");
        } else if ((e === c) & (f === d)) {
          g = dstfloorL * a + d;
          this.color_canvas(g,"srcmap","#bdbdbd");
        } else {
          g = dstfloorL * e + f;
          this.color_canvas(g,"srcmap","#bdbdbd");
          this.oldpath(g, x);
          this.oldpath(g, y);
        }
      };
    
      color = (i,color,canvasid)=>{
          let posX,posY,gpx,gpy
          if(canvasid === "canvas0"){
            let wrh = this.state.srcfloorL / this.state.srcfloorB;
            let newWidth = this.state.canvasWidth;
            let newHeight = newWidth / wrh;
            if (newHeight > this.state.canvasHeight) {
              newHeight = this.state.canvasHeight;
              newWidth = newHeight * wrh;
            }
      
            gpx = newWidth / this.state.srcfloorL;
            gpy = newHeight / this.state.srcfloorB;
      
            posX = gpx * (i % this.state.srcfloorL);
            posY = gpy * parseInt(i / this.state.srcfloorL);
          }else{
            let wrh = this.state.dstfloorL / this.state.dstfloorB;
            let newWidth = this.state.canvasWidth;
            let newHeight = newWidth / wrh;
            if (newHeight > this.state.canvasHeight) {
              newHeight = this.state.canvasHeight;
              newWidth = newHeight * wrh;
            }
      
            gpx = newWidth / this.state.dstfloorL;
            gpy = newHeight / this.state.dstfloorB;
      
            posX = gpx * (i % this.state.srcfloorL);
            posY = gpy * parseInt(i / this.state.srcfloorL);
          }
    
          let canvas1 = document.getElementById(canvasid);
          let context1 = canvas1.getContext("2d");
          context1.fillStyle = color;
          context1.fillRect(posX, posY, 5, 5);  
      }
    
      oldpathMulti = (x, y,id) => {
        var a, b, c, d, e, f, g;
        let { dstfloorL } = this.state;
    
        a = parseInt(x / dstfloorL);
        b = x % dstfloorL;
    
        c = parseInt(y / dstfloorL);
        d = y % dstfloorL;
    
        e = Math.floor((a + c) / 2);
        f = Math.floor((b + d) / 2);
        if ((e === a) & (f === b)) {
          g = dstfloorL * c + b;
          this.color(g,"#bdbdbd",id);
        } else if ((e === c) & (f === d)) {
          g = dstfloorL * a + d;
          this.color(g,"#bdbdbd",id);
        } else {
          g = dstfloorL * e + f;
          this.color(g,"#bdbdbd",id);
          this.oldpathMulti(g, x,id);
          this.oldpathMulti(g, y,id);
        }
      };
    
      findpath() {
        var srcvert =
          this.state.srcfloor + "," + this.state.srcVal + "," + "virtual";
        var dstvert =
          this.state.dstfloor + "," + this.state.dstVal + "," + "virtual";
        if (this.graph.hasvertex(srcvert)) {
        } else {
          this.graph.addVertex(srcvert);
          let nodes = this.props.navigationInfo;
          this.flrconn = [];
          for (var i = 0; i < nodes.length; i++) {
            if (
              nodes[i].properties.floor == this.state.srcfloor &&
              nodes[i].properties.floorElement === "FloorConnection"
            ) {
              var coord = nodes[i].properties.coordinates.split(",");
              var vert = nodes[i].properties.floor + "," + nodes[i].properties.node;
              this.flrconn.push([coord[0], coord[1], vert]);
            }
          }
          this.callwhile(
            this.state.srcfloor,
            this.state.srcVal,
            this.state.srcfloorL,
            this.state.srcfloorB,
            null,
            null,
            false,
            null
          );
        }
    
        if (this.graph.hasvertex(dstvert)) {
        } else {
          this.graph.addVertex(dstvert);
          let nodes = this.props.navigationInfo;
          this.flrconn = [];
          for (var i = 0; i < nodes.length; i++) {
            if (
              nodes[i].properties.floor === this.state.dstfloor &&
              nodes[i].properties.floorElement == "FloorConnection"
            ) {
              var coord = nodes[i].properties.coordinates.split(",");
              var vert = nodes[i].properties.floor + "," + nodes[i].properties.node;
              this.flrconn.push([coord[0], coord[1], vert]);
            }
          }
          this.callwhile(
            this.state.dstfloor,
            this.state.dstVal,
            this.state.dstfloorL,
            this.state.dstfloorB,
            null,
            null,
            false,
            null
          );
        }
        this.specialcallwhile(
          this.state.srcfloor,
          srcvert,
          this.state.dstfloor,
          dstvert
        );
      }
    
      specialcallwhile(srcfloor, srcvert, dstfloor, dstvert) {
        var min = Number.MAX_VALUE;
        var minleave = null;
        var var_i;
        var notthere;
        let shortestpath = new Map();
        let visited = new Map();
        let minimumcost = new Map();
        let leaves = [];
        var get_keys = this.graph.AdjList.keys();
        for (var i of get_keys) {
          minimumcost.set(i, min);
          visited.set(i, false);
        }
    
        leaves.push(srcvert);
        shortestpath.set(srcvert, [srcvert]);
        minimumcost.set(srcvert, 0);
        this.graph.printGraph();
        while (leaves.length > 0) {
          min = Number.MAX_VALUE;
          for (let i = 0; i < leaves.length; i++) {
            if (min > minimumcost.get(leaves[i])) {
              min = minimumcost.get(leaves[i]);
              minleave = leaves[i];
              var_i = i;
            }
          }
          visited.set(minleave, true);
    
          if (minleave === dstvert) {
            // alert(" i "+JSON.stringify(shortestpath.get(dstvert)));
            break;
          }
          leaves.splice(var_i, 1);
          var get_values = this.graph.AdjList.get(minleave);
          var get_dist = this.graph.Adjweights.get(minleave);
          for (var jj = 0; jj < get_values.length; jj++) {
            var j = get_values[jj];
            var l = j.split(",");
    
            var neighbour = false;
            if (l.length == 2) {
              neighbour = true;
            } else if (l.length == 3) {
              if (j == dstvert) {
                neighbour = true;
              }
            }
            if (visited.get(j) == false && neighbour) {
              if (minimumcost.get(j) > minimumcost.get(minleave) + get_dist[jj]) {
                minimumcost.set(j, minimumcost.get(minleave) + get_dist[jj]);
                var dum = [];
                dum = shortestpath.get(minleave);
                dum = dum.concat([j]);
                shortestpath.set(j, dum);
                notthere = 1;
                for (var p = 0; p < leaves.length; p++) {
                  if (leaves[p] == j) {
                    notthere = 0;
                  }
                }
                if (notthere == 1) {
                  leaves.push(j);
                }
              }
            }
          }
        }
        this.createcanvas(shortestpath.get(dstvert), false);
      }
      createcanvas(list, samefloor) {
        if (samefloor === false) {
          let ans = new Map();
          for (var i = 0; i < list.length; i++) {
            var e = list[i].split(",");
    
            if (ans.has(e[0])) {
              ans.get(e[0]).push(e[1]);
            } else {
              ans.set(e[0], [e[1]]);
            }
          }
          var get_keys = ans.keys();
          let clist = [];
          let floorLlist = [];
          var cnt = 0;
          for (var i of get_keys) {
            var ind1 = this.findFloor(i, this.props.flrList);
            var ind = this.findFloor(i, this.grids_all);
            floorLlist.push(this.grids_all[ind].properties.length);
            clist.push({
              id: cnt,
              scale: 10,
              floorL: this.grids_all[ind].properties.length,
              floorB: this.grids_all[ind].properties.breadth,
              fileName: this.grids_all[ind].properties.fileName,
              floor: this.grids_all[ind].properties.floor
            });
            cnt++;
          }
          this.setState({
            canvaslist: clist
          });
          this.callimage(0, ans, cnt, clist, floorLlist);
        }
      }
    
      callmark(ans, floorLlist) {
        var get_keys = ans.keys();
        var cnt = 0;
        for (var i of get_keys) {
          var canvasid = "canvas" + cnt;
          var get_val = ans.get(i);
          for (var j of get_val) {
            this.color_canvas_spl(j, canvasid, "blue", floorLlist[cnt]);
          }
          cnt++;
        }
      }
    
      callimage(cnt, ans, count, clist, floorLlist) {
        let floorList = [this.state.srcfloor, this.state.dstfloor];
        for (let jj = 0; jj < floorList.length; jj++) {
          for (let ii = 0; ii < clist.length; ii++) {
            if (floorList[jj] === clist[ii].floor) {
              let i = clist[ii].floor;
              let ind = this.findFloor(i, this.props.fList);
              let ratio = this.state.canvasWidth / clist[ii].floorL;
              let height_of_canvas = ratio * clist[ii].floorB;
              let dsp;
              if (clist[ii].floor === this.state.dstfloor) {
                dsp = "none";
              } else {
                dsp = "block";
              }
              let canvas = window.d3
                .select("#mydiv")
                .append("canvas")
                .attr("id", "canvas" + ii)
                .attr("style", `border:1px solid;display:${dsp};`)
                .attr("width", this.state.canvasWidth)
                .attr("height", this.state.canvasHeight)
                .call(
                  window.d3
                    .zoom()
                    .scaleExtent([1, 8])
                    .on("zoom", multiCanvasZoom)
                );
    
              let width = canvas.property("width");
              let height = canvas.property("height");
              let active = window.d3.select(null);
              let zoom1 = window.d3.zoom().on("zoom", multiCanvasZoom);
              let initialTransform = window.d3.zoomIdentity
                .translate(0, 0)
                .scale(1);
              let ctx = canvas.node().getContext("2d");
              let div = document.getElementById("mydiv1");
              let img1 = new Image();
              img1.src = `${config.imgUrl}/${clist[ii].fileName}`;
    
              img1.hidden = true;
              div.appendChild(img1);
              let me = this;
              let get_val = ans.get(i);
              let loaded = false;
              img1.onload = function() {
                multiCanvas();
                zoomTo()
              };
    
              function multiCanvasZoom() {
                me.setState(
                  {
                    zoom: true,
                    // pathCaption: []
                  },
                  () => {
                    var transform = window.d3.event.transform;
                    ctx.save();
                    ctx.clearRect(0, 0, width, height);
                    ctx.translate(transform.x, transform.y);
                    ctx.scale(transform.k, transform.k);
                    loaded = false;
                    multiCanvas();
                    ctx.restore();
                  }
                );
              }
    
              function multiCanvas() {
                if (loaded === false) {
                  var wrh = me.state.dstfloorL / me.state.dstfloorB;
                  var newWidth = width;
                  var newHeight = newWidth / wrh;
                  if (newHeight > height) {
                    newHeight = height;
                    newWidth = newHeight * wrh;
                  }
                  ctx.globalAlpha = 0.2;
    
                  ctx.drawImage(
                    img1,
                    0,
                    0,
                    img1.width,
                    img1.height,
                    0,
                    0,
                    newWidth,
                    newHeight
                  );
                  var id = "canvas" + ii;
                  // me.loadMultiFloorNonwalkable(id)
                  var index = me.findFloor(i, me.grids_all);
                  var m = parseInt(me.grids_all[index].properties.length);
                  var n = parseInt(me.grids_all[index].properties.breadth);
                  for (var j = 0; j < get_val.length - 1; j++) {
                    var dest_x = get_val[j + 1] % m;
                    var dest_y = parseInt(get_val[j + 1] / m);
                    me.callwhile(i, get_val[j], m, n, dest_x, dest_y, true, id);
                  }
                  var node_count = 0;
                  for (var j of get_val) {
                    if (ii === count - 1) {
                      if (node_count === get_val.length - 1) {
                        me.color_canvas_spl(j, id, "green", floorLlist[ii]);
                      } else {
                        me.color_canvas_spl(j, id, "yellow", floorLlist[ii]);
                      }
                    } else {
                      if (node_count === 0 && ii === 0) {
                        me.color_canvas_spl(j, id, "red", floorLlist[ii]);
                      } else {
                        me.color_canvas_spl(j, id, "yellow", floorLlist[ii]);
                      }
                    }
                    node_count++;
                  }
                  loaded = true;
                }
              }
    
              function zoomTo() {
                let X = me.croppedRegion.maxX[0] - me.croppedRegion.minX[0];
                let Y = me.croppedRegion.maxY[1] - me.croppedRegion.minY[1];
                var wrh = me.state.dstfloorL / me.state.dstfloorB;
                var newWidth = width;
                var newHeight = newWidth / wrh;
                if (newHeight > height) {
                  newHeight = height;
                  newWidth = newHeight * wrh;
                }
                let gpx = newWidth / me.state.srcfloorL;
                let gpy = newHeight / me.state.srcfloorB;
                let scale = Math.min(width / (X * gpx), height / (Y * gpy));
                //Zoomed
                let distX =
                  width / 2 - me.croppedRegion.minX[0] * gpx - (X / 2) * gpx;
                let distY =
                  height / 2 - me.croppedRegion.minY[1] * gpy - (Y / 2) * gpy;
                var transform = window.d3.zoomIdentity.translate(distX, distY);
                // .scale(1.2)
                // .translate(-4*X,-4*Y)
                canvas
                  .transition()
                  .duration(750)
                  .call(zoom1.transform, transform);
              }
            }
          }
        }
      }
    
      callwhile(srcfloor, srcVal, m, n, dest_x, dest_y, single, canvasid) {
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
          let { scale } = this.state;
    
          var wrh = this.state.dstfloorL / this.state.dstfloorB;
          var newWidth = this.state.canvasWidth;
          var newHeight = newWidth / wrh;
          if (newHeight > this.state.canvasHeight) {
            newHeight = this.state.canvasHeight;
            newWidth = newHeight * wrh;
          }
          let gpx,gpy;
          if(canvasid === "canvas0"){
            gpx = newWidth / this.state.srcfloorL;
            gpy = newHeight / this.state.srcfloorB;  
          }else{
            gpx = newWidth / this.state.dstfloorL;
            gpy = newHeight / this.state.dstfloorB;
          }
    
          var canvas = document.getElementById(canvasid);
          var context = canvas.getContext("2d");
    
          if (canvas !== null) {
            var context = canvas.getContext("2d");
          }
    
          let sp = this.shortestpath[dest_x][dest_y];
    
          let mypoints = sp.map(r => {
            return { x: r[0], y: r[1] };
          });
          var refinedpaths = this.simplifyPath(mypoints, 2);
          let allElements = this.props.navigationInfo;
          let allNodes = [];
          for (let i = 0; i < allElements.length; i++) {
            allNodes.push(allElements[i].properties);
          }
          // if (
          //   this.state.srcBuildingLocation.venueName ===
          //     this.state.dstBuildingLocation.venueName &&
          //   this.state.srcBuildingLocation.buildingName ===
          //     this.state.dstBuildingLocation.buildingName
          // ) {
    
            // if (this.state.zoom === false) {
              if(canvasid === "canvas0" || "myCanvassrc"){
                this.findInstructions(sp, refinedpaths, allElements, srcfloor);
              }else{
                this.findInstructions(sp, refinedpaths, allElements, this.state.dstfloor);
              }
            // }
            // this.findInstructions(sp, refinedpaths, allNodes, srcfloor);
          // } else if (this.state.dstBuildingLocation) {
          //   this.findInstructions(sp, refinedpaths, allNodes, srcfloor);
          // }
          
          var rowX = this.shortestpath[dest_x][dest_y].map(function(row, i) {
            return { x: row[0], index: i };
          });
          var rowY = this.shortestpath[dest_x][dest_y].map(function(row, i) {
            return { y: row[1], index: i };
          });
          let minRowX = rowX.reduce((prev, current) =>
            prev.x < current.x ? prev : current
          );
          let maxRowX = rowX.reduce((prev, current) =>
            prev.x > current.x ? prev : current
          );
          let minRowY = rowY.reduce((prev, current) =>
            prev.y < current.y ? prev : current
          );
          let maxRowY = rowY.reduce((prev, current) =>
            prev.y > current.y ? prev : current
          );
    
          this.croppedRegion = {
            minX: [minRowX.x, rowY[minRowX.index].y],
            maxX: [maxRowX.x, rowY[maxRowX.index].y],
            minY: [rowX[minRowY.index].x, minRowY.y],
            maxY: [rowX[maxRowY.index].x, maxRowY.y]
          };
          // var max = Math.max.apply(null, maxRow);
          this.setState({
            pathPoints:this.shortestpath[dest_x][dest_y]
          })    
          for (var i = 0; i < this.shortestpath[dest_x][dest_y].length; i = i + 4) {
            context.globalAlpha = 1;
            context.beginPath();
            var half_scale = scale / 2;
            var pos_x = gpx * this.shortestpath[dest_x][dest_y][i][0];
            var pos_y = gpy * this.shortestpath[dest_x][dest_y][i][1];
            pos_x = pos_x + half_scale;
            pos_y = pos_y + half_scale;
            context.arc(pos_x, pos_y, scale, 0, 2 * Math.PI);
            context.fill();
            context.fillStyle = "#2d9cdb";
            context.strokeStyle = "#2d9cdb";
            context.stroke();
          }
          this.reset_var();
        }
      }
    
      interpolatePath = (turningPointsPath, seperationGap, gpx, gpy) => {
        let resultpath = [];
        if (turningPointsPath.length === 1) {
          resultpath.push(turningPointsPath.x * gpx, turningPointsPath.x * gpx);
          return resultpath;
        }
        for (let i = 0; i < turningPointsPath.length - 1; i++) {
          let points = this.interpolatePoints(
            turningPointsPath[i],
            turningPointsPath[i + 1],
            seperationGap,
            gpx,
            gpy
          );
          for (let k = 0; k < points.length; k++) {
            resultpath.push(points[k]);
          }
          // resultpath.push(this.interpolatePoints(turningPointsPath[i],turningPointsPath[i+1], seperationGap, gpx, gpy));
        }
        return resultpath;
      };
    
      interpolatePoints(p1, p2, seperationGap, gpx, gpy) {
        let d = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        let result = [];
        result.push({ x: parseInt(p1.x), y: parseInt(p1.y) });
        let counter = seperationGap;
        while (counter < d) {
          let x = p1.x + (counter / d) * (p2.x - p1.x);
          let y = p1.y + (counter / d) * (p2.y - p1.y);
          result.push({ x: parseInt(x), y: parseInt(y) });
          counter += 1 * seperationGap;
        }
        return result;
      }
    
      simplifyPath = (points, tolerance) => {
        // helper classes
        var Vector = function(x, y) {
          this.x = x;
          this.y = y;
        };
        var Line = function(p1, p2) {
          this.p1 = p1;
          this.p2 = p2;
          this.distanceToPoint = function(point) {
            // slope
            var m = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x),
              // y offset
              b = this.p1.y - m * this.p1.x,
              d = [];
            // distance to the linear equation
            d.push(
              Math.abs(point.y - m * point.x - b) / Math.sqrt(Math.pow(m, 2) + 1)
            );
            // distance to p1
            d.push(
              Math.sqrt(
                Math.pow(point.x - this.p1.x, 2) + Math.pow(point.y - this.p1.y, 2)
              )
            );
            // distance to p2
            d.push(
              Math.sqrt(
                Math.pow(point.x - this.p2.x, 2) + Math.pow(point.y - this.p2.y, 2)
              )
            );
            // return the smallest distance
            return d.sort(function(a, b) {
              return a - b; //causes an array to be sorted numerically and ascending
            })[0];
          };
        };
    
        var douglasPeucker = function(points, tolerance) {
          if (points.length <= 2) {
            return [points[0]];
          }
          var returnPoints = [],
            // make line from start to end
            line = new Line(points[0], points[points.length - 1]),
            // find the largest distance from intermediate poitns to this line
            maxDistance = 0,
            maxDistanceIndex = 0,
            p;
          for (var i = 1; i <= points.length - 2; i++) {
            var distance = line.distanceToPoint(points[i]);
            if (distance > maxDistance) {
              maxDistance = distance;
              maxDistanceIndex = i;
            }
          }
          // check if the max distance is greater than our tollerance allows
          if (maxDistance >= tolerance) {
            p = points[maxDistanceIndex];
            line.distanceToPoint(p, true);
            // include this point in the output
            returnPoints = returnPoints.concat(
              douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance)
            );
            // returnPoints.push( points[maxDistanceIndex] );
            returnPoints = returnPoints.concat(
              douglasPeucker(
                points.slice(maxDistanceIndex, points.length),
                tolerance
              )
            );
          } else {
            // ditching this point
            p = points[maxDistanceIndex];
            line.distanceToPoint(p, true);
            returnPoints = [points[0]];
          }
          return returnPoints;
        };
        var arr = douglasPeucker(points, tolerance);
        // always have to push the very last point on so it doesn't get left off
        arr.push(points[points.length - 1]);
        return arr;
      };
    
      find_angle = (p0, p1, c) => {
        var p0c = { x: c.x - p0.x, y: c.y - p0.y }; // p0->c (b)
        var cp1 = { x: p1.x - c.x, y: p1.y - c.y }; // p1->c (a)
        return (
          (Math.atan2(
            cp1.y * p0c.x - cp1.x * p0c.y,
            p0c.x * cp1.x + p0c.y * cp1.y
          ) *
            180) /
          Math.PI
        );
      };
    
      //Module for finding the direction's equivalent commands
    
      findDirectionword = angle => {
        if (angle >= 75 && angle <= 105) return "Turn Right";
    
        if (angle <= -75 && angle >= -105) return "Turn Left";
    
        if ((angle >= 165 && angle <= 180) || (angle <= -165 && angle >= -180))
          return "Go Straight";
        if (angle < 0) {
          if (Math.round((360 + angle) / 30) === 9) {
            return "Turn Left";
          }
          return "Turn " + Math.round((360 + angle) / 30) + " O' Clock";
        }
    
        if (Math.floor(angle / 30) === 3) return "Turn Right";
        return "Turn " + Math.round(angle / 30) + " O' Clock";
      };
    
      // find the error component in the iteration and leaves it for the next iteration
      findErrorInAngle = angle => {
        if (angle < 0) return 360 + angle - Math.round((360 + angle) / 30) * 30;
        return angle - Math.round(angle / 30) * 30;
      };
      //same as above but in abbreviated form
    
      findDirectionAbbreviation = angle => {
        if (angle > 0) return "Right";
    
        return "Left";
      };
    
      findInstructions = (nonRefinedPoints, refinedPoints, mapElements, floor) => {
        //length of refined and non refined paths
        var nRefined = refinedPoints.length;
        var nNonRefined = nonRefinedPoints.length;
        //converting the mapElements to ordered map for ease of access
        var ElementMap = new Map();
        var includedSet = new Set();
        var word;
        //for iteration purpose
        var currentNRPoint = 0;
        var currentRPoint = 0;
        var flagList = [];
        var i = 0;
        var j = 0;
        //radius defines what range to cover in a path
        var radius = 3;
    
        //adding the elements to map
        for (i = 0; i < mapElements.length; i++) {
          let props = mapElements[i].properties;
          if (props.floorElement === "Rooms") {
            if (
              props.floor === floor &&
              props.roomName !== "undefined" &&
              props.coordinates !== undefined
            ){
              Object.keys(props).map(id => {
                if(id === 'roomName'){
                  props[`name`] = [...props[id]].join('');
                  delete props[id];  
                }
              });
    
              ElementMap.set(props.coordinates.replace(",", "@"), mapElements[i].properties);
            }
          } else if (props.floorElement === "FloorConnection") {
            if (
              props.floor === floor &&
              props.name !== "undefined" &&
              props.coordinates !== undefined
            ){
              ElementMap.set(props.coordinates.replace(",", "@"), props);
            }
          } else if (props.floorElement === "Services") {
            if (
              props.floor === floor &&
              props.name !== "undefined" &&
              props.coordinates !== undefined
            )
              ElementMap.set(props.coordinates.replace(",", "@"), mapElements[i].properties);
          } else if (props.floorElement === "RestRooms") {
            if (
              props.floor === floor &&
              props.name !== "undefined" &&
              props.coordinates !== undefined
            )
              ElementMap.set(props.coordinates.replace(",", "@"), mapElements[i].properties);
          } else {
          }
        }
        //finding the indices of the
        while (currentNRPoint < nNonRefined && currentRPoint < nRefined) {
          if (
            nonRefinedPoints[currentNRPoint][0] ===
              refinedPoints[currentRPoint].x &&
            nonRefinedPoints[currentNRPoint][1] === refinedPoints[currentRPoint].y
          ) {
            flagList.push(currentNRPoint);
            currentRPoint++;
          }
          currentNRPoint++;
        }
    
        // Generating the direction and elaborated results
        var DirectionResults = [];
        var ElaboratedResults = [];
    
        //entry point insertion to the list
        DirectionResults.push(
          "You are at " +
            ElementMap.get("" + refinedPoints[0].x + "@" + refinedPoints[0].y)
              .name
        );
        ElaboratedResults.push(
          "You are at " +
            ElementMap.get("" + refinedPoints[0].x + "@" + refinedPoints[0].y)
              .name
        );
        includedSet.add(refinedPoints[0].x + "@" + refinedPoints[0].y);
        includedSet.add(
          refinedPoints[nRefined - 1].x + "@" + refinedPoints[nRefined - 1].y
        );
        //iterate and /finding the desired results
        var error = 0;
        for (currentRPoint = 0; currentRPoint < nRefined - 1; currentRPoint++) {
          var angle = 0;
          var coordinates;
          // this.actualAngle = 155
          if (currentRPoint === 0) {
            angle = this.find_angle(
              {
                x: refinedPoints[currentRPoint].x,
                y: refinedPoints[currentRPoint].y + 1
              },
              refinedPoints[currentRPoint + 1],
              refinedPoints[currentRPoint]
            );
            let path_angle = angle;
            let floorangle = this.state.floorAngle;
            let diff = 360 - floorangle;
            // let CurrentDirection = 60;
            let CurrentDirection = this.actualAngle;
            // rotateDirection
            this.setState({
              pathAngle:path_angle
            })
    
            let gn = this.calculatePath(path_angle, diff, CurrentDirection);
    
            angle = gn;

          } else
            angle = this.find_angle(
              refinedPoints[currentRPoint - 1],
              refinedPoints[currentRPoint + 1],
              refinedPoints[currentRPoint]
            );
          angle = angle + error;
    
          error = this.findErrorInAngle(angle);
          if (currentRPoint == nRefined - 2) {
            word = this.findDirectionword(angle);
            DirectionResults.push(word);
            DirectionResults.push(
              "Move " +
                Math.round(
                  0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint])
                ) +
                " steps forward"
            );
            ElaboratedResults.push(word);
            ElaboratedResults.push(
              "Move " +
                Math.round(
                  0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint])
                ) +
                " steps forward"
            );
            DirectionResults.push(
              "You are about to reach:" +
                ElementMap.get(
                  refinedPoints[nRefined - 1].x +
                    "@" +
                    refinedPoints[nRefined - 1].y
                ).name +
                " on your " +
                this.findDirectionAbbreviation(angle)
            );
            ElaboratedResults.push(
              "You are about to reach:" +
                ElementMap.get(
                  refinedPoints[nRefined - 1].x +
                    "@" +
                    refinedPoints[nRefined - 1].y
                ).name +
                " on your " +
                this.findDirectionAbbreviation(angle)
            );
            break;
          }
          word = this.findDirectionword(angle);
          DirectionResults.push(word);
          DirectionResults.push(
            "Move " +
              Math.round(
                0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint])
              ) +
              " steps forward"
          );
          ElaboratedResults.push(word);
          ElaboratedResults.push(
            "Move " +
              Math.round(
                0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint])
              ) +
              " steps forward"
          );
    
          //this part of code handles the intermediate importatnt rooms
          var begin = flagList[currentRPoint] + 1;
          var end = flagList[currentRPoint + 1];
    
          while (begin < end) {
            var currpoint = nonRefinedPoints[begin];
            for (
              i = Math.max(0, currpoint[0] - radius);
              i < currpoint[0] + radius;
              i++
            ) {
              for (
                j = Math.max(0, currpoint[1] - radius);
                j < currpoint[1] + radius;
                j++
              ) {
                if (!includedSet.has(i + "@" + j) && ElementMap.has(i + "@" + j)) {
                  var tempAngle = this.find_angle(
                    {
                      x: nonRefinedPoints[begin - 1][0],
                      y: nonRefinedPoints[begin - 1][1]
                    },
                    { x: i, y: j },
                    { x: nonRefinedPoints[begin][0], y: nonRefinedPoints[begin][1] }
                  );
                  ElaboratedResults.push(
                    ElementMap.get(i + "@" + j).roomName +
                      " on your " +
                      this.findDirectionAbbreviation(tempAngle)
                  );
                  includedSet.add(i + "@" + j);
                }
              }
            }
            begin++;
          }
        }
    
        DirectionResults.push(
          "You will reach " +
            ElementMap.get(
              "" +
                refinedPoints[nRefined - 1].x +
                "@" +
                refinedPoints[nRefined - 1].y
            ).name
        );
        // "You have reached " +
        //   ElementMap.get(
        //     "" +
        //       refinedPoints[nRefined - 1].x +
        //       "@" +
        //       refinedPoints[nRefined - 1].y
        //   ).roomName
    
        ElaboratedResults.push(
          "You have reached " +
            ElementMap.get(
              "" +
                refinedPoints[nRefined - 1].x +
                "@" +
                refinedPoints[nRefined - 1].y
            ).name
        );
        let resultMap = DirectionResults.map(r => {
          return { instruction: r, floor: floor };
        });
        resultMap.forEach(element => {
          this.setState(prevState => ({
            pathFloor: [...prevState.pathFloor, element]
          }));
        });
        let step = DirectionResults[0];
        if(this.state.srcfloor === this.state.dstfloor){
          if(this.state.zoom === false){
          this.setState(
            prevState => ({
              pathArray: [...prevState.pathArray, DirectionResults],
              srtdFlr: [...prevState.srtdFlr, floor],
              instructionReady:true
    
            }),
            () => {
              let flrArry = [this.state.srcfloor, this.state.dstfloor];
              if (this.state.pathArray.length === 2) {
                for (let k = 0; k < flrArry.length; k++) {
                  if (this.state.srtdFlr[k] === flrArry[k]) {
                    const merge3 = this.state.pathArray.flat(1);
                    this.setState({
                      pathCaption: merge3
                    });
                  }
                }
              } else {
                for (let k = 0; k < DirectionResults.length; k++) {
                  this.setState(prevState => ({
                    pathCaption: [...prevState.pathCaption, DirectionResults[k]]
                  }));
                }
              }
            }
          );
        }
    
        }else{
            if(this.state.srcfloor === floor){
              this.setState({
                firstFlrInstruction:DirectionResults,
                firstFlr:floor,
                currentFloor:floor,
                // instructionReady:true
              })
            }else{
              this.setState({
                secondFlrInstruction:DirectionResults,
                secondFlr:floor,
                instructionReady:true
              })
            }
        }
          
      };
    
      calculatePath = (path_angle, diff, CurrentDirection) => {
        let pathGN, rotateDirection, path_angleN;
        if (path_angle >= 0 && path_angle < 106) {
          pathGN = 360 - (diff - path_angle);
          rotateDirection = pathGN - CurrentDirection;
        } else if (path_angle > 105 && path_angle <= 180) {
          pathGN = path_angle - diff;
          rotateDirection = pathGN - CurrentDirection;
        } else if (path_angle <= -1 && path_angle >= -180) {
          path_angleN = 180 + path_angle;
          pathGN = path_angleN + 180 - diff;
          rotateDirection = pathGN - CurrentDirection;
        }
        return rotateDirection;
      };
    
      reset_var() {
        this.grids = [];
        this.visited = [];
        this.shortestpath = [];
        this.minimumcost = [];
        this.leaves = [];
      }
    
      /* NAVIGATION DRAWER */
      drawerToggleClickHandler = () => {
        this.setState(prevState => {
          return { sideDrawerOpen: !prevState.sideDrawerOpen };
        });
      };
    
      backdropClickHandler = () => {
        this.setState({ sideDrawerOpen: false });
      };
      incCanvas = () => {
        let { scale } = this.state;
        if (scale < 30) {
          this.setState(
            {
              scale: scale + 1
            },
            () => {
              this.handleSubmit();
            }
          );
        }
      };
      decCanvas = () => {
        let { scale } = this.state;
        if (scale > 2) {
          this.setState(
            {
              scale: scale - 1
            },
            () => {
              this.handleSubmit();
            }
          );
        }
      };
    
      handleDstChange = e => {
        let name = null;
        let val = null;
        let floor = null;
        let resp = "";
        let navInfo = this.props.navigationInfo;
        if (e.length > 0) {
          for (let i = 0; i < navInfo.length; i++) {
            if (e[0].floorElement === "Rooms") {
              resp = `${e[0].roomName}(${e[0].floor})`;
              if (e[0].node === navInfo[i].properties.node) {
                name = navInfo[i].properties.roomName;
                floor = navInfo[i].properties.floor;
                val = navInfo[i].properties.node;
              }
            } else if (e[0].floorElement === "FloorConnection") {
              if (e[0].node === navInfo[i].properties.node) {
                name = navInfo[i].properties.name;
                floor = navInfo[i].properties.floor;
                val = navInfo[i].properties.node;
              }
              resp = `${e[0].name}(${e[0].floor})`;
            } else if (e[0].floorElement === "Services") {
              if (e[0].node === navInfo[i].properties.node) {
                name = navInfo[i].properties.type;
                floor = navInfo[i].properties.floor;
                val = navInfo[i].properties.node;
              }
              resp = `${e[0].type}(${e[0].floor})`;
            } else if (e[0].floorElement === "RestRooms") {
              if (e[0].node === navInfo[i].properties.node) {
                name = navInfo[i].properties.type;
                floor = navInfo[i].properties.floor;
                val = navInfo[i].properties.node;
              }
              resp = `${e[0].type} Washroom (${e[0].floor})`;
            } else {
            }
          }
          var ind = this.findFloor(floor, this.props.flrList.data);
          this.setState(
            {
              dstName: name,
              dstfloor: floor,
              dstVal: parseInt(val),
              dstfloorL: this.props.flrList.data[ind].floorL,
              dstfloorB: this.props.flrList.data[ind].floorB,
              imgName: this.props.flrList.data[ind].fileName,
              buildingView: true,
              showDstMenu: false,
              dstReadOnly: true,
              pathCaption: [],
              selectedLocation: `${name},${floor} floor, ${this.state.dstBuildingLocation.buildingName}, ${this.state.dstBuildingLocation.venueName}`
            },
            () => {
              this.handleSubmit();
            }
          );
        }
      };
    
      dstChange = e => {
        let name = null;
        let val = null;
        let floor = null;
        let resp = "";
        let navInfo = this.props.navigationInfo;
        for (let i = 0; i < navInfo.length; i++) {
          if (e.floorElement === "Rooms") {
            resp = `${e.roomName}(${e.floor})`;
            if (e.node === navInfo[i].properties.node) {
              name = navInfo[i].properties.roomName;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
          } else if (e.floorElement === "FloorConnection") {
            if (e.node === navInfo[i].properties.node) {
              name = navInfo[i].properties.name;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
            resp = `${e.name}(${e.floor})`;
          } else if (e.floorElement === "Services") {
            if (e.node === navInfo[i].properties.node) {
              name = navInfo[i].properties.type;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
            resp = `${e.type}(${e.floor})`;
          } else if (e.floorElement === "RestRooms") {
            if (e.node === navInfo[i].properties.node) {
              name = navInfo[i].properties.type;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
            resp = `${e.type} Washroom (${e.floor})`;
          } else {
          }
        }
        var ind = this.findFloor(floor, this.props.flrList.data);
        this.setState(
          {
            dstName: name,
            dstfloor: floor,
            dstVal: parseInt(val),
            dstfloorL: this.props.flrList.data[ind].floorL,
            dstfloorB: this.props.flrList.data[ind].floorB,
            imgName: this.props.flrList.data[ind].fileName
          },
          () => {
            this.handleSubmit();
          }
        );
      };
    
      handleSrcChange = e => {
        let { srcBuildingLocation } = this.state;
        let name = null;
        let val = null;
        let floor = null;
        let resp = "";
        let navInfo = this.props.navigationInfo;
        for (let i = 0; i < navInfo.length; i++) {
          if (e[0].floorElement === "Rooms") {
            resp = `${e[0].roomName}(${e[0].floor})`;
            if (e[0].node === navInfo[i].properties.node) {
    
              name = navInfo[i].properties.roomName?navInfo[i].properties.roomName:navInfo[i].properties.name;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
          } else if (e[0].floorElement === "FloorConnection") {
            if (e[0].node === navInfo[i].properties.node) {
              name = navInfo[i].properties.name;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
            resp = `${e[0].name}(${e[0].floor})`;
          } else if (e[0].floorElement === "Services") {
            if (e[0].node === navInfo[i].properties.node) {
              name = navInfo[i].properties.type;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
            resp = `${e[0].type}(${e[0].floor})`;
          } else if (e[0].floorElement === "RestRooms") {
            if (e[0].node === navInfo[i].properties.node) {
              name = navInfo[i].properties.type;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
            resp = `${e[0].type} Washroom (${e[0].floor})`;
          } else {
          }
        }
    
        var ind = this.findFloor(floor, this.props.flrList.data);
    
        this.setState(
          {
            srcName: name,
            srcfloor: floor,
            srcVal: parseInt(val),
            srcfloorL: this.props.flrList.data[ind].floorL,
            srcfloorB: this.props.flrList.data[ind].floorB,
            imgName: this.props.flrList.data[ind].fileName,
            showStrtMenu: false,
            srcReadOnly: true,
            zoomLevel: "18",
            pathCaption: [],
            currentLocation: `${name}, ${floor} floor, ${srcBuildingLocation.buildingName}, ${srcBuildingLocation.venueName}`
          },
          () => {
            const map = this.leafletMap.leafletElement;
            map.flyTo(
              new L.LatLng(
                this.props.flrList.data[0].lat,
                this.props.flrList.data[0].lng
              ),
              map.getZoom(),
              {
                animate: true,
                duration: 2
              }
            );
            console.log("called")
            // setTimeout(() => {
              this.handleSubmit();
            // }, "2000");
          }
        );
      };
    
      srcChange = e => {
        let name = null;
        let val = null;
        let floor = null;
        let resp = "";
        let navInfo = this.props.navigationInfo;
        for (let i = 0; i < navInfo.length; i++) {
          if (e.floorElement === "Rooms") {
            resp = `${e.roomName}(${e.floor})`;
            if (e.node === navInfo[i].properties.node) {
              name = navInfo[i].properties.roomName;
              floor = navInfo[i].properties.floor;
              val = navInfo[i].properties.node;
            }
          } else if (e.floorElement === "FloorConnection") {
            if (e.node === navInfo[i].properties.node) {
              name = navInfo[i].properties.name;
              floor = navInfo[i].properties.floor;
              val = navInfo[i].properties.node;
            }
            resp = `${e.name}(${e.floor})`;
          } else if (e.floorElement === "Services") {
            if (e.node === navInfo[i].properties.node) {
              name = navInfo[i].properties.type;
              floor = navInfo[i].properties.floor;
              val = navInfo[i].properties.node;
            }
            resp = `${e.type}(${e.floor})`;
          } else if (e.floorElement === "RestRooms") {
            if (e.node === navInfo[i].properties.node) {
              name = navInfo[i].properties.type;
              floor = navInfo[i].properties.floor;
              val = navInfo[i].properties.node;
            }
          } else {
          }
        }
        var ind = this.findFloor(floor, this.props.flrList.data);
        this.setState(
          {
            srcName: name,
            srcfloor: floor,
            srcVal: parseInt(val),
            srcfloorL: this.props.flrList.data[ind].floorL,
            srcfloorB: this.props.flrList.data[ind].floorB,
            imgName: this.props.flrList.data[ind].fileName
          },
          () => {
            this.handleSubmit();
          }
        );
      };
    
      onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: this.getSuggestions(value)
        });
      };
    
      onDstSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          dstSuggestions: this.getDstSuggestions(value)
        });
      };
      // Autosuggest will call this function every time you need to clear suggestions.
      onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };
    
      onDstSuggestionsClearRequested = () => {
        this.setState({
          dstSuggestions: []
        });
      };
    
      getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0
          ? []
          : this.state.list.filter(lang => {
              let resp = "";
              if (lang.floorElement === "Rooms") {
                resp = `${lang.roomName}(${lang.floor})`;
              } else if (lang.floorElement === "FloorConnection") {
                resp = `${lang.name}(${lang.floor})`;
              } else if (lang.floorElement === "Services") {
                resp = `${lang.type}(${lang.floor})`;
              } else if (lang.floorElement === "RestRooms") {
                resp = `${lang.type} Washroom (${lang.floor})`;
              } else {
              }
              return resp.toLowerCase().slice(0, inputLength) === inputValue;
            });
      };
    
      getDstSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0
          ? []
          : this.state.list.filter(lang => {
              let resp = "";
              if (lang.floorElement === "Rooms") {
                resp = `${lang.roomName}(${lang.floor})`;
              } else if (lang.floorElement === "FloorConnection") {
                resp = `${lang.name}(${lang.floor})`;
              } else if (lang.floorElement === "Services") {
                resp = `${lang.type}(${lang.floor})`;
              } else if (lang.floorElement === "RestRooms") {
                resp = `${lang.type} Washroom (${lang.floor})`;
              } else {
              }
              return resp.toLowerCase().slice(0, inputLength) === inputValue;
            });
      };
    
      getSuggestionValue = suggestion => {
        this.srcChange(suggestion);
        if (suggestion.floorElement === "Rooms") {
          return suggestion.roomName;
        } else if (suggestion.floorElement === "FloorConnection") {
          return suggestion.name;
        } else if (suggestion.floorElement === "Services") {
          return suggestion.type;
        } else if (suggestion.floorElement === "RestRooms") {
          return suggestion.type;
        } else {
        }
      };
    
      getDstSuggestionValue = suggestion => {
        this.dstChange(suggestion);
        if (suggestion.floorElement === "Rooms") {
          return suggestion.roomName;
        } else if (suggestion.floorElement === "FloorConnection") {
          return suggestion.name;
        } else if (suggestion.floorElement === "Services") {
          return suggestion.type;
        } else if (suggestion.floorElement === "RestRooms") {
          return suggestion.type;
        } else {
        }
      };
    
      renderSuggestion = suggestion => {
        let resp = "";
        if (suggestion.floorElement === "Rooms") {
          resp = `${suggestion.roomName}(${suggestion.floor})`;
        } else if (suggestion.floorElement === "FloorConnection") {
          resp = `${suggestion.name}(${suggestion.floor})`;
        } else if (suggestion.floorElement === "Services") {
          resp = `${suggestion.type}(${suggestion.floor})`;
        } else if (suggestion.floorElement === "RestRooms") {
          resp = `${suggestion.type} Washroom (${suggestion.floor})`;
        } else {
        }
        return <div style={{ color: "white" }}>{resp}</div>;
      };
    
      renderDstSuggestion = suggestion => {
        let resp = "";
        if (suggestion.floorElement === "Rooms") {
          resp = `${suggestion.roomName}(${suggestion.floor})`;
        } else if (suggestion.floorElement === "FloorConnection") {
          resp = `${suggestion.name}(${suggestion.floor})`;
        } else if (suggestion.floorElement === "Services") {
          resp = `${suggestion.type}(${suggestion.floor})`;
        } else if (suggestion.floorElement === "RestRooms") {
          resp = `${suggestion.type} Washroom (${suggestion.floor})`;
        } else {
        }
        return <div style={{ color: "white" }}>{resp}</div>;
      };
    
      onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
      };
    
      onSrcChange = (event, { newValue }) => {
        this.setState({
          dstValue: newValue
        });
      };
    
      nvgtSrcBld = () => {
        let { tmpSrcLocation } = this.state;
        let e = [tmpSrcLocation];
        this.fetchSrcBldLocation(
          e,
          tmpSrcLocation.venueName,
          tmpSrcLocation.buildingName,
          "srcBuildingLocation",
          k => {
            this.handleDstChange(k);
          }
        );
      };
    
      nvgtDstBld = () => {
        let { tmpDstLocation } = this.state;
        let e = [tmpDstLocation];
        this.fetchDstBldLocation(
          e,
          tmpDstLocation.venueName,
          tmpDstLocation.buildingName,
          "dstBuildingLocation",
          k => {
            this.handleDstChange(e);
          }
        );
      };
    
      fetchSrcBldLocation = (e, venueName, buildingName, point, cb) => {
        let data = { venueName, buildingName };
        this.props.floorList(data, () => {
          this.props.getAllBuildingElements(data, () => {
            let navInfo = this.props.navigationInfo;
            for (let i = 0; i < navInfo.length; i++) {
              if (
                navInfo[i].properties.floorElement === "Rooms" &&
                navInfo[i].properties.doorGroup === "Entrance | Exit"
              ) {
                this.srcBldDstPointChange(e, () => {
                  let k = [navInfo[i].properties];
                  this.setNavigation(this.state.selectedSrcLocation);
                  cb(k);
                });
              }
            }
          });
        });
      };
    
      fetchDstBldLocation = (e, venueName, buildingName, point, cb) => {
        let data = { venueName, buildingName };
        this.props.floorList(data, () => {
          this.props.getAllBuildingElements(data, () => {
            let navInfo = this.props.navigationInfo;
            for (let i = 0; i < navInfo.length; i++) {
              if (
                navInfo[i].properties.floorElement === "Rooms" &&
                navInfo[i].properties.doorGroup === "Entrance | Exit"
              ) {
                let props = [navInfo[i].properties];
                this.srcBldDstPointChange(props, () => {
                  let k = [navInfo[i].properties];
                  this.setNavigation(this.state.selectedSrcLocation);
                  cb(k);
                });
              }
            }
          });
        });
      };
    
      srcBldDstPointChange = (e, cb) => {
        let { srcBuildingLocation } = this.state;
        let name = null;
        let val = null;
        let floor = null;
        let resp = "";
        let navInfo = this.props.navigationInfo;
        for (let i = 0; i < navInfo.length; i++) {
          if (e[0].floorElement === "Rooms") {
            if (e[0].node === navInfo[i].properties.node) {
              name = navInfo[i].properties.roomName;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
          } else if (e[0].floorElement === "FloorConnection") {
            if (e[0].node === navInfo[i].properties.node) {
              name = navInfo[i].properties.name;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
          } else if (e[0].floorElement === "Services") {
            if (e[0].node === navInfo[i].properties.node) {
              name = navInfo[i].properties.type;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
          } else if (e[0].floorElement === "RestRooms") {
            if (e[0].node === navInfo[i].properties.node) {
              name = navInfo[i].properties.type;
              floor = e[0].floor;
              val = navInfo[i].properties.node;
            }
          } else {
          }
        }
        var ind = this.findFloor(floor, this.props.flrList.data);
        this.setState(
          {
            srcName: name,
            srcfloor: floor,
            srcVal: parseInt(val),
            srcfloorL: this.props.flrList.data[ind].floorL,
            srcfloorB: this.props.flrList.data[ind].floorB,
            imgName: this.props.flrList.data[ind].fileName,
            showStrtMenu: false,
            srcReadOnly: true,
            zoomLevel: "18"
          },
          () => {
            const map = this.leafletMap.leafletElement;
            map.flyTo(
              new L.LatLng(
                this.props.flrList.data[0].lat,
                this.props.flrList.data[0].lng
              ),
              map.getZoom(),
              {
                animate: true,
                duration: 2
              }
            );
            setTimeout(() => {
              this.handleSubmit();
            }, "2000");
          }
        );
        cb();
      };
    
      navigateNext = () => {
        let div = document.getElementById("mydiv").children;
        div[0].style.display = "none";
        div[1].style.display = "block";
        this.setState({
          next: false,
          currentFloor: this.state.dstfloor
        });
      };
    
      navigatePrevious = () => {
        let div = document.getElementById("mydiv").children;
        div[1].style.display = "none";
        div[0].style.display = "block";
        this.setState({
          next: true,
          currentFloor: this.state.srcfloor
        });
      };
    
      handleBuildingView = () => {
        this.setState({
          showInstructions: false,
        });
      };
    
      previousButton() {
        let currentStep = this.state.currentStep;
        if (currentStep !== 0) {
          return (
            <button
              className="btn btn-secondary btn-sm btn-block mb-1 ml-2 mr-1"
              type="button"
              onClick={this._prev}
            >
              Previous
            </button>
          );
        }
        return null;
      }
    
      nextButton() {
        let currentStep = this.state.currentStep;
        if (currentStep < this.state.pathCaption.length) {
          this._next();
        }
        return null;
      }
    
      _next = () => {
        let currentStep = this.state.currentStep;
        currentStep =
          currentStep >= this.state.pathCaption.length - 1
            ? this.state.pathCaption.length
            : currentStep + 1;
        if (this.state.pathCaption[currentStep]) {
          let step = this.state.pathCaption[currentStep];
          var utter = new window.SpeechSynthesisUtterance(step);
          let lang = localStorage.getItem("Language");
          if (lang === "Hindi") {
            utter.lang = "hi-IN";
          } else {
            utter.lang = "en-US";
          }
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        }
        if (
          this.state.pathFloor[currentStep] !== undefined &&
          this.state.pathFloor[currentStep].floor !==
            this.state.pathFloor[currentStep - 1].floor
        ) {
          this.navigateNext();
        }
    
        this.setState({
          currentStep: currentStep
        });
      };
    
      _prev = () => {
        let currentStep = this.state.currentStep;
        currentStep = currentStep <= 1 ? 0 : currentStep - 1;
        if (this.state.pathFloor[currentStep + 1] !== undefined) {
          if (
            this.state.pathFloor[currentStep + 1].floor !==
            this.state.pathFloor[currentStep].floor
          ) {
            this.navigatePrevious();
          }
        }
        this.setState({
          currentStep: currentStep
        });
      };
    
      playInstruction = (pause)=>{
        var synth = window.speechSynthesis;
        synth.cancel();
        if(pause === true){
          synth.pause();
        }else{
          synth.resume();
        }
        // let utterance = new SpeechSynthesisUtterance("Hello world!");
        // synth.speak(utterance);
        // synth.resume()
        let instruction = this.filterInstruction()
    
        instruction.forEach(r=>{
          var utterance1 = new SpeechSynthesisUtterance(r);
          synth.speak(utterance1);
        })
      }
    
      filterInstruction = ()=>{
        var instructions = [];
        var stepsCount = [];
        let instruction = this.state.currentFloor === this.state.firstFlr?this.state.firstFlrInstruction:this.state.secondFlrInstruction
        instructions = instruction &&  instruction.map((r, i) => {
                            if (
                              r.includes("right") ||
                              r.includes("Right")
                            ) {
                              return r 
                            } else if (
                              r.includes("left") ||
                              r.includes("Left")
                            ) {
                              return r 
                            } else if (
                              r.includes("forward")
                            ) {
                              let theNum  = r.match(/\d+/)[0]
                              stepsCount.push(parseInt(theNum))
                              return r 
                            } else if (
                              r.includes("Turn 1 O' Clock") ||
                              r.includes("Turn 2 O' Clock") ||
                              r.includes("Turn 3 O' Clock") 
                            ) {
                              return'Turn slight right' 
                            }else if(  
                              r.includes("Turn 4 O' Clock") ||
                              r.includes("Turn 5 O' Clock")){
                                return 'Turn back and then turn slight left' 
                            } else if (
                              r.includes("Turn 7 O' Clock") ||
                              r.includes("Turn 8 O' Clock") ||
                              r.includes("Turn 9 O' Clock") 
                            ) {
                              return 'turn slight left'
                            }else if(                        
                              r.includes("Turn 10 O' Clock") ||
                              r.includes("Turn 11 O' Clock")){
                                return 'Turn back and then turn slight left'
                            } else if (
                              r.includes("Turn 6 O' Clock")
                            ) {
                              return 'Turn back'
                            } else if (r.includes("You are at")) {
                              return r
                            } else if (r.includes("reached")) {
                              return r
                            } else if (
                              r.includes("Turn 0 O' Clock") ||
                              r.includes("Turn 12 O' Clock")
                            ) {
                              return null 
                            }else{
                              return r
                            }
        })
        var distance
    
        if(instructions){
          const add = arr => arr.reduce((a, b) => a + b, 0);
          distance = add(stepsCount);
          instructions = instructions.filter( (el)=> {
            return el != null;
          });
        }
        instructions.splice(instructions.length-2, 1);
        return instructions;
      }

  state = {
  };
  
  handleClick = () => {
    this.setState({
            color: Konva.Util.getRandomColor()
        });
    };
  

  render() {

    var combineInstructions = [];
    if(this.state.srcfloor === this.state.dstfloor){
      combineInstructions = this.state.pathCaption
    }else{
      if(this.state.firstFlr === this.state.currentFloor){
        combineInstructions = this.state.firstFlrInstruction
      }else{
        combineInstructions = this.state.secondFlrInstruction
      }
      // if(this.state.firstFlrInstruction = this.state.secondFlrInstruction)
    }

    let { center, currentPos } = this.state;
    let { srcBuildingLocation, dstBuildingLocation } = this.state;

    return (
        // <React.Fragment>
        
        // </React.Fragment>
        <React.Fragment>
         
            
        {/* style={{background:"#e0e0e0"}} */}
        <div hidden={this.state.showInstructions}  >
          {!this.state.buildingView ? (
            <React.Fragment>

              <div
                className="source-destination fixed-top"
                id="src-bar"
                style={{ marginTop: "50px" }}
              >
                <div className="row w-100  mx-auto">
                  <div className="col-12 p-0">
                    <button
                      className="btn-nvgtn text-white"
                      onClick={() => {
                        this.setState({
                          showStrtMenu: true,
                          srcReadOnly: false
                        });
                      }}
                    >
                      <img
                        className="float-left mt-2 mr-2"
                        src="/inclunav/assets/images/profile.svg"
                        alt="user location"
                        alt="current location"
                      />
                      <p className="strt-txt text-justify ">
                        {this.state.currentLocation}
                      </p>
                    </button>
                  </div>
                </div>
                <div className="mx-auto hr-line" />
                <div className="row w-100  mx-auto">
                  <div className="col-10 p-0">
                    <button
                      className="btn-nvgtn text-white"
                      onClick={() => {
                        this.setState({
                          showDstMenu: true,
                          dstReadOnly: false
                        });
                      }}
                    >
                      <img
                        className="float-left mt-2 mr-2"
                        src="/inclunav/assets/images/navigation.svg"
                        alt="select destination"
                      />
                      <p className="strt-txt text-justify ">
                        {this.state.dstAddress}
                      </p>
                    </button>
                  </div>
                  <div className="col-2"></div>
                </div>
              </div>
              {this.state.showStrtMenu && !this.state.buildingView
                ? 
                <SourceMenu
                srcName = {this.state.srcName}
                currentLocation = {this.state.currentLocation}
                selectedSrcLocation = {this.state.selectedSrcLocation}
                locationList = {this.state.locationList}
                srcReadOnly = {this.state.srcReadOnly}
                srcFloorList = {this.state.srcFloorList}
                showStrtMenu = {()=>{
                  this.setState({ showStrtMenu: false });
                }}
                handleSelectSource = {(e)=>{
                  if (e.length > 0) {
                    this.setState(
                      {
                        tmpSrcLocation: e[0]
                      },
                      () => {
                        this.handleSrcChange(e);
                      }
                    );
                  }
                }}
                handleSourceLocation = {(e)=>{
                  if (e.length > 0) {
                    this.setState(
                      {
                        selectedSrcLocation: e[0],
                        selectedDstLocation: e[0],
                        buildingView: false
                      },
                      () => {
                        this.props.androidNavigation({venueName:e[0].venueName,buildingName:e[0].buildingName},()=>{
                        })
                        this.fetchLocation(
                          e[0].venueName,
                          e[0].buildingName,
                          "srcBuildingLocation"
                        );
                        this.fetchLocation(
                          e[0].venueName,
                          e[0].buildingName,
                          "dstBuildingLocation"
                        );
                        if(this.state.dstName !== "Select Destination"){
                          this.handleSubmit()
                        }else{
                          this.setNavigation(this.state.selectedDstLocation);
                        }
                      }
                    );
                  }
                }}
                />
                : null}
              {this.state.showDstMenu && !this.state.buildingView
                ? 
                <DestinationMenu
                dstName={this.state.dstName}
                currentLocation = {this.state.currentLocation}
                selectedDstLocation = {this.state.selectedDstLocation}
                selectedDestination = {this.state.selectedDestination}
                locationList = {this.state.locationList}
                dstReadOnly = {this.state.dstReadOnly}
                dstFloorList={this.state.dstFloorList}
                showDstMenu={()=>{
                  this.setState({ showDstMenu: false });
                }}
                handleSelectDestination = {(e)=>{
                  let resp = "";
                  if (e[0].floorElement === "Rooms") {
                    resp = `${e[0].roomName}(${e[0].floor})`;
                  } else if (e[0].floorElement === "FloorConnection") {
                    resp = `${e[0].name}(${e[0].floor})`;
                  } else if (e[0].floorElement === "Services") {
                    resp = `${e[0].type}(${e[0].floor})`;
                  } else if (e[0].floorElement === "RestRooms") {
                    resp = `${e[0].type} Washroom (${e[0].floor})`;
                  } else {
                    resp = "";
                  }
                  this.setState(
                    {
                      tmpDstLocation: e[0],
                      dstName:e[0],
                      dstAddress: `${resp}, ${this.state.dstBuildingLocation.buildingName}, ${this.state.dstBuildingLocation.venueName}`,
                      showDstMenu: false,
                      dstReadOnly: true
                    },
                    () => {
                      if (
                        srcBuildingLocation.venueName ===
                          dstBuildingLocation.venueName &&
                        srcBuildingLocation.buildingName ===
                          dstBuildingLocation.buildingName
                      ) {
                        this.handleDstChange(e);
                      }
                    }
                  );
                }}
                handleSourceLocation = {(e)=>{
                if (e.length > 0) {
                  let venueName = e[0].venueName;
                  let buildingName = e[0].buildingName;
                  let venue = this.state.srcBuildingLocation.venueName;
                  let building = this.state.srcBuildingLocation.buildingName;
                  if (!venue && !building) {
                    let data = { venueName, buildingName };
                    let props;
                    this.props.androidNavigation({venueName:e[0].venueName,buildingName:e[0].buildingName},()=>{
                    })
                    this.setNavigation(data);
                    this.props.floorList(data, () => {
                      this.props.getAllBuildingElements(data, () => {
                        let navInfo = this.props.navigationInfo;
                        for (let i = 0; i < navInfo.length; i++) {
                          if (
                            navInfo[i].properties.floorElement === "Rooms" &&
                            navInfo[i].properties.doorGroup ===
                              "Entrance | Exit"
                          ) {
                            props = navInfo[i].properties;
                            var ind = this.findFloor(
                              "ground",
                              this.props.flrList.data
                            );
                            this.setState(
                              {
                                srcName: props.roomName,
                                srcfloor: "ground",
                                srcVal: parseInt(props.node),
                                srcfloorL: this.props.flrList.data[ind]
                                  .floorL,
                                srcfloorB: this.props.flrList.data[ind]
                                  .floorB,
                                imgName: this.props.flrList.data[ind]
                                  .fileName,
                                pathCaption: []
                              },
                              () => {
                                  this.handleSubmit();
                              }
                            );
                          }
                        }
                       
                      });
                    });
                  }
                  this.setState(
                    {
                      selectedDstLocation: e[0],
                      buildingView: false
                    },
                    () => {
                      this.fetchLocation(
                        e[0].venueName,
                        e[0].buildingName,
                        "dstBuildingLocation"
                      );
                      if (
                        this.state.selectedSrcLocation.venueName ===
                          this.state.selectedDstLocation.venueName &&
                        this.state.selectedSrcLocation.buildingName ===
                          this.state.selectedDstLocation.buildingName
                      ) {
                        this.setNavigation(this.state.selectedDstLocation);
                      }
                    }
                  );
                }
                }}
                />
                : null}
            </React.Fragment>
          ) : null}
         
          <div hidden={this.state.buildingView}>
            <MapContainer
              style={{ height: "100vh" }}
              center={center}
              zoom={this.state.zoomLevel}
              ref={m => {
                this.leafletMap = m;
              }}
              onClick={this.handleClick}
            >
              <TileLayer
                url={"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              />
              <Marker position={this.state.currentPos} draggable={true}>
                <Popup position={this.state.currentPos}>
                  Current location:
                  <pre>{JSON.stringify(this.state.currentPos, null, 2)}</pre>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div
            hidden={!this.state.buildingView}
            className="mt-1"
            style={{ height: "100%", width: "100%", overflow: "scroll" }}
          >
            {!this.state.samefloor ? (
              <div
            className="btn-group-vertical btn-info rounded  shadow mt-5"
            role="group"
            aria-label="First group"
            style={{ position: "fixed", zIndex: "5", background: "#56c9ad" }}
          >
                <button
                  type="button"
                  className="btn btn-dark text-white text-capitalize"
                  onClick={this.navigatePrevious}
                >
                  { this.props.flrList.data.map((r,i)=>{
                    if(this.state.srcfloor === r.floor){
                        return `L${i}`
                    }
                  })}
                </button>
                <button
                  type="button"
                  className="btn btn-dark text-white"
                  onClick={this.navigateNext}
                >
              { this.props.flrList.data.map((r,i)=>{
                    if(this.state.dstfloor === r.floor){
                        return `L${i}`
                    }
                  })}
                </button>
          </div>
            ) : null}
            <div style={{ height: "100%", top: "50px" }}>
              <img
                alt="map"
                id="myImage"
                src={`${config.imgUrl}/${this.state.imgName}`}
                hidden={true}
              ></img>
              <img
                alt="map"
                id="srcImage"
                src="/inclunav/assets/images/source.svg"
                style={{WebkitTransform: `rotate(20deg)`}}
                hidden={true}
              ></img>
              <img
                alt="map"
                id="dstImage"
                src="/inclunav/assets/images/destination.svg"
                hidden={true}
              ></img>
              <img
                alt="map"
                id="stairs"
                src="/inclunav/assets/images/stair.png"
                hidden={true}
              ></img>
              <img
                alt="map"
                id="lift"
                src="/inclunav/assets/images/lift.png"
                hidden={true}
              ></img>
              <div id="mydiv1"></div>
             
              <div className="canvaDiv" ref="canv" onScroll={this.handleScroll}>
              <Stage
                width={500} 
                height={500}
            >
                <Layer>
                {this.state.pathPoints.map((star,id) => (
                  <Star
                    key={id}
                    id={id}
                    x = {star[0]}
                    y = {star[1]}
                    numPoints={5}
                    innerRadius = {20}
                    outerRadius = {40}
                    fill="#89b717"
                    opacity={0.8}
                    draggable
                    // rotation={star.rotation}
                    shadowColor="black"
                    shadowBlur={10}
                    shadowOpacity = {0.6}
                  />
                ))}
                </Layer>
            </Stage>

                <canvas
                  id="myCanvassrc"
                  width={this.state.canvasWidth}
                  height={this.state.canvasHeight}
                  style={{ position: "absolute" }}
                  hidden={true}
                ></canvas>
              </div>
              <div id="mydiv"></div>
            </div>
          </div>
        </div>
      </React.Fragment>

    );
  }
}

const mapStateToProps = state => {
    return {
      getImage: state.imgDetails,
      allNodes: state.getAllElem,
      flrList: state.floorList,
      userProfile:state.userPortfolio,
      navigationInfo: state.navigationInfo,
      vnList: state.venueList,
      bldList: state.buildingList,
      gpsLocation: state.gpsLocation,
      androidNav: state.androidNavigation
    };
  };
  
  export default connect(mapStateToProps, {
    floorList,
    imgDetails,
    getAllBuildingElements,
    venueList,
    buildingList,
    getGpsLocation,
    androidNavigation,
    getUserPortfolio
  })(ColoredRect);