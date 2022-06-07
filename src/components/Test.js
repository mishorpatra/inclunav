import React from "react";
import {
  Map as MapContainer,
  Marker,
  Popup,
  TileLayer,
  MapControl,
  useMapEvent
} from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import config from "../config";
import { connect } from "react-redux";
import {
  floorList,
  imgDetails,
  getAllBuildingElements,
  venueList,
  buildingList
} from "../store/actions/index";
import Drawer from "react-drag-drawer";
import { css } from "@emotion/css";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { Link } from "react-router-dom";
import "./navStyles.css";

const Card = css`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 40px auto;
  @media (min-width: 768px) {
    border-radius: 0;
  }
  button {
    margin-top: 50px;
  }
`;
const center = { lat: 28.6139, lng: 77.209 };

const Toggle = css`
  background-color: #d50152;
  border-radius: 4px;
  color: white;
  border: 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  margin-left: 50%;
  margin-top: 0px !important;
  transition: all 0.25s linear;
  &:active {
    transform: scale(0.9);
  }
`;

const modal = css`
  position: absolute;
  top: 30px;
  background-color: white;
  width: 100%;
  max-width: 700px;
  min-height: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const Sidebar = css`
  ${modal} top: 0;
  max-width: 300px;
  border-radius: 0;
  left: 0;
  background: linear-gradient(to bottom, #09203f, #1d4a6d);
`;

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

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buildingName: "",
      srcName: "none",
      srcfloor: "none",
      dstfloor: "none",
      list: [],
      dstName: "none",
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
      center: { lat: 28.6139, lng: 77.209 },
      currentPos: { lat: 28.6139, lng: 77.209 },
      zoomLevel: "5",
      buildingView: false,
      pathCaption: [],
      pathFloor: [],
      currentStep: 0,
      
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
  }

  //   componentDidMount() {
  //     const url = window.location.href;
  //     let urlSplit = url.split('?')
  //     let venueName = urlSplit[1].split('&&')[0];
  //     let buildingName = urlSplit[1].split('&&')[1];
  //     let id = sessionStorage.getItem('id')
  //     let token = sessionStorage.getItem('token')
  //     let data = { venueName, buildingName, id }

  //     this.props.floorList(data, token, () => {
  //         this.setState({
  //           floorList: this.props.flrList.data,
  //         })
  //         this.num_floors = this.props.flrList.data.length;
  //       })
  //       this.grids_all=[];
  //       this.props.getAllBuildingElements(data,token,() => {
  //         let nodes = this.props.navigationInfo
  //         let lists=[];
  //         let num_vert=0;
  //         let fc=new Map();
  //         for(let i=0;i<nodes.length;i++){
  //           if(nodes[i].properties.floorElement==='FloorConnection'){
  //             num_vert++;
  //             var v = nodes[i].properties.type+","+nodes[i].properties.name;
  //             var val = nodes[i].properties.floor+","+nodes[i].properties.node;
  //             if(fc.has(v)===false){
  //               fc.set(v,[val]);
  //             }
  //             else{
  //               fc.get(v).push(val);
  //             }
  //           }
  //         }
  //         this.graph = new Graph(num_vert+2);
  //         for(let i=0;i<nodes.length;i++){
  //             var sel = nodes[i].properties;
  //             lists.push(sel);
  //           if(nodes[i].properties.floorElement==='FloorConnection'){
  //             var val = nodes[i].properties.floor+","+nodes[i].properties.node;
  //             this.graph.addVertex(val);
  //           }

  //           if (nodes[i].properties.floorElement === "Floor") {
  //             if (nodes[i].properties.length == 8) {
  //               var v = nodes[i].properties.frConn[0].split(",");
  //               var flrmatrix = nodes[i].properties.flr_dist_matrix[0].split(",");
  //               var len = v.length / 2;
  //               if (v.length % 2 === 0) {
  //                 for (var j = 0; j < v.length; j = j + 2) {
  //                   var val =
  //                     parseInt(nodes[i].properties.length) * parseInt(v[j + 1]) +
  //                     parseInt(v[j]);
  //                   var vert1 = nodes[i].properties.floor + "," + val;
  //                   for (var k = j + 2; k < v.length; k = k + 2) {
  //                     val =
  //                       parseInt(nodes[i].properties.length) * parseInt(v[k + 1]) +
  //                       parseInt(v[k]);
  //                     var vert2 = nodes[i].properties.floor + "," + val;
  //                     this.graph.addEdge(
  //                       vert1,
  //                       vert2,
  //                       flrmatrix[len * (j / 2) + k / 2],
  //                       true
  //                     );
  //                   }
  //                 }
  //               } else {
  //               }
  //             }
  //             this.grids_all.push(nodes[i]);
  //           }
  //         }
  //         let getKeys = fc.keys();

  //         for (let i of getKeys)
  //         {
  //             var get_values = fc.get(i);
  //             var cnt =0;
  //             var prev = null;
  //             for (var j of get_values) {
  //               if(cnt>0){
  //                 this.graph.addEdge(prev,j,0,true);
  //                 prev = j;
  //               }
  //               if(cnt===0){
  //                 prev = j;
  //               }
  //               cnt++;
  //             }
  //         }

  //         var cvWidth = Math.max(
  //             document.getElementById("myCanvassrc").clientWidth,
  //             window.innerWidth || 0
  //         );

  //         var cvHeight = Math.max(
  //             document.getElementById("myCanvassrc").clientHeight,
  //             window.innerHeight || 0
  //         );

  //           var element = document.getElementById("myCanvassrc");
  //           var topPos = element.getBoundingClientRect().top;
  //           let realHeight = cvHeight - topPos;

  //           this.setState({
  //             canvasWidth: cvWidth,
  //             canvasHeight: realHeight,
  //             list: lists
  //           });
  //     })
  //   }

  componentDidMount() {
    this.props.venueList(() => {
      this.setState({
        venueList: this.props.vnList.data
      });
    });
  }

  handleVenueChange = e => {
    // console.log("bld listr",e[0])
    // console.log("leaflet elementy",this.leafletMap)
    // const map = this.leafletMap.leafletElement;
    // const searchControl = new ELG.Geosearch().addTo(map);
    // const results = new L.LayerGroup().addTo(map);
    // searchControl.on("results", (data) => {
    // results.clearLayers();
    // this.setState({
    // currentPos: data.results[0].latlng,
    // address: data.results[0].properties.LongLabel
    // })
    // });
    // currentPos: { lat: 28.6139, lng: 77.209 },
    if (e.length > 0) {
      this.leafletMap.leafletElement.setView(
        new L.LatLng(e[0].coordinates[0], e[0].coordinates[1]),
        15
      );
      this.setState(
        {
          venueName: e[0].venueName,
          currentPos: { lat: e[0].coordinates[0], lng: e[0].coordinates[1] },
          center: { lat: e[0].coordinates[0], lng: e[0].coordinates[1] },
          zoomLevel: 15,
          buildingView: false
        },
        () => {
          this.props.buildingList({ venueName: e[0].venueName }, () => {
            this.setState({
              buildingList: this.props.bldList.data
            });
          });
        }
      );
    }
  };

  handleBuildingChange = e => {
    if (e.length > 0) {
      this.setState(
        {
          buildingName: e[0].buildingName,
          currentPos: { lat: e[0].lat, lng: e[0].lng },
          center: { lat: e[0].lat, lng: e[0].lng },
          zoomLevel: 18,
          buildingView: false
        },
        () => {
          this.setNavigation();
        }
      );
    }
  };

  setNavigation = () => {
    let venueName = this.state.venueName;
    let buildingName = this.state.buildingName;
    let data = { venueName, buildingName };
    this.props.floorList(data, () => {
      this.setState({
        floorList: this.props.flrList.data
      });
      this.num_floors = this.props.flrList.data.length;
    });
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

      var cvWidth = Math.max(
        document.getElementById("myCanvassrc").clientWidth,
        window.innerWidth || 0
      );

      var cvHeight = Math.max(
        document.getElementById("myCanvassrc").clientHeight,
        window.innerHeight || 0
      );

      var element = document.getElementById("myCanvassrc");
      var topPos = element.getBoundingClientRect().top;
      let realHeight = cvHeight - topPos;

      this.setState({
        canvasWidth: cvWidth,
        canvasHeight: realHeight,
        list: lists
      });
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
    var canvas = document.getElementById(canvasid);
    // alert(canvas);
    var context = canvas.getContext("2d");
    var pos_x = scale * (i % srcfloorL);
    var pos_y = scale * parseInt(i / srcfloorL);
    // alert(i+" "+canvasid+" "+srcfloorL);
    context.fillStyle = color;
    context.fillRect(pos_x, pos_y, scale, scale);
  };

  color_canvas = (i, place, color) => {
    let srcDiv = document.getElementById("srcImage");
    let dstDiv = document.getElementById("dstImage");
    if (place === "srcmap") {
      let { srcfloorL, scale } = this.state;
      var canvas = document.getElementById("myCanvassrc");
      var context = canvas.getContext("2d");
      let gpx = this.state.canvasWidth / this.state.srcfloorL;
      let gpy = this.state.canvasHeight / this.state.srcfloorB;

      var posX = gpx * (i % srcfloorL);
      var posY = gpy * parseInt(i / srcfloorL);
      var halfScale = scale / 2;
      posX = posX + halfScale;
      posY = posY + halfScale;
      context.beginPath();
      var half_scale = scale / 2;
      context.arc(posX, posY, 5, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();
      context.stroke();
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

  // handleSubmit = () => {
  //   let { srcVal,srcfloor,dstfloor, dstVal } = this.state;
  //   if(srcVal!=null && dstVal!=null){
  //     var divimg  = document.getElementById('mydiv1');
  //       var divcan = document.getElementById('mydiv');
  //       var len = divimg.childNodes.length;
  //       for(var i=0;i<len;i++){
  //         var elem = divimg.childNodes[0].remove();
  //       }

  //       len = divcan.childNodes.length;

  //       for(var i=0;i<len;i++){
  //         var elem = divcan.childNodes[0].remove();
  //       }

  //     if(srcfloor===dstfloor){
  //       this.setState({
  //         samefloor:true
  //       })
  //       var ind = this.findFloor(srcfloor,this.props.flrList.data);
  //       var img1 = new Image();
  //         var img = document.getElementById('myImage');
  //         img1.src = img.src;
  //         img1.hidden=true;
  //         divimg.appendChild(img1);
  //       let canvas = document.getElementById('myCanvassrc');
  //       let ctx = canvas.getContext('2d');
  //           var img1 =  document.getElementById('myImage');
  //           var color_canvas = this.color_canvas;
  //           var me = this;
  //           var dest_x = this.state.dstVal%this.state.dstfloorL;
  //           var dest_y = parseInt(this.state.dstVal/this.state.dstfloorL);
  //           img1.onload = function () {
  //               ctx.drawImage(img1, 0, 0, img1.width, img1.height,
  //                                   0, 0, canvas.width, canvas.height);
  //           };
  //     }
  //     else{
  //       this.setState({
  //         samefloor:false
  //       })
  //       this.findpath();
  //     }
  //     }
  //   else{
  //   }
  // };

  handleSubmit = () => {
    let { srcVal, srcfloor, dstfloor, dstVal } = this.state;
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
      console.log("load", srcfloor, dstfloor);

      if (srcfloor === dstfloor) {
        this.setState({
          samefloor: true
        });
        var img1 = new Image();
        var img = document.getElementById("myImage");
        img1.src = img.src;
        img1.hidden = true;
        let canvas = document.getElementById("myCanvassrc");
        let ctx = canvas.getContext("2d");
        var color_canvas = this.color_canvas;
        var me = this;
        var dest_x = this.state.dstVal % this.state.dstfloorL;
        var dest_y = parseInt(this.state.dstVal / this.state.dstfloorL);
        img1.onload = function() {
          ctx.drawImage(
            img1,
            0,
            0,
            img1.width,
            img1.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
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
        };
      } else {
        this.setState({
          samefloor: false
        });
        this.findpath();
      }
    } else {
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

      if (minleave == dstvert) {
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
        floorLlist.push(this.grids_all[ind].length);
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

  // callimage(cnt,ans,count,clist,floorLlist){
  //   if(cnt===count-1){
  //       var i = Array.from(ans.keys())[cnt];
  //       var ctx = document.getElementById("mydiv");
  //       var canvas = document.createElement('canvas');
  //       canvas.id = 'canvas'+cnt;
  //       canvas.width = this.state.scale*clist[cnt].floorL;
  //       canvas.height = this.state.scale*clist[cnt].floorB;
  //       canvas.style.border   = "1px solid";
  //       ctx.appendChild(canvas);
  //       ctx = canvas;
  //       if (ctx.getContext) {
  //           ctx = ctx.getContext('2d');
  //           var canvas = ctx.canvas;
  //           var div = document.getElementById('mydiv1')
  //           var img1 = new Image();
  //           var img = document.getElementById('myImage');
  //           img1.src = img.src;
  //           img1.hidden = true;
  //           div.appendChild(img1);
  //           var me = this;
  //           var get_val = ans.get(i);
  //           var loaded =false;
  //           img1.onload = function () {
  //               if(loaded==false){
  //                 ctx.drawImage(img1, 0, 0, img1.width, img1.height,
  //                                     0, 0, canvas.width, canvas.height);
  //                 var id='canvas'+cnt;
  //                 for (var j of get_val)
  //                 {
  //                 me.color_canvas_spl(j,id,'blue',floorLlist[cnt]);
  //                 }
  //                 var index = me.findFloor(i,me.grids_all);
  //                 var m = me.grids_all[index].properties.length;
  //                 var n = me.grids_all[index].properties.breadth;
  //                 for (var j=0;j<get_val.length-1;j++)
  //                 {
  //                   var dest_x = (get_val[j+1])%m;
  //                   var dest_y = parseInt(get_val[j+1]/m);
  //                   me.callwhile(i,get_val[j], m,n,dest_x,dest_y,true,id);
  //                 }
  //                 loaded = true;
  //               }
  //           };
  //       }
  //   }
  //   else{
  //       var loaded = false;
  //       var i = Array.from(ans.keys())[cnt];
  //       var ind = this.findFloor(i,this.props.flrList);
  //       var ctx = document.getElementById("mydiv");
  //       var canvas = document.createElement('canvas');
  //       canvas.id     = 'canvas'+cnt;
  //       canvas.width  = this.state.scale*clist[cnt].floorL;
  //       canvas.height = this.state.scale*clist[cnt].floorB;
  //       canvas.style.border   = "1px solid";
  //       ctx.appendChild(canvas);
  //       ctx = canvas;
  //       if (ctx.getContext) {
  //           ctx = ctx.getContext('2d');
  //           var canvas = ctx.canvas;
  //           var div = document.getElementById('mydiv1')
  //           var img1 = document.getElementById('myImage');
  //           var me = this;
  //           var get_val = ans.get(i);
  //           img1.onload = function () {
  //             if(loaded==false){
  //               ctx.drawImage(img1, 0, 0, img1.width, img1.height,
  //                                   0, 0, canvas.width, canvas.height);
  //               var id='canvas'+cnt;
  //               for (var j of get_val)
  //               {
  //                 me.color_canvas_spl(j,id,'blue',floorLlist[cnt]);
  //               }
  //               var index = me.findFloor(i,me.grids_all);
  //               var m = me.grids_all[index].properties.length;
  //               var n = me.grids_all[index].properties.breadth;
  //               for (var j=0;j<get_val.length-1;j++)
  //               {
  //                 var dest_x = (get_val[j+1])%m;
  //                 var dest_y = parseInt(get_val[j+1]/m);
  //                 me.callwhile(i,get_val[j], m,n,dest_x,dest_y,true,id);
  //               }
  //                 cnt++;
  //                 me.callimage(cnt,ans,count,clist,floorLlist);
  //                 loaded = true;
  //               }
  //           };
  //       }
  //   }
  // }

  callimage(cnt, ans, count, clist, floorLlist) {
    let floorList = [this.state.srcfloor, this.state.dstfloor];
    console.log("call imaghe", clist, floorList);

    for (let jj = 0; jj < floorList.length; jj++) {
      for (let ii = 0; ii < clist.length; ii++) {
        if (floorList[jj] === clist[ii].floor) {
          let i = clist[ii].floor;
          let ind = this.findFloor(i, this.props.fList);

          // this.props.imgDetails(
          //   this.state.buildingName,
          //   i,
          //   this.props.fList[ind].fileName,
          //   () => {
          let myDiv = document.getElementById("mydiv");
          let canvas = window.d3
            .select("#mydiv")
            .append("canvas")
            .attr("id", "canvas" + ii)
            .attr("style", `border:1px solid;"}`)
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
          console.log(
            "floor",
            i === this.state.srcfloor,
            i,
            this.state.srcfloor,
            img1.src
          );

          img1.hidden = true;
          div.appendChild(img1);
          let me = this;
          let get_val = ans.get(i);
          let loaded = false;
          img1.onload = function() {
            multiCanvas();
          };

          function multiCanvasZoom() {
            me.setState(
              {
                zoom: true
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
              ctx.drawImage(
                img1,
                0,
                0,
                img1.width,
                img1.height,
                0,
                0,
                width,
                height
              );
              var id = "canvas" + ii;
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
            let src_val = get_val[0];
            let dest_val = get_val[1];
            let index = me.findFloor(i, me.grids_all);
            let m = me.grids_all[index].length;
            let src_x = parseInt(src_val) % m;
            let src_y = parseInt(parseInt(src_val) / m);
            let dest_x = parseInt(dest_val) % m;
            let dest_y = parseInt(parseInt(dest_val) / m);
            let dx, dy;
            if (dest_x > src_y) {
              dx = dest_x - src_x;
            } else {
              dx = src_x - dest_x;
            }
            if (dest_y > src_y) {
              dy = dest_y - src_y;
            } else {
              dy = src_y - dest_y;
            }
            let x = (src_x + dest_x) / 2;
            let y = (dest_y + src_y) / 2;
            let scale = Math.max(
              1,
              Math.min(8, 0.9 / Math.max(dx / width, dy / height))
            );
            let translate = [width / 2 - scale * x, height / 2 - scale * y];
            var transform = window.d3.zoomIdentity
              .translate(translate[0], translate[1])
              .scale(2);
            canvas
              .transition()
              .duration(750)
              .call(zoom1.transform, transform);
          }
          //   }
          // );
        }
      }
    }
  }

  callwhile(srcfloor, srcVal, m, n, dest_x, dest_y, single, canvasid) {
    console.log(
      "sjdhkjsdh",
      srcfloor,
      srcVal,
      m,
      n,
      dest_x,
      dest_y,
      single,
      canvasid
    );
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
      let gpx = this.state.canvasWidth / this.state.srcfloorL;
      let gpy = this.state.canvasHeight / this.state.srcfloorB;

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
      console.log("refined paths",refinedpaths,this.props.navigationInfo,this.state.list)
      // this.findInstructions(sp, refinedpaths, this.props.navigationInfo, srcfloor);

      for (var i = 0; i < this.shortestpath[dest_x][dest_y].length; i = i + 2) {
        context.beginPath();
        var half_scale = scale / 2;
        var pos_x = gpx * this.shortestpath[dest_x][dest_y][i][0];
        var pos_y = gpy * this.shortestpath[dest_x][dest_y][i][1];
        pos_x = pos_x + half_scale;
        pos_y = pos_y + half_scale;
        context.arc(pos_x, pos_y, scale, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = "blue";
        context.strokeStyle = "#003300";
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

    // {
      // x: refinedPoints[currentRPoint].x,
      // y: refinedPoints[currentRPoint].y + 1
    // },
    // refinedPoints[currentRPoint + 1],
    // refinedPoints[currentRPoint]
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
    if (angle >= 75 && angle <= 105) return this.props.t("Turn Right");

    if (angle <= -75 && angle >= -105) return this.props.t("Turn Left");

    if ((angle >= 165 && angle <= 180) || (angle <= -165 && angle >= -180))
      return this.props.t("Go Straight");
    if (angle < 0) {
      if (Math.round((360 + angle) / 30) === 9) {
        return this.props.t("Turn Left");
      }
    // if(Math.round((360 + angle) / 30) === 12 || Math.round((360 + angle) / 30) === 0){
    //   return this.props.t("Go Straight")
    // }
      return this.props.t("O' Clock",{angle:Math.abs(Math.round((360 + angle) / 30))})
      // return "Turn " + Math.round((360 + angle) / 30) + " O' Clock";
    }

    if (Math.floor(angle / 30) === 3) return this.props.t("Turn Right");
    // if(Math.round((360 + angle) / 30) === 12 || Math.round((360 + angle) / 30) === 0){
    //   return this.props.t("Go Straight")
    // }  
    return this.props.t("O' Clock",{angle:Math.abs(Math.round((angle) / 30))})
    // return "Turn " + Math.round(angle / 30) + " O' Clock";
  };

  // find the error component in the iteration and leaves it for the next iteration
  findErrorInAngle = angle => {
    if (angle < 0) return 360 + angle - Math.round((360 + angle) / 30) * 30;
    return angle - Math.round(angle / 30) * 30;
  };
  //same as above but in abbreviated form

  findDirectionAbbreviation = angle => {
    if (angle > 0) return this.props.t("Right");

    return this.props.t("Left");
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
    console.log("element map",mapElements)

    //adding the elements to map
    for (i = 0; i < mapElements.length; i++) {

      let props = mapElements[i].properties 

      if (props.floorElement === "Rooms") {
        if (
          mapElements[i].properties.floor === floor &&
          mapElements[i].properties.name !== "undefined" &&
          mapElements[i].properties.coordinates !== undefined
        )
        ElementMap.set(
          props.coordinates.replace(",", "@"),
          mapElements[i]
        );
      } else if (props.floorElement === "FloorConnection") {
        if (
          mapElements[i].properties.floor === floor &&
          mapElements[i].properties.name !== "undefined" &&
          mapElements[i].properties.coordinates !== undefined
        )
        ElementMap.set(
          props.coordinates.replace(",", "@"),
          mapElements[i]
        );
      } else if (props.floorElement === "Services") {
        if (
          mapElements[i].properties.floor === floor &&
          mapElements[i].properties.name !== "undefined" &&
          mapElements[i].properties.coordinates !== undefined
        )
        ElementMap.set(
          props.coordinates.replace(",", "@"),
          mapElements[i]
        );
      } else if (props.floorElement === "RestRooms") {
        if (
          mapElements[i].properties.floor === floor &&
          mapElements[i].properties.name !== "undefined" &&
          mapElements[i].properties.coordinates !== undefined
        )
        ElementMap.set(
          props.coordinates.replace(",", "@"),
          mapElements[i]
        );
      } else {

      }
    }

    console.log("map elements",mapElements)
    
    //finding the indices of the
    while (currentNRPoint < nNonRefined && currentRPoint < nRefined) {
      if (
        nonRefinedPoints[currentNRPoint][0] === refinedPoints[currentRPoint].x &&
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
      this.props.t("You are at",{location:ElementMap.get("" + refinedPoints[0].x + "@" + refinedPoints[0].y).name} )
    );
    ElaboratedResults.push(
      "You are at " +
        ElementMap.get("" + refinedPoints[0].x + "@" + refinedPoints[0].y).name
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
      if (currentRPoint === 0){

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
        let diff = 360-floorangle;
        // let CurrentDirection = 60;
        let CurrentDirection = this.actualAngle;
        // rotateDirection
        let gn = this.calculatePath(path_angle,diff,CurrentDirection);

        angle  = gn;
        // angle =  pathDirection - this.actualAngle;
        // angle =  pathDirection - 50;
        // this.setState({
        //   actualAngle:parseInt(angle),
        //   pathDirection:pathDirection,
        //   magnetoMeter:this.actualAngle
        // })
      }
      else
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
        this.props.t("Move",{steps:Math.round(0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint]))})
          // "Move " +
            // Math.round(
              // 0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint])
            // ) 
          // +
          //   " steps forward"
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
      this.props.t("You are about to reach",{location:ElementMap.get(refinedPoints[nRefined - 1].x +"@" +refinedPoints[nRefined - 1].y).name,direction:this.findDirectionAbbreviation(angle)}));
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
          // "You are about to reach:" +
            // ElementMap.get(
              // refinedPoints[nRefined - 1].x +
                // "@" +
                // refinedPoints[nRefined - 1].y
            // ).name 
            // +
          // " on your " +
          // this.findDirectionAbbreviation(angle)
      word = this.findDirectionword(angle);
      DirectionResults.push(word);
      DirectionResults.push(
      this.props.t("Move",{steps:Math.round(0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint]))})
        // "Move " +
        //   Math.round(
        //     0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint])
        //   ) +
        //   " steps forward"
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
                ElementMap.get(i + "@" + j).name +
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
      this.props.t("You have reached",{location:ElementMap.get(
        "" +
          refinedPoints[nRefined - 1].x +
          "@" +
          refinedPoints[nRefined - 1].y
      ).name}));
      // "You have reached " +
      //   ElementMap.get(
      //     "" +
      //       refinedPoints[nRefined - 1].x +
      //       "@" +
      //       refinedPoints[nRefined - 1].y
      //   ).name
    
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
    var utter = new window.SpeechSynthesisUtterance(step);
    let lang = localStorage.getItem('Language');
    if(lang === "Hindi"){
      utter.lang = 'hi-IN'
    }else{
      utter.lang = 'en-US'
    }
    window.speechSynthesis.cancel();

    if(this.state.animation  === true){
      // console.log("utter",utter)
      window.speechSynthesis.speak(utter);
    }
      // for (let k = 0; k < DirectionResults.length; k++) {
      //   this.setState(prevState => ({
      //     pathCaption: [...prevState.pathCaption, DirectionResults[k]],
      //   }));
      // }

      this.setState(prevState=>({
        pathArray:[...prevState.pathArray,DirectionResults],
        srtdFlr:[...prevState.srtdFlr,floor]
      }),()=>{
        let flrArry = [this.state.srcfloor,this.state.dstfloor];
        if(this.state.pathArray.length === 2){

          for(let k=0;k<flrArry.length;k++){
            if(this.state.srtdFlr[k] === flrArry[k]){
              const merge3 = this.state.pathArray.flat(1); 
              console.log("merge",merge3)
              this.setState({
                pathCaption:merge3
              })
            }
          }
        }
      })
  };

  calculatePath = (path_angle,diff,CurrentDirection)=>{
    let pathGN,rotateDirection,path_angleN;
    if ((path_angle >= 0) && (path_angle < 106)){
        pathGN = 360-(diff-path_angle);
        rotateDirection = pathGN - CurrentDirection;
      }
    else if ((path_angle > 105) && (path_angle <= 180)){
        pathGN = path_angle-diff;
        rotateDirection = pathGN - CurrentDirection;
      }
    else if((path_angle <= -1) &&  (path_angle >= -180)){
        path_angleN= 180+path_angle;
        pathGN = path_angleN+ 180 - diff;
        rotateDirection = pathGN - CurrentDirection;
      }
      return rotateDirection;
  }


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
          buildingView: true
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
    console.log("e", e);
    let name = null;
    let val = null;
    let floor = null;
    let resp = "";
    let navInfo = this.props.navigationInfo;
    for (let i = 0; i < navInfo.length; i++) {
      console.log("ssdsd", e[0].floorElement, navInfo[i].properties.roomName);
      if (e[0].floorElement === "Rooms") {
        resp = `${e[0].roomName}(${e[0].floor})`;
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
    console.log("indd", ind, floor);
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
        resp = `${e.type} Washroom (${e.floor})`;
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

  render() {
    const {
      value,
      dstValue,
      suggestions,
      dstSuggestions,
      sidebarLeft
    } = this.state;

    // Autosuggest will pass through all these props to the input.
    const srcInputProps = {
      placeholder: "Source Location",
      value: value,
      onChange: this.onChange
    };

    const dstInputProps = {
      placeholder: "Destination",
      value: dstValue,
      onChange: this.onSrcChange
    };

    return (
      <div className="landing-height">
        <nav className="navbar navbar-expand-lg nav-bg text-white">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarToggleExternalContent"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => {
              // showSidebar(!sidebarLeft)
              this.setState({ showTool: !this.state.showTool });
            }}
          >
            <i className="fa fa-bars text-white" />
          </button>
          <div className="mx-auto"> Select Destination </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarToggleExternalContent"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => {
              // showSidebar(!sidebarLeft)
              this.setState({ showTool: !this.state.showTool });
            }}
          >
            <i className="fa fa-gear text-white"></i>
            {/* <i className="fa fa-bars text-white" /> */}
          </button>
          <Drawer
            open={sidebarLeft}
            onRequestClose={() => this.toggle("sidebarLeft", false)}
            modalElementClass={Sidebar}
            direction="left"
          >
            <div className={Card}>
              <div className=" navbar-menu-wrapper d-flex align-items-stretch"></div>
            </div>
          </Drawer>
        </nav>

        <div className="bg-landing h-100">
          <div className="text-white mx-auto row w-75">
            <div className="col-lg-12 mt-3">
              <div className="d-flex" id="dropdown-container">
                <Typeahead
                  placeholder={`Select Venue`}
                  // isLoading={this.state.isLoading}
                  required
                  filterBy={["name"]}
                  labelKey={option => {
                    return option.venueName.split(/(?=[A-Z])/).join(" ")
                    // return option.venueName;
                  }}
                  onChange={this.handleVenueChange}
                  disabled={false}
                  id="source field2"
                  onClick={() => {
                    console.log("not clicked");
                  }}
                  className="form-control-dashboard mt- mb-2"
                  value={this.state.venueName}
                  options={this.state.venueList}
                  name="list"
                  style={{ zIndex: "999" }}
                  inputProps={
                    {
                      readOnly: this.state.srcReadOnly
                    }
                  }
                  // onClick = {(this.state.srcName.length !== 0)?this.setState({srcReadOnly:!this.state.srcReadOnly}):this.setState({srcReadOnly:false})}
                  // onFocus={this.handleFocus}
                  onBlur={e => {
                    // this.setState({ srcReadOnly: false });
                  }}
                  // ref={typeahead => (this.typeahead = typeahead)}
                />
                <div className="suggestion">
                  <img
                    src="/inclunav/assets/images/Vector.png"
                    alt="hide password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-white mx-auto row w-75">
            <div className="col-lg-12 ">
            <div className="d-flex" id="dropdown-container">
            <Typeahead
                placeholder={`Select Building`}
                // placeholder={`${this.state.defSrc}`}
                // isLoading={this.state.isLoading}
                required
                filterBy={["name"]}
                labelKey={option => {
                  return option.buildingName.split(/(?=[A-Z])/).join(" ");
                  // return option.floorElement === "FloorConnection" ||
                  //   option.floorElement === "RestRooms"
                  //   ? `${option.name} (${option.floor})`
                  //   : `${option.name}`;
                }}
                onChange={this.handleBuildingChange}
                disabled={false}
                id="source"
                onClick={() => {
                  console.log("not clicked");
                  // this.setState({ srcReadOnly: false });
                }}
                value={this.state.buildingName}
                options={this.state.buildingList}
                name="list"
                className="mb-2 form-control-dashboard"
                // style={{ zIndex: "999" }}
                inputProps={
                  {
                    // readOnly: this.state.srcReadOnly
                  }
                }
                // onClick = {(this.state.srcName.length !== 0)?this.setState({srcReadOnly:!this.state.srcReadOnly}):this.setState({srcReadOnly:false})}
                // onFocus={this.handleFocus}
                onBlur={e => {
                  // this.setState({ srcReadOnly: false });
                }}
                // ref={typeahead => (this.typeahead = typeahead)}
              />
                <div className="suggestion">
                  <img
                    src="/inclunav/assets/images/Vector.png"
                    alt="hide password"
                  />
                </div>
              </div>

             
            </div>
          </div>
          <div className="text-white mx-auto row w-75">
            <div className="col-lg-12 ">
            <div className="d-flex" id="dropdown-container">
            <Typeahead
                required
                placeholder={`Starting Point`}
                filterBy={["name"]}
                labelKey={option => {
                  let resp = "";
                  if (option.floorElement === "Rooms") {
                    resp = `${option.roomName}(${option.floor})`;
                  } else if (option.floorElement === "FloorConnection") {
                    resp = `${option.name}(${option.floor})`;
                  } else if (option.floorElement === "Services") {
                    resp = `${option.type}(${option.floor})`;
                  } else if (option.floorElement === "RestRooms") {
                    resp = `${option.type} Washroom (${option.floor})`;
                  } else {
                    return "";
                  }
                  return resp;
                }}
                onChange={this.handleSrcChange}
                disabled={false}
                id="source"
                onClick={() => {
                  console.log("not clicked");
                  // this.setState({ srcReadOnly: false });
                }}
                value={this.state.srcName}
                options={this.state.list}
                name="list"
                className="mb-2 form-control-dashboard"
                // style={{ zIndex: "999" }}
                inputProps={
                  {
                    // readOnly: this.state.srcReadOnly
                  }
                }
                // onClick = {(this.state.srcName.length !== 0)?this.setState({srcReadOnly:!this.state.srcReadOnly}):this.setState({srcReadOnly:false})}
                // onFocus={this.handleFocus}
                onBlur={e => {
                  // this.setState({ srcReadOnly: false });
                }}
                // ref={typeahead => (this.typeahead = typeahead)}
              />
                <div className="suggestion">
                  <img
                    src="/inclunav/assets/images/Vector.png"
                    alt="hide password"
                  />
                </div>
              </div>

              
            </div>
          </div>
          <div className="text-white mx-auto row w-75">
            <div className="col-lg-12 mb-2">
            <div className="d-flex" id="dropdown-container">
            <Typeahead
                required
                placeholder={`Starting Destination`}
                filterBy={["name"]}
                labelKey={option => {
                  let resp = "";
                  if (option.floorElement === "Rooms") {
                    resp = `${option.roomName}(${option.floor})`;
                  } else if (option.floorElement === "FloorConnection") {
                    resp = `${option.name}(${option.floor})`;
                  } else if (option.floorElement === "Services") {
                    resp = `${option.type}(${option.floor})`;
                  } else if (option.floorElement === "RestRooms") {
                    resp = `${option.type} Washroom (${option.floor})`;
                  } else {
                    return "";
                  }
                  return resp;
                }}
                onChange={this.handleDstChange}
                disabled={false}
                id="source"
                onClick={() => {
                  console.log("not clicked");
                  // this.setState({ srcReadOnly: false });
                }}
                value={this.state.dstName}
                options={this.state.list}
                name="list"
                className="mb-2 form-control-dashboard"
                // style={{ zIndex: "999" }}
                inputProps={
                  {
                    // readOnly: this.state.srcReadOnly
                  }
                }
                // onClick = {(this.state.srcName.length !== 0)?this.setState({srcReadOnly:!this.state.srcReadOnly}):this.setState({srcReadOnly:false})}
                // onFocus={this.handleFocus}
                onBlur={e => {
                  // this.setState({ srcReadOnly: false });
                }}
                // ref={typeahead => (this.typeahead = typeahead)}
              />
                <div className="suggestion">
                  <img
                    src="/inclunav/assets/images/Vector.png"
                    alt="hide password"
                  />
                </div>
              </div>
             
            </div>
          </div>
          <div className="row w-100">
              {this.state.pathCaption.map((r, i) => {
                if (i === this.state.currentStep) {
                  return (
                    <div
                      className="col-sm-12 d-flex justify-content-center font-weight-bolder text-info ml-2 mr-2"
                      // id={`show_${this.imgDiv}`}
                    >
                      {r}
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <div className="row">
              {/* <div className="col-6">{this.previousButton()}</div> */}
              {/* <div className="col-6">{this.nextButton()}</div> */}
            </div>

          <div hidden={this.state.buildingView}>
            <MapContainer
              style={{ height: "100vh" }}
              center={center}
              zoom="5"
              ref={m => {
                this.leafletMap = m;
              }}
              onClick={this.handleClick}
            >
              {/* <SetViewOnClick animateRef={this.animateRef} /> */}
              <TileLayer
                attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
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
            style={{ height: "400px", width: "100%", overflow: "scroll" }}
          >
            <div>
              <img
                alt="map"
                id="myImage"
                src={`${config.imgUrl}/${this.state.imgName}`}
                hidden={true}
              ></img>
              <div id="mydiv1"></div>
              <div className="canvaDiv" ref="canv" onScroll={this.handleScroll}>
                <canvas
                  id="myCanvassrc"
                  width={this.state.canvasWidth}
                  height={this.state.canvasHeight}
                  style={{ border: "1px solid #ca2d2d", position: "absolute" }}
                  hidden={!this.state.samefloor}
                ></canvas>
              </div>
              <div id="mydiv"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    getImage: state.imgDetails,
    allNodes: state.getAllElem,
    //   bList: state.buildingList,
    flrList: state.floorList,
    navigationInfo: state.navigationInfo,
    vnList: state.venueList,
    bldList: state.buildingList
  };
};

export default connect(mapStateToProps, {
  floorList,
  imgDetails,
  getAllBuildingElements,
  venueList,
  buildingList
})(Test);
