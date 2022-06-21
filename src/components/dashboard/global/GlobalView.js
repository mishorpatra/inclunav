import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import config from "../../../config";
import { connect } from "react-redux";
import { Logout, ThreeSixty } from '@material-ui/icons'
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
import BottomBar from "./BottomBar";
import Instructions from "./Instructions";
import {
  getHaversineDistance,
  distance,
  obtaincoordinates,
  findInstructions,
  simplifyPath
} from "./module";
import {
  Map as MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON
} from "react-leaflet";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import L from "leaflet";
import hash from "object-hash";
import "../../navStyles.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#27282D",
    width: "75%"
  },
  overlay: { zIndex: 9999 }
};

/**
 * @id  N1.1.1
 * @author Anirudh Khammampati & Sai Kumar Reddy
 * @description Create graph node
 */

var special = ['base2','base1','ground','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelvth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
var fullPath = []
// import {Graph} from "./Graph";
class Graph { 
  // defining vertex array and 
  // adjacent list 
  constructor(noOfVertices) 
  { 
      this.noOfVertices = noOfVertices; 
      this.AdjList = new Map(); 
      this.Adjweights = new Map();
  } 

  // functions to be implemented 

  // addVertex(v) 
  addVertex(v) 
  { 
      // initialize the adjacent list with a 
      // null array 
      this.AdjList.set(v, []); 
      this.Adjweights.set(v,[]);
  } 
  hasvertex(v){
    return this.AdjList.has(v);
  }
  edges(v){
    return this.AdjList.get(v);
  }
  addEdge(v, w, wt,undir) 
  { 
      if(undir){

        // get the list for vertex v and put the 
        // vertex w denoting edge between v and w 
        this.AdjList.get(v).push(w); 
        this.Adjweights.get(v).push(wt);
        // Since graph is undirected, 
        // add an edge from w to v also 
        this.AdjList.get(w).push(v); 
        this.Adjweights.get(w).push(wt);
      }
      else{
        this.AdjList.get(v).push(w); 
        this.Adjweights.get(v).push(wt);
      }
  }

  // Prints the vertex and adjacency list 
  printGraph() 
  { 
      // get all the vertices 
      var get_keys = this.AdjList.keys(); 

    
      // iterate over the vertices 
      for (var i of get_keys)  
  { 
          // great the corresponding adjacency list 
          // for the vertex 
          var get_values = this.AdjList.get(i);

          var val = this.Adjweights.get(i); 
          var conc = ""; 
          var conc2 = ""; 
    
          // iterate over the adjacency list 
          // concatenate the values into a string 
          for (var j of get_values) 
              conc += j + " "; 
          for (var j of val) 
            conc2 += j + " ";
          // print the vertex and its adjacency list 
      } 
  }
} 
/**
 * @id  N1.1.2
 * @author Pankaj Singh
 * @description Global center of osm
 */
const center = { lat: 28.6139, lng: 77.209 };
/**
 * @id  N1.1.3
 * @author Pankaj Singh
 * @description OSM Marker List
 */
let female_toileticon = L.divIcon({
  className: "custom-div-icon",
  html:
    "<div style='background-color:#4b85bb;' class='marker-pin'></div><i class='fa fa-female awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
});

let male_toileticon = L.divIcon({
  className: "custom-div-icon",
  html:
    "<div style='background-color:#4b85bb;' class='marker-pin'></div><i class='fa fa-male awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
});

let lifticon = L.divIcon({
  className: "custom-div-icon",
  html:
    "<div style='background-color:#4b85bb;' class='marker-pin'></div><i class='fa fa-street-view awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
});
let watericon = L.divIcon({
  className: "custom-div-icon",
  html:
    "<div style='background-color:#4b85bb;' class='marker-pin'></div><i class='fa fa-glass awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
});
let stairicon = L.divIcon({
  className: "custom-div-icon",
  html:
    "<div style='background-color:#4b85bb;' class='marker-pin'></div><i class='fa fa-align-left awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
});

let source = L.divIcon({
  className: "custom-div-icon",
  html:
    "<div style='background-color:#4b85bb;' class='marker-pin'></div><i class='fas fa-crosshairs awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
});

let destination = L.divIcon({
  className: "custom-div-icon",
  html:
    "<div style='background-color:#4b85bb;' class='marker-pin'></div><i class='fa fa-map-pin awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
});

let doticon = L.divIcon({
  className: "custom-div-icon",
  html: "<div  class='marker-pin1'></div>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
});

let sourceIcon = L.divIcon({
  className: "custom-div-icon",
  html: "<div style='background-color:#4b85bb;' class='marker-pin'></div><i class='fa fa-location-arrow awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
})

let destinationIcon = L.divIcon({
  className: "custom-div-icon",
  html: "<div style='background-color:#4b85bb;' class='marker-pin'></div><i  class='fa fa-map-pin awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -30]
})

var myStyle = {
  //Style to display the non-walkable linestrings
  color: "#000000",
  weight: 3,
  opacity: 0.7
};
/**
 * @id  N1.1.34
 * @author Pankaj Singh
 * @description Marker
 */
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

class GlobalView extends React.Component {
  constructor(props) {
    super(props);
    let token = localStorage.getItem("token");
    //console.log(token)
    if (!token) {
      this.props.history.push("/login");
    }
    
    this.state = {
      venueList: [],
      open : true,
      buildingList: [],
      flrList: [],
      selectedVenue: "Select Venue",
      selectedBuilding: "",
      geoJSON: [],
      pathgeoJSON: [],
      geoJSONPoly: [],
      showpath: false,
      fullPath: [],
      landmark: [],
      landMarks:[],
      polygons:[],
      selectNavigation: false,
      srcFlrInstructions:[],
      dstFlrInstructions:[],
      backgroundPoly: {
        // background layer for SIT building
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [77.19015095013468, 28.545269361046977],
                  [77.19040173667757, 28.54534708573104],
                  [77.19028371948092, 28.54564396115854],
                  [77.19003561514704, 28.545566236693578],
                  [77.19015095013468, 28.545269361046977]
                ]
              ]
            }
          }
        ]
      },
      floor: "",
      srcName: "Source",
      srcData: [],
      dstName: "Destination",
      dstData: [],
      showServices: false,
      venueMarker: center,
      floorSelect: false,
      showMarker: false,
      showInstructions: false,
      instructions: [],
      venueNavigation: [],
      globalRefPointsList:[],
      buildingCluster:[],
      buildingPolyCluster:[],
      srcFloorSp:[],
      dstFloorSp:[],
      srcFloorPoly:[],
      dstFloorPoly:[],
      srcFloorLandMark:[],
      dstFloorLandMark:[],
      floorList:[],
      navigationStrt:false,
      samefloor:true,
      currentFloor:"",
      zoom: 18
    };
    this.shortestPathVar = [];
    // minpath var 
    this.grids_all=[];
    this.grids=[];
    this.visited=[];
    this.shortestpath =[];
    this.minimumcost=[];
    this.leaves=[];
    this.graph = null;
    this.flrconn = [];
    this.num_floors=0;
    this.pt = 0;
    
    this.landMarks = [];
    this.polygons = [];
    this.distLandmark = [];
    this.venueLandmark = [];
    this.buildingPoly = [];
    this.srcFloorSp = [];
    this.dstFloorSp = [];
    this.srcFloorPoly = [];
    this.dstFloorPoly = [];
    this.srcFloorLandmark = [];
    this.dstFloorLandmark = [];
    this.srcFlrInstructions = [];
    this.dstFlrInstructions = [];
  }
  

  mod() {

   

    return (
      <div>
        <Modal
          isOpen={this.state.open}
          // onAfterOpen = {afterOpenModal}
          onRequestClose={this.onCloseModal}
          style={customStyles}
          contentLabel="Example Modal"
          // open = {this.state.open} onClose={this.onCloseModal}
        >
          <div className="row">
            <div className="col-12 text-center mt-4">
              <img
                width="25"
                height="25"
                src="assets/images/saved_address.svg"
                alt="vew details"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-white text-center">
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-white text-center font-weight-bold">
              <p className="h4"> Please choose the Required Path </p>
            </div>
          </div>

          {this.state.showOption ? (
            <div
              className="d-flex-column justify-content-center bg-white rounded"
              style={{ padding: "1px" }}
            >
              <div
                className="save-address-box row text-white mt-1 mb-2 ml-1 row"
                onClick={() => {

                }}
              >
                <div className="col-2 my-auto">
                </div>
                <div className="col-10 my-auto">Shortest Path</div>
              </div>
              <div
                className="save-address-box row text-white mt-1 mb-2 ml-1 row"
                onClick={() => {
                  this.setState({
                    type: "Home"
                  });
                }}
              >
                <div className="col-2 my-auto">
                </div>
                <div className="col-10 my-auto">Simplest Path</div>
              </div>
              <div
                className="save-address-box row text-white mb-2 ml-1"
                onClick={() => {
                  this.setState({
                    type: "Home"
                  });
                }}
              >
                <div className="col-2 my-auto">

                </div>
                <div className="col-10 my-auto">Safest Path</div>
              </div>
              
              <div
                className="save-address-box row text-white mb-2 ml-1"
                onClick={() => {
                  this.setState({
                    showOption: false
                  });
                }}
              >
                <div className="col-2 my-auto">
                </div>
                <div className="col-10 my-auto">Accesible Path</div>
              </div>
            </div>
          ) : (
            <input
              type="text"
              className="form-control w-100"
              placeholder="Enter Custom Name"
              value={this.state.type}
              onChange={e => {
                this.setState({
                  type: e.target.value
                });
              }}
            />
          )}

          <div className="row w-100 m-0 pb-5 mt-2">
            <div className="col-6">
            </div>
            <div className="col-6">
              <button
                className={
                  "btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"
                }
                onClick={() => {
                  this.onCloseModal();
                }}
                style={{
                  width: "84px",
                  height: "48px",
                  float: "right"
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </Modal>
        </div>)
    }
  /**
   * @id  N1.1.2
   * @author Pankaj Singh
   * @description Initial rendering of component
   */
  componentDidMount() {
    this.getVenueList();
    if (window.navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success => {
        this.setState({
          center: {
            lat: success.coords.latitude,
            lng: success.coords.longitude
          },
          currentPos: {
            lat: success.coords.latitude,
            lng: success.coords.longitude
          }
        });
      });
    }
  }
  /**
   * @id  N1.1.3
   * @author Pankaj Singh
   * @description Get venue list
   */
  getVenueList = (coordinates = null) => {
    this.props.venueList(() => {
      this.setState({
        venueList: this.props.vnList?.data
      });
    });
  };
  /**
   * @id  N1.1.4
   * @author Pankaj Singh
   * @param venueName
   * @description Select venue
   */
  selectedVenue = (venueName, coordinates = null) => {
    this.setState(
      {
        selectedVenue: venueName,
        venueMarker: { lat: coordinates[0], lng: coordinates[1] }
      },
      () => {
        this.getBuildingList(venueName);
      }
    );
  };
  /**
   * @id  N1.1.5
   * @param venueName
   * @author Pankaj Singh
   * @description get building list
   */
  getBuildingList = (venueName, coordinates = null) => {
    this.props.buildingList({ venueName: venueName }, () => {
      this.setState(
        {
          buildingList: this.props.bldList.data,
          selectNavigation:true
        },
        () => {
          let lat = this.state.buildingList[0]?.lat;
          let lng = this.state.buildingList[0]?.lng;
          const map = this.leafletMap.leafletElement;
          let bldList = this.state.buildingList;
          var globalRef = [];
          this.globalList(bldList,venueName,globalRef);
          map.flyTo(new L.LatLng(lat, lng), map.getZoom(), {
            animate: true,
            duration: 1
          });
        }
      );
    });
  };

    /**
   * @id  N1.1.10
   * @author Pankaj Singh
   * @param bldList
   * @param venueName
   * @description get all landmark within venue
   */
  globalList = (bldList, venueName,globalRef) => {
    bldList.forEach((element, i) => {
      this.mapReferencePoint(element,element.buildingName,globalRef)
    });
  };

      /**
   * @id  N1.1.6
   * @author Ushaswini Chintha
   * @param floor
   * @description Get global reference point of ground floor of a building
   */
  mapReferencePoint = (element,buildingName,globalRef)=>{
    let { selectedVenue, dstData } = this.state;
    this.props.refPoint(
      selectedVenue,
      buildingName,
      "ground",
      () => {
        globalRef.push({buildingName:buildingName,refPoints:this.props.globalCoords.coordinates})
        this.setState(
          {
            glbCoords: this.props.globalCoords.coordinates
          },
          () => {
            if(globalRef.length === this.state.buildingList.length){
              this.setState({
                globalRefPointsList:globalRef
              },()=>{
                let refPoints = this.state.globalRefPointsList;
                refPoints.forEach(r=>{
                  this.createBackgroudLayer(element,r.refPoints,r)
                })
              })
            }
          }
        );
      }
    );
  }
  /**
   * @id  N1.1.7
   * @author Ushaswini Chintha
   * @description Create Backround layer of building
   */
  createBackgroudLayer = (element,refPoints,r)=>{
    let arr = refPoints.map(r => {
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
            ]
          }
        }
      ]
    };
    const map = this.leafletMap.leafletElement;
    L.geoJson(poly, { style: myStyle_background }).addTo(map);
    this.setState({
      backgroundPoly: poly
    },()=>{
      let lists = this.state.globalRefPointsList;
      // lists.forEach(r=>{
        this.props.globalNavigation(
          { venueName: this.state.selectedVenue, buildingName: r.buildingName },
          () => {
            let arr = [];
            let arr1 = [];
            this.saveAllLadmark(arr,arr1,element,this.state.buildingList,r.refPoints,r)
          }
        );
      // })
    });
  }
/**
   * @id  N1.1.11
   * @param arr
   * @param element
   * @param bldList
   * @author Pankaj Singh
   * @description get all landmakr withing venue
  */
  saveAllLadmark = (arr,arr1,element,bldList,globalCoords,r)=>{
    let data = this.props.androidNav;
    let building = r.buildingName;
    this.props.floorList(
      { venueName: this.state.selectedVenue, buildingName: building },
      () => {
        let flrList = this.props.flrList.data;
        let length = flrList.length;
        let sliced = data.slice(data.length - length)
        data.splice(
          data.length - length,
          length
        );
        this.buildingPoly.push({building:building,data:sliced})
        this.venueLandmark.push({building:building,data:data})
        data.forEach((element)=> {
          element.buildingName = building;
        });
        let grdData = []
         data.forEach(r=>{
          if(r.floor === "ground"){
            grdData.push(r)
          } 
        })
        let grdDataPoly = []
        for(let k=0;k<sliced.length;k++){
            if(sliced[k].floor === "ground"){
              grdDataPoly.push(sliced[k])
            } 
        }
        this.handleLocalGlobal(grdData,grdDataPoly,building,globalCoords)
        arr.push(data);
        this.distLandmark.push(data)
        if (this.distLandmark.length === bldList.length) {
          var oldArray = this.distLandmark;
          let buildingCluster = oldArray.map(r=>{
            return {buildingName:r[0].buildingName,data:r}
          })
           var newArray = Array.prototype.concat.apply([], oldArray);
           this.setState({
            venueData:arr1,
            venueNavigation: newArray,
            buildingCluster:buildingCluster,
            buildingPolyCluster:this.buildingPoly
            // landMarks:landMarks,
            // polygons:polygons
            // redData: red_data,
            // polyData: poly_data
          });
        }
      }
    );
  }
 /**
   * @id  N1.1.14
   * @author Ushaswini Chintha
   * @description convert local floor element and non walkables coordinates to global coordinates
   */
  handleLocalGlobal = (redData,polyData,buildingName,globalCoords,floor =null) => {
    let crd = globalCoords;
    var coords = []; // "breadth":"154","length":"173" , conversion: *3.28084
    this.coordHashMap(crd,coords)
    // let { redData, polyData } = this.state;
    let red_data = redData;
    let poly_data = polyData;
    //finding the point with lowest latitude and highest longitude
    var least_lat = 0;
    var high_lon = 0;
    //finding the point with lowest latitude and highest longitude
    least_lat = this.findLeastLat(coords,least_lat)
    //evaluating high_lon
    var c1 = least_lat === 3 ? 0 : least_lat + 1;
    var c2 = least_lat === 0 ? 3 : least_lat - 1;
    var high_lon = coords[c1]?.lon > coords[c2]?.lon ? c1 : c2;
    ///lengths between given 4 global co-ordinates
    var lengths = [];
    this.betweenLength(coords,lengths)  
    // building angle with equator or true horizontal
   var out =  this.buildingAngle(coords,least_lat,high_lon)
    // Vertical alignment or lift correction
    var diff = []; //array to store offset of each floor
    this.liftCorrection(red_data,diff)
    // loop to calculate all the coordinates of local points
    var local_coords = { localx: 0, localy: 0 };
    this.coordGlblLandmark(red_data,diff,local_coords,coords,least_lat,high_lon,out)
    //converting to geoJSON format
    let geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    this.geoJsonLandmark(red_data,geoJSON) 
    ///// nonWalkableGrids Calculations
    var local_coords = { localx: 0, localy: 0 };
    this.coordGlblPolygon(poly_data,local_coords,diff,coords,least_lat,high_lon,out)
    //converting to geoJSON format
    let geoJSON_poly = {
      type: "FeatureCollection",
      features: []
    };
    this.geoJSONPoly(poly_data,geoJSON_poly) 
    this.landMarks.push({buildingName:buildingName,geoJSON:geoJSON})
    this.polygons.push({buildingName:buildingName,geoJSONPoly: geoJSON_poly})
    if(this.state.dstName !== "Destination" && (this.state.dstData.floor === this.state.srcData.floor)){
      this.setState({
        landMarks:this.landMarks,
        polygons:this.polygons,
        showMarker:true,
        geoJSON:this.landMarks
      },()=>{
        this.singleFloorNav(globalCoords)
      })
    }else if(this.state.dstName !== "Destination" && (this.state.dstData.floor !== this.state.srcData.floor)){
      if(floor === this.state.srcData.floor){
        this.srcFloorPoly = geoJSON_poly
        this.srcFloorLandmark = geoJSON
      }else{
        this.dstFloorPoly = geoJSON_poly
        this.dstFloorLandmark = geoJSON
      }
    }
    if(!this.state.navigationStrt && this.landMarks.length === this.state.buildingList.length){
      this.setState({
        landMarks:this.landMarks,
        polygons:this.polygons
      })
    }
    // this.setState({
    //   // geoJSON: geoJSON,
    //   // geoJSONPoly: geoJSON_poly,
    
    //   currentPos: {
    //     lat: geoJSON.features[0].properties.latitude,
    //     lng: geoJSON.features[0].properties.longitude
    //   }
    // },()=>{
    //   // this.singleFloorNav()
    //   // this.callGlobal(shortestpath)
    // });
  };
  /**
   * @id  N1.1.6
   * @param option
   * @author Pankaj Singh
   * @description option from venue details
   */
  sourceLabel = option => {
    let resp = "";
    if (option.element.type === "Rooms") {
      resp = `${option.name}(${option.floor},${option.buildingName})`;
    } else if (option.element.type === "FloorConnection") {
      resp = `${option.properties.name}(${option.floor},${option.buildingName})`;
    } else if (option.element.type === "Services") {
      if (option.element.subType === "beacons") {
        resp = ``;
      } else {
        resp = `${option.element.subType}(${option.floor},${option.buildingName})`;
      }
    } else {
      resp = "";
    }
    return resp;
  };
  /**
   * @id  N1.1.7
   * @param option
   * @author Pankaj Singh
   * @description UI for menu of typeahead
   */
  renderSourceMenu = option => {
    let resp = "";
      if (option.element.type === "Rooms") {
        resp = `${option.name}(${option.floor},${option.buildingName})`;
      } else if (option.element.type === "FloorConnection") {
        resp = `${option.properties.name}(${option.floor},${option.buildingName})`;
      } else if (option.element.type === "Services") {
        if (option.element.subType === "beacons") {
          resp = ``;
        } else {
          resp = `${option.element.subType}(${option.floor},${option.buildingName})`;
        }
      } else {
        resp = "";
      }
    if (resp) {
      return (
        <div className="mapped-data m-0 " style={{ padding: "0" }}>
          <div className="row w-100">
            <div className="col-2">
              <div>
                <img
                  src="/inclunav/assets/images/destination2.svg"
                  alt="destination"
                />
              </div>
            </div>
            <div className="col-10">
              <div className="row">
                <div className="col-12">{resp}</div>
              </div>
              <div className="row">
                <div className="col-12 text-capitalize"></div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      );
    } else {
      return null;
    }
  };
    /**
   * @id  N1.1.8
   * @author Pankaj Singh
   * @description Set navigation on input field
   */
  setNavigation = () => {
    let {srcData,dstData,selectedVenue} = this.state;
      if(srcData.buildingName !== dstData.buildingName){
        this.multiBldNav()
      }else{
        this.grids_all=[];
        // this.createGraph()
        let building = this.state.dstData.buildingName;
        let flrData =  this.state.buildingCluster.filter(r=>r.buildingName === this.state.dstData.buildingName)[0]?.data;
        let polyData =  this.state.buildingPolyCluster.filter(r=>r.building === this.state.dstData.buildingName)[0]?.data;
        let refPoint =  this.state.globalRefPointsList.filter(r=>r.buildingName === this.state.dstData.buildingName)[0]?.refPoints;

      if(srcData.floor !== dstData.floor){
        this.multiFloorNav()
      }else{        
        let flrMarkData = []
        flrData?.forEach(r=>{
          if(r.floor === this.state.dstData.floor){
            flrMarkData.push(r)
          } 
        })
        let flrDataPoly = []
        if(polyData) for(let k=0;k<polyData.length;k++){
            if(polyData[k].floor === this.state.dstData.floor){
              flrDataPoly.push(polyData[k])
            } 
        }
        this.landMarks = [];
        this.polygons = []
        this.handleLocalGlobal(flrMarkData,flrDataPoly,building,refPoint)
        // this.props.refPoint(
          // selectedVenue,
          // this.state.dstData.buildingName,
          // "ground",
          // () => {
            // this.props.globalNavigation(
            //   { venueName: selectedVenue, buildingName: this.state.dstData.buildingName },
            //   () => {
            //     this.fltrNvgnData(this.state.dstData.floor)
            //   }
            // );
        //   }
        // );
      }
    }
  };
  /**
   * @id  N1.1.9
   * @author Pankaj Singh
   * @description Building to building Navigation
   */
  multiBldNav = () => {
    
  };
    /**
   * @id  N1.1.10
   * @author Pankaj Singh
   * @description floor to floor navigation
   */
  multiFloorNav = () => {
    this.props.getAllBuildingElements(
      {
        venueName: this.state.selectedVenue,
        buildingName: this.state.dstData.buildingName
      },
      () => {
    this.createGraph()
      })
  };
    /**
   * @id  N1.1.11
   * @author Ushaswini Chintha
   * @param floor
   * @description Filter out landmark and nonwalkable from  building data
   */
  fltrNvgnData = (floor)=>{
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
        this.handleLocalGlobal();
        // this.mapReferencePoint()
        // this.singleFloorNav()
    }
    );
  }


 
  /**
   * @id  N1.1.6
   * @author Pankaj Singh
   * @description get floor list
   */
  getData = (building) => {
    let data = { venueName: this.state.selectedVenue, buildingName: building };
    this.props.floorList(data, () => {
      let flrList = this.props.flrList.data;
      this.setState({
        flrList: flrList,
        selectedBuilding: building
      });
    });
  };

  /**
   * @id  N1.1.12
   * @author Pankaj Singh
   * @description get get complete building data thart
   */
  getCompleteData = floor => {
    let { selectedVenue, selectedBuilding } = this.state;
    this.props.globalNavigation(
      { venueName: selectedVenue, buildingName: selectedBuilding },
      () => {
        this.fltrNvgnData(floor)
      }
    );
  };



  /**
   * @id  N1.1.17
   * @author Ushaswini Chintha
   * @description Create Coordinate hasmap
   */
  coordHashMap = (crd,coords)=>{
    if(crd) coords[0] = {
      lat: parseFloat(crd[0].globalRef.lat),
      lon: parseFloat(crd[0].globalRef.lng),
      localx: parseInt(crd[0].localRef.lat),
      localy: parseInt(crd[0].localRef.lng)
    };
    if(crd) coords[1] = {
      lat: parseFloat(crd[3].globalRef.lat),
      lon: parseFloat(crd[3].globalRef.lng),
      localx: parseInt(crd[3].localRef.lng),
      localy: parseInt(crd[3].localRef.lat)
    };
    if(crd) coords[2] = {
      lat: parseFloat(crd[2].globalRef.lat),
      lon: parseFloat(crd[2].globalRef.lng),
      localx: parseInt(crd[2].localRef.lng),
      localy: parseInt(crd[2].localRef.lat)
    };
    if(crd) coords[3] = {
      lat: parseFloat(crd[1].globalRef.lat),
      lon: parseFloat(crd[1].globalRef.lng),
      localx: parseInt(crd[1].localRef.lng),
      localy: parseInt(crd[1].localRef.lat)
    };
  }
    /**
   * @id  N1.1.18
   * @author Ushaswini Chintha
   * @description Create Coordinate hasmap
   */
  findLeastLat = (coords,leastLat)=>{
    for (let i = 0; i < coords.length; i++) {
      if (coords[i].lat == coords[leastLat].lat) {
        //handling two points with equal lat
        if (coords[i].lon > coords[leastLat].lon) {
          leastLat = i;
        }
      } else if (coords[i].lat < coords[leastLat].lat) {
        leastLat = i;
      }
    }
    return leastLat
  }
  /**
   * @id  N1.1.19
   * @author Ushaswini Chintha
   * @description Create Coordinate hasmap
   */
  betweenLength = (coords,lengths)=>{
    for (let i = 0; i < coords.length; i++) {
      var temp1;
      if (i == coords.length - 1) {
        temp1 = getHaversineDistance(coords[i], coords[0]);
      } else {
        temp1 = getHaversineDistance(coords[i], coords[i + 1]);
      }
      lengths.push(temp1);
    }
  }
    /**
   * @id  N1.1.20
   * @author Ushaswini Chintha
   * @description buildingAngle
   */
  buildingAngle = (coords,leastLat,highLon)=>{
    let b = getHaversineDistance(coords[leastLat], coords[highLon]);
    const horizontal = obtaincoordinates(coords[leastLat], 0, b);
    let c = getHaversineDistance(coords[leastLat], horizontal);
    let a = getHaversineDistance(coords[highLon], horizontal);
    let out =
      (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
      return out
  }
/**
   * @id  N1.1.22
   * @author Ushaswini Chintha
   * @description lift correction
   */
  liftCorrection = (red_data,diff)=>{
    var ground_lift = red_data.filter(x => {
      return x.element.subType === "lift" && x.floor === "ground";
    });
    if (ground_lift.length != 0) {
      var nth_lift = 0; //loop to find which lift is across more floors
      for (let i = 0; i < ground_lift.length; i++) {
        var temp = red_data.filter(x => {
          return (
            x.element.subType === "lift" &&
            x.properties.name === ground_lift[i].properties.name
          );
        });
        if (
          temp.length >=
          red_data.filter(x => {
            return (
              x.element.subType === "lift" &&
              x.properties.name === ground_lift[nth_lift].properties.name
            );
          }).length
        ) {
          nth_lift = i;
        }
      }
      var lifts = red_data.filter(x => {
        return (
          x.element.subType === "lift" &&
          x.properties.name === ground_lift[nth_lift].properties.name
        );
      });
      for (let i = 0; i < lifts.length; i++) {
        var temp = {};
        temp.x = lifts[i].coordinateX - ground_lift[nth_lift].coordinateX;
        temp.y = lifts[i].coordinateY - ground_lift[nth_lift].coordinateY;
        temp.floor = lifts[i].floor;
        diff.push(temp);
      }
    }
  }
  /**
   * @id  N1.1.23
   * @author Ushaswini Chintha
   * @description lift correction
   */
  coordGlblLandmark = (red_data,diff,local_coords,coords,least_lat,high_lon,out)=>{
    for (let i = 0; i < red_data.length; i++) {
      if (diff.length > 1) {
        //vertical correction across floors
        var test = diff.filter(x => {
          return x.floor === red_data[i].floor;
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
  }
  /**
   * @id  N1.1.24
   * @author Ushaswini Chintha
   * @description conver geojson landmark
   */
  geoJsonLandmark = (red_data,geoJSON)=>{
    for (let i = 0; i < red_data.length; i++) {
      var p = red_data[i];
      if (p.name === "") {
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
  }

  /**
   * @id  N1.1.25
   * @author Ushaswini Chintha
   * @description generate global coordinates for non walkable polygon
   */
  coordGlblPolygon = (poly_data,local_coords,diff,coords,least_lat,high_lon,out)=>{
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
  }
  /**
   * @id  N1.1.26
   * @author Ushaswini Chintha
   * @description geojson for polygon
   */
  geoJSONPoly = (poly_data,geoJSON_poly)=>{
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
  }
  /**
   * @id  N1.1.11
   * @author Ushaswini Chintha
   * @description Call Handling
   */
  handleCall = (e, position) => {
    if (String(position.properties.contactNo) === "null") {
      /*to handle null values*/
      e.preventDefault();
      alert(` No contact number associated`);
    } else {
      window.location.href = "tel:" + position.properties.contactNo;
    }
  };
  /**
   * @id  N1.1.12
   * @author Ushaswini Chintha
   * @description Internet Browsing
   */
  handleInternet = (e, position) => {
    if (String(position.properties.url) === "null") {
      /*to handle null values*/
      e.preventDefault();
      alert(` No website associated`);
    } else {
      window.open(position.properties.url, "_blank" /*Open in a new window.*/);
    }
  };
  /**
   * @id  N1.1.13
   * @author Ushaswini Chintha
   * @description Whatsapp Messaging
   */
  handleWhatsapp = (e, position) => {
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
  /**
   * @id  N1.1.14
   * @author Ushaswini Chintha
   * @description Send Mail
   */
  handleEmail = (e, position) => {
    if (String(position.properties.email) == "null") {
      /*to handle null values*/
      e.preventDefault();
      alert(` No Email associated`);
    } else {
      window.location.href = `mailto: ${position.properties.email}`;
    }
  };
  /**
   * @id  N1.1.15
   * @author Ushaswini Chintha
   * @description Floor Element Info Details
   */
  handleInfo = (e, position) => {
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


  singleFloorNav = (globalCoords)=>{
	
   this.props.getAllBuildingElements(
      {
        venueName: this.state.selectedVenue,
        buildingName: this.state.dstData.buildingName
      },
      () => {
        
        // this.setState(
        //   {
        //     list: lists
        //   },
        //   () => {
          this.mapBuildingData()
            let data = { venueName: this.state.selectedVenue, buildingName: this.state.dstData.buildingName };
            this.props.floorList(data, () => {
              let flrList = this.props.flrList.data;
		
              this.setState({
                flrList:flrList
              },()=>{
		
                this.handleSubmit(globalCoords);

              })
            });
        //   }
        // );
      }
    );
  }

  createGraph =  ()=>{
    let building = this.state.dstData.buildingName;
    let flrList = []
    let flrData =  this.state.buildingCluster.filter(r=>r.buildingName === this.state.dstData.buildingName)[0].data;
    let polyData =  this.state.buildingPolyCluster.filter(r=>r.building === this.state.dstData.buildingName)[0].data;
    let refPoint =  this.state.globalRefPointsList.filter(r=>r.buildingName === this.state.dstData.buildingName)[0]?.refPoints;
    polyData.forEach((r)=>{
      flrList.push(r.floor)
    })  
    let srcFlrMarkData = []
    let dstFlrMarkData = []
    flrData.forEach(r=>{
      if(r.floor === this.state.srcData.floor){
        srcFlrMarkData.push(r)
      }
      if(r.floor === this.state.dstData.floor){
        dstFlrMarkData.push(r)
      } 
    })
    let srcFlrDataPoly = []
    let dstFlrDataPoly = []
    for(let k=0;k<polyData.length;k++){
        if(polyData[k].floor === this.state.srcData.floor){
          srcFlrDataPoly.push(polyData[k])
        }
        if(polyData[k].floor === this.state.dstData.floor){
          dstFlrDataPoly.push(polyData[k])
        } 
    }
    this.handleLocalGlobal(srcFlrMarkData,srcFlrDataPoly,building,refPoint,this.state.srcData.floor)
    this.handleLocalGlobal(dstFlrMarkData,dstFlrDataPoly,building,refPoint,this.state.dstData.floor)
    this.mapBuildingData()
        this.setState({
          floorList:flrList,
          srcFloorPoly:this.srcFloorPoly,
          geoJSONPoly:this.srcFloorPoly,
          dstFloorPoly:this.dstFloorPoly,
          srcFloorLandMark:this.srcFloorLandmark,
          geoJSON:this.srcFloorLandmark,
          dstFloorLandMark:this.dstFloorLandmark,
          currentFloor:this.state.srcData.floor
        },()=>{
          this.findpath(refPoint)
        });
  }


  mapBuildingData = ()=>{
    let nodes = this.props.navigationInfo;
    this.grids_all = [];
    let lists = [];
    let num_vert = 0;
    let fc = new Map();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].properties.floorElement === "FloorConnection") {
        num_vert++;
        var v = nodes[i].properties.type + "," + nodes[i].properties.name;
        var val =
          nodes[i].properties.floor + "," + nodes[i].properties.node;
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
        var val =
          nodes[i].properties.floor + "," + nodes[i].properties.node;
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
                  parseInt(nodes[i].properties.length) *
                    parseInt(v[k + 1]) +
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
  }

  handleSubmit = (globalCoords) => {
    let { srcData,srcName, dstData,dstName, dstfloorL, dstfloorB } = this.state;
    let srcVal = "";
    let dstVal = "";
    let srcfloor = "";
    let dstfloor = "";
    for (let k = 0; k < this.props.navigationInfo.length; k++) {
      if (
        this.props.navigationInfo[k].properties.floorElement !== undefined &&
        this.props.navigationInfo[k].properties.floorElement === "Rooms"
      ) {
        if (srcData.name === this.props.navigationInfo[k].properties.roomName) {
          srcVal = this.props.navigationInfo[k].properties.node;
          srcfloor = this.props.navigationInfo[k].properties.floor;
          dstfloor = this.props.navigationInfo[k].properties.floor;
        }
        if (dstData.name === this.props.navigationInfo[k].properties.roomName) {
          dstVal = this.props.navigationInfo[k].properties.node;
        }
      }
    }
    let flrList = this.state.buildingPolyCluster.filter((r, i) => {
      return r.building === this.state.dstData.buildingName;
    })[0].data;
        
    let dstFlrDt = flrList.filter((r, i) => {
      return r.floor === this.state.dstData.floor;
    });
    let srcfloorL = dstFlrDt[0].properties.floorLength;
    let srcfloorB = dstFlrDt[0].properties.floorBreadth;
    if (srcVal != null && dstVal != null) {
      let dest_x = this.state.dstData.coordinateX;
      let dest_y = this.state.dstData.coordinateY;
     
      if (srcfloor === dstfloor) {
        this.callwhile(
          srcfloor,
          srcVal,
          srcfloorL,
          srcfloorB,
          dest_x,
          dest_y,
          true,
          "myCanvassrc",
          globalCoords
        );
        this.setState({
          samefloor: true
        });
      } else {
        // this.setState({
        //   samefloor: false,
        //   buildingView: true
        // });
        // this.findpath();
      }
    } else {
    }
  };
  /**
   * @id  N1.1.17
   * @author Pankaj Singh
   * @description Find index of floor from floor list array
   */
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
  reset_var() {
    this.grids = [];
    this.visited = [];
    this.shortestpath = [];
    this.minimumcost = [];
    this.leaves = [];
  }
  /**
   *@id test 3  
   *@author Jahnavi Methukumalli
   *@description Find the safest path between source and destination
   */

   findAccessPath = (paths, srcfloor) => {
	
	var weights = [1,1,1,1,1,1];
	var score = [];
	var protrusion=[];
	var epi = 0;
	for(let i=0; i<paths.length; i++){
		var points = paths[i];
		var pro = [0,0,0,0,0,0];
		//stairs
		for(let j=0;j<parseInt(this.flrconn.length);j++){
			var cord = [parseInt(this.flrconn[j][0]),parseInt(this.flrconn[j][1])];
			if(points.includes(cord)){
				pro[0] = pro[0]+1;	
			}			
		
		}
		//turn
		for(let j=1;j<points.length-1;j++){
			var a = points[j-1][0] - points[j][0];
			var b = points[j][1] - points[j+1][1];
			var c = points[j-1][1] - points[j][1];
			var d = points[j][0] - points[j+1][0];

			if(a*b != c*d){
				pro[1] = pro[1]+1;
			}
		}
		
		//protrusion
		for (let j=0;j<protrusion.length;j++){
			for (let k=0;j<points.length;k++){
				var dist = Math.sqrt((points[k][0]-protrusion[j][0])*(points[k][0]-protrusion[j][0]) +
					(points[k][1]-protrusion[j][1])*(points[k][1]-protrusion[j][1]));
				if(dist<epi){
					pro[2] = pro[2]+1;
				}				

			}

		}		
			
		var pathscr = 0;
		for(let j=0;j<6;j++){
			pathscr = pathscr + (weights[j]*pro[j]);
		}
		score.push(pathscr);
	}
	var min = Number.MAX_VALUE();
	var index = -1;
	for(let i=0;i<score.length;i++){
		if(score[i]<min){
			min = score[i];
			index = i;
		}
	
	}
	 
	return paths[index];
   }
	
   
    
  /**
   *@id test 2  
   *@author Jahnavi Methukumalli
   *@description Find the safest path between source and destination
   */

   findSafePath = (paths, srcfloor) => {
	
	var weights = [1,1,1,1,1,1];
	var score = [];
	for(let i=0; i<paths.length; i++){
		var points = paths[i];
		var props = [0,0,0,0,0,0];
		var protrusion = [];
		var epi=0;
		//stairs
		for(let j=0;j<parseInt(this.flrconn.length);j++){
			var cord = [parseInt(this.flrconn[j][0]),parseInt(this.flrconn[j][1])];
			if(points.includes(cord)){
				props[0] = props[0]+1;	
			}			
		
		}
		//turn
		for(let j=1;j<points.length-1;j++){
			var a = points[j-1][0] - points[j][0];
			var b = points[j][1] - points[j+1][1];
			var c = points[j-1][1] - points[j][1];
			var d = points[j][0] - points[j+1][0];

			if(a*b != c*d){
				props[1] = props[1]+1;
			}
		}
		
		//protrusion
		for (let j=0;j<protrusion.length;j++){
			for (let k=0;j<points.length;k++){
				var dist = Math.sqrt((points[k][0]-protrusion[j][0])*(points[k][0]-protrusion[j][0]) +
					(points[k][1]-protrusion[j][1])*(points[k][1]-protrusion[j][1]));
				if(dist<epi){
					props[2] = props[2]+1;
				}				

			}

		}			
			
		var pathscr = 0;
		for(let j=0;j<6;j++){
			pathscr = pathscr + (weights[j]*props[j]);
		}
		score[i] = pathscr;
	}
	var min = Number.MAX_VALUE();
	var index = -1;
	for(let i=0;i<score.length;i++){
		if(score[i]<min){
			min = score[i];
			index = i;
		}
	
	}
	 
	return paths[index];
	
   }

   /** 
    *  @id test2
    * @author Jahnavi Methukumalli
    * @description Find simplest path between source and dest
    * 
   */
    callsimplest(shortestpath, srcVal, dest_x , dest_y,  ){
      


    }
  /**
   * @id test 1
   * @author Jahnavi Methukumalli
   * @description Find simplest path between source and destination(A*)  
   */

  callwhile_h = (srcfloor, srcVal, m, n, dest_x, dest_y, single, canvasid, globalCoords = null) => {

   var closed = [];
   
   for (let i=0 ; i<m ; i++){
      var row = [],
         row1 = [],
         row2 = [],
         row3 = [],
         row4 = [];
      for (let j=0 ; j<n ; j++){
        row.push(1);
        row1.push(-1);
        row3.push(Number.MAX_VALUE);
        var row5 = [];
        row4.push(row5);
      }
      this.shortestpath(row4);
      this.grids.push(row);
      this.visited.push(row1);
      this.minimumcost.push(row3);
   }

   var ind1 = this.findFloor(srcfloor, this.grids_all);
   if(ind1 !== -1 && this.grids_all[ind1].properties.grid_1 != null){
      for(let i=0 ; i < this.grids_all[ind1].properties.grid_1.length; i++){
        var nodes = this.grid_all[ind1].properties.grid_1[i].split(",");
        for(let j=0 ; j<nodes.length ; j++){
          var val = nodes[j];
          var x = val % m;
          var y = parseInt(val/m);

          this.grids[x][y] = 0;
        }
      }
   }

   var src_x = srcVal % m ;
   var src_y = parseInt(srcVal/m);
   this.leaves.push([src_x,src_y]);
   this.shortestpath[src_x][src_y].push([src_x,src_y]);
   this.minimumcost[src_x][src_y] = 0;
   while (this.leaves.length > 0){
      var min = Number.MAX_VALUE;
      var q;
      var ind;
      for (let i = 0; i<this.leaves.length;i++){
        if(min > this.minimumcost[this.leaves[i][0]][this.leaves[i][1]]){
          min = this.minimumcost[this.leaves[i][0]][this.leaves[i][1]];
          q = this.leaves[i];

        }
      }
      this.visited[q[0]][q[1]] = 1;
      if(single == true){
          if(q[0] == dest_x && q[1] == dest_y){
              break;
          }
      }else {
          var check = true;
          for (let i=0 ; i< parseInt(this.flrconn.lenght); i++){
            if(this.visited[parseInt(this.flrconn[i][0])][parseInt(this.flrconn[i][1])] == -1){
              check = false;
            }
          }
          if(check == true){
            for (var ch = 0; ch < parseInt(this.flrconn.length); ch++) {
              var vert = srcfloor + "," + srcVal + "," + "virtual";
              console.log("verjsdh1",vert)
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
      this.leaves.splice(ind,1);
      for (let i = q[0]-1; i<=q[0]+1 ;i++){
        for(let j = q[1]-1; j<=q[1]+1 ; j++){
          if(i>=0 && i<m || j>=0 && j<n){
            if(this.visited[i][j]==-1 && this.grids[i][j] == 1){
              //A* main part to release closed list and open lists   
              
            }
          }
        }
      }

   }

  }

  /**
   * @id  N1.1.18
   * @author Anirudh Khammampati & Sai Kumar Reddy
   * @description Find shortest path between source and destination
   */
  callwhile = (srcfloor, srcVal, m, n, dest_x, dest_y, single, canvasid,globalCoords = null) => {
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
        //console.log(this.flrconn);
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
            console.log("verjsdh1",vert)
            console.log(this.flrconn[ch][2],this.minimumcost[parseInt(this.flrconn[ch][0])][
              parseInt(this.flrconn[ch][1])]);
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
                  Math.sqrt((minleave[0]-j)*(minleave[0]-j)+(minleave[1]-k)*(minleave[1]-k))
		//Math.abs(j-dest_x)+Math.abs(k-dest_y)
              ) {
                this.minimumcost[j][k] =
                  this.minimumcost[minleave[0]][minleave[1]] +
                  Math.sqrt((minleave[0]-j)*(minleave[0]-j)+(minleave[1]-k)*(minleave[1]-k));
               //  +Math.abs(j-dest_x)+Math.abs(k-dest_y);
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
    console.log(sp);
      let mypoints = sp.map(r => {
        return { x: r[0], y: r[1] };
      });
      console.log(mypoints);
      sp = JSON.stringify(sp);
      var refinedpaths = simplifyPath(mypoints, 2);
      var sp1 = refinedpaths.map(r =>{return[r.x,r.y]});
      console.log(sp1);
      sp1 = JSON.stringify(sp1);
      let { selectedVenue, selectedBuilding } = this.state;
      
      // this.props.globalNavigation(
        // { venueName: selectedVenue, buildingName: this.state.dstData.buildingName },
        // () => {
          this.callGlobal(sp1,srcfloor,globalCoords);
          // this.fltrNvgnData(floor)
        // }
      // );
      let flrData =  this.state.buildingCluster.filter(r=>r.buildingName === this.state.dstData.buildingName)[0].data;
        let allElements = flrData;
      if(this.state.srcData.floor === this.state.dstData.floor){
        let instructions = findInstructions(
            sp,
            refinedpaths,
            allElements,
            srcfloor
        );
        this.setState({
          instructions:instructions
        })
      }else{
        let instructions = findInstructions(
          sp,
          refinedpaths,
          allElements,
          srcfloor
      );
      
      if(srcfloor === this.state.srcData.floor){
        this.srcFlrInstructions = instructions;
        this.setState({
          instructions:instructions
        })
      }else{
        this.dstFlrInstructions = instructions
      }
      }
      // this.setState({
      //   instructions: instructions
      // });
    }
    this.reset_var()
  };
  /**
   * @id  N1.1.19
   * @author Pankaj Singh
   * @description Load coordinates on osm
   */
  callGlobal = (shortestpath,srcfloor = null,globalCoords = null) => {
    let crd = this.props.globalCoords.coordinates;
    if(globalCoords){
      crd = globalCoords
    }

    var coords = []; // "breadth":"154","length":"173" , conversion: *3.28084
    let sp = JSON.parse(shortestpath);
    this.defineCoords(crd, coords);
    //finding the point with lowest latitude and highest longitude
    var least_lat = 0;
    var high_lon = 0;
    //finding the point with lowest latitude and highest longitude
    for (let i = 0; i < coords.length; i++) {
      
      if (coords[i].lat == coords[least_lat].lat) {
        //handling two points with equal lat
        if (coords[i].lon > coords[least_lat].lon) {
          least_lat = i;
        }
      } else if (coords[i].lat < coords[least_lat].lat) {
        least_lat = i;
      }
    }
    //evaluating high_lon
    var c1 = least_lat == 3 ? 0 : least_lat + 1;
    var c2 = least_lat == 0 ? 3 : least_lat - 1;
    var high_lon = coords[c1].lon > coords[c2].lon ? c1 : c2;
    console.log(c1);
    console.log(c2);
    console.log(coords[c1].lat);
    console.log(coords[c2].lon);
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
    var myarr = JSON.parse(shortestpath);
    //finding min and max latitude and longitude for the path
    var max_lat = Number.MIN_SAFE_INTEGER;
    var max_long = Number.MIN_SAFE_INTEGER;
    var min_lat = Number.MAX_VALUE;
    var min_long = Number.MAX_VALUE;
    
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
    
      myarr[i][0] = final.lat;
      myarr[i][1] = final.lon;
      if(max_lat<myarr[i][0]) max_lat = myarr[i][0];
      if(max_long<myarr[i][1])max_long = myarr[i][1];
      if(min_lat>myarr[i][0])min_lat = myarr[i][0];
      if(min_long>myarr[i][1])min_long = myarr[i][1];
     }
	  var mid_lat = (min_lat + max_lat)/2;
	  var mid_long = (min_long+max_long)/2;

	  var corner1 = L.latLng(min_lat+0.0001,min_long+0.0001);
    var corner2 = L.latLng(max_lat+0.0001,max_long+0.0001);
    var myBounds = L.latLngBounds(corner1,corner2);
	  var map = this.leafletMap.leafletElement;
    
     //console.log(myBounds.getNorthEast());
    //console.log(min_lat);
    //console.log(max_lat);
    map.flyTo(new L.latLng(mid_lat,mid_long),21.6);
    console.log(map.getZoom());
	  //map.flyToBounds(myBounds);
    console.log(map.getZoom());
    //map.flyTo(new L.LatLng(mid_lat+0.00002,mid_long+0.00001),22.5, {animation : true, duration :1});
	  //console.log(min_long);
	  //console.log(min_lat);
    console.log(map.getZoom());

        
    //converting to geoJSON format
    let geoJSON = {
      type: "FeatureCollection",
      features: []
    };
    // myarr.shift();
    // myarr.pop();
    // myarr.pop();

    for (let i = 0; i < myarr.length; i++) {
      var p = myarr[i];
      geoJSON.features.push({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [p[0], p[1]]
        }
      });
    }

    if(this.state.srcData.floor !== this.state.dstData.floor){
      if(srcfloor === this.state.srcData.floor){
        this.srcFloorSp = geoJSON
      }else{
        this.dstFloorSp = geoJSON
      }
    }else{
      this.setState(
        {
          showpath: true,
          // showMarker: false,
          zoom: 19,
          pathgeoJSON: geoJSON
        },
        () => {
          // var southWest = L.latLng(src[1], src[0]),
            // northEast = L.latLng(dst[1], dst[0]),
            // bounds = L.latLngBounds(southWest, northEast);
          // map.fitBounds(bounds);
        }
      );
    }
    

    
  };

  defineCoords = (crd, coords) => {
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
  };

  handleVenueChange = e => {
    this.setState(
      {
        buildingList: [],
        flrList: [],
        selectedBuilding: "",
        floorSelect: false,
        selectNavigation: false,
        geoJSON: [],
        geoJSONPoly: []
      },
      () => {
        this.selectedVenue(e[0].venueName, e[0].coordinates);
      }
    );
  };
 /**
   * @id  N1.1.19
   * @author Pankaj Singh
   * @description Load coordinates on osm
   */
  findpath = () => {
    let srcVal = "";
    let dstVal = "";
    let srcfloor = "";
    let dstfloor = "";
    let srcFloorL = "";
    let srcFloorB = "";
    let dstFloorL = "";
    let dstFloorB = "";
    let building = this.state.dstData.buildingName;
    let flrData =  this.state.buildingCluster.filter(r=>r.buildingName === this.state.dstData.buildingName)[0].data;
    let polyData =  this.state.buildingPolyCluster.filter(r=>r.building === this.state.dstData.buildingName)[0].data;
    let refPoint =  this.state.globalRefPointsList.filter(r=>r.buildingName === this.state.dstData.buildingName)[0].refPoints;        
    // let i = parseInt(gridY) * floorL + parseInt(gridX);
    // let flrMarkData = []
    //        flrData.forEach(r=>{
    //         if(r.floor === this.state.dstData.floor){
    //           flrMarkData.push(r)
    //         } 
    //       })
          let flrDataPoly = []
          for(let k=0;k<polyData.length;k++){
              if(polyData[k].floor === this.state.dstData.floor){
                dstFloorL = polyData[k].properties.floorLength
                dstFloorB = polyData[k].properties.floorBreadth
              } 
              if(polyData[k].floor === this.state.srcData.floor){
                srcFloorL = polyData[k].properties.floorLength
                srcFloorB = polyData[k].properties.floorBreadth
              }
          }
          let {srcData,dstData} = this.state
          let srcNode = parseInt(srcData.coordinateY) * srcFloorL + parseInt(srcData.coordinateX);
          let dstNode = parseInt(dstData.coordinateY) * dstFloorL + parseInt(dstData.coordinateX);          
          for(let k=0;k<flrData.length;k++){
            if(flrData[k].floor === this.state.dstData.floor){
              dstVal = flrData[k].properties.node 
            } 
            if(flrData[k].floor === this.state.srcData.floor){
              srcVal = flrData[k].properties.node 
            }
        }
    // let i = parseInt(gridY) * floorL + parseInt(gridX);
    var srcvert = this.state.srcData.floor + "," + srcNode + "," + "virtual";
    var dstvert = this.state.dstData.floor + "," + dstNode + "," + "virtual";
    if (this.graph.hasvertex(srcvert)) {
    } else {
      this.graph.addVertex(srcvert);
      this.flrconn = [];
      this.flrind = [];
      console.log(this.state.srcData.floor);
      for(let k=0;k<flrData.length;k++){
        if (
          flrData[k].floor === this.state.srcData.floor &&
          flrData[k].element.type === "FloorConnection"
        ) {
          // var vert = flrData[k].properties.node
          var vert = flrData[k].floor + "," + flrData[k].properties.node ;
          this.flrconn.push([flrData[k].coordinateX , flrData[k].coordinateY, vert]);
          this.flrind.push([k,vert]);
          console.log(this.flrconn);

        }
    }
      this.callwhile(
        this.state.srcData.floor,
        srcNode,
        srcFloorL,
        srcFloorB,
        null,
        null,
        false,
        null
      );
    }
    if (this.graph.hasvertex(dstvert)) {
    } else {
      this.graph.addVertex(dstvert);
      this.flrconn = [];
    
      for(let k=0;k<flrData.length;k++){
        if(flrData[k].floor === this.state.dstData.floor &&
          flrData[k].element.type === "FloorConnection"){
            var vert = flrData[k].floor + "," + flrData[k].properties.node ;
            this.flrind.push([k,vert]);
          this.flrconn.push([flrData[k].coordinateX , flrData[k].coordinateY, vert]);
        }
    }
    console.log(this.flrconn);
    console.log(this.flrind);
      this.callwhile(
        this.state.dstData.floor,
        dstNode,
        dstFloorL,
        dstFloorB,
        null,
        null,
        false,
        null
      );
    }
    this.specialcallwhile(
      this.state.srcData.floor,
      srcvert,
      this.state.dstData.floor,
      dstvert,refPoint
    );
  }

  specialcallwhile(srcfloor,srcvert,dstfloor,dstvert,refPoint,pt){
    console.log("srcfloor,srcvert,dstfloor,dstvert",srcfloor,srcvert,dstfloor,dstvert,refPoint)
    var min = Number.MAX_VALUE;
    var minleave=null;
    var var_i;
    var notthere;
    let shortestpath = new Map();
    let visited = new Map();
    let minimumcost = new Map();
    let leaves =[];
    let flrData =  this.state.buildingCluster.filter(r=>r.buildingName === this.state.dstData.buildingName)[0].data;
    var get_keys = this.graph.AdjList.keys();
    for(var i of get_keys){
      minimumcost.set(i,min);
      visited.set(i,false);
    }
    leaves.push(srcvert);
    shortestpath.set(srcvert,[srcvert]);
    minimumcost.set(srcvert,0);
    // this.graph.printGraph()
    while(leaves.length > 0){
      // alert("stop "+leaves.length);
      min = Number.MAX_VALUE;
      for(let i=0;i<leaves.length;i++){
        if(min > minimumcost.get(leaves[i])){
          min = minimumcost.get(leaves[i]);
          minleave = leaves[i];
          var_i = i;
        }
      }
      visited.set(minleave,true);
        if(minleave == dstvert){
          // alert(" i "+JSON.stringify(shortestpath.get(dstvert)));
          break;
        }
      leaves.splice(var_i, 1);
          var get_values = this.graph.AdjList.get(minleave);
          var get_dist = this.graph.Adjweights.get(minleave);
          var flag =0;
          for (var jj=0;jj<get_values.length;jj++) {
            var j = get_values[jj];
            console.log(j);

            var l = j.split(",");
            var neighbour = false;
            if(l.length==2){
              neighbour=true;
            }
            else if(l.length==3){
              if(j==dstvert){
                neighbour=true;
              }
            }
            console.log(pt);
            if(this.pt==1){
            var dataind = 0;
            for(var kk=0; kk<this.flrind.length;kk++){
                if(String(this.flrind[kk][1]).localeCompare(String(j))==0){
                  dataind = kk;
                }
            }
            console.log(dataind);
            console.log(this.flrind[dataind]);
            console.log(flrData[this.flrind[dataind][0]].element.subType);
            if(visited.get(j) == false && neighbour && flrData[this.flrind[dataind][0]].element.subType==="lift"){
              console.log(j);
              //console.log(minleave);
              if(minimumcost.get(j) > minimumcost.get(minleave) + get_dist[jj] ){
               // console.log(j);
                minimumcost.set(j,minimumcost.get(minleave) + get_dist[jj]);
                var dum = [];
                dum = shortestpath.get(minleave);
                dum = dum.concat([j]);
                shortestpath.set(j ,dum);
                
                notthere = 1;
                for(var p=0;p<leaves.length;p++){
                  if(leaves[p] == j){
                    notthere = 0;
                  }
                }
                if(notthere == 1){
                  
                  leaves.push(j);
                  
                }
              }
              
            
            }
          }else{

            if(visited.get(j) == false && neighbour){
              console.log(j);
              //console.log(minleave);
              if(minimumcost.get(j) > minimumcost.get(minleave) + get_dist[jj] ){
               // console.log(j);
                minimumcost.set(j,minimumcost.get(minleave) + get_dist[jj]);
                var dum = [];
                dum = shortestpath.get(minleave);
                dum = dum.concat([j]);
                shortestpath.set(j ,dum);
                
                notthere = 1;
                for(var p=0;p<leaves.length;p++){
                  if(leaves[p] == j){
                    notthere = 0;
                  }
                }
                if(notthere == 1){
                  
                  leaves.push(j);
                  
                }
              }
              
            
            }





          }
            
          }
    }
    this.createcanvas(shortestpath.get(dstvert),false,refPoint);
  }

  createcanvas( list, samefloor,refPoint) {
    if (samefloor === false) {  
      let ans = new Map();
      if(list) for (var i = 0; i < list.length; i++) {
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
      this.callimage(0, ans, cnt, clist, floorLlist,refPoint);
    }
  }

  callimage(cnt, ans, count, clist, floorLlist,refPoint) {
    let floorList = [this.state.srcData.floor, this.state.dstData.floor];
    for (let jj = 0; jj < floorList.length; jj++) {
      for (let ii = 0; ii < clist.length; ii++) {
        if (floorList[jj] === clist[ii].floor) {
          let i = clist[ii].floor;
          let me = this;
          let get_val = ans.get(i);
              var id = "canvas" + ii;
              // me.loadMultiFloorNonwalkable(id)
              var index = me.findFloor(i, me.grids_all);
              var m = parseInt(me.grids_all[index].properties.length);
              var n = parseInt(me.grids_all[index].properties.breadth);
              for (var j = 0; j < get_val.length - 1; j++) {
                var dest_x = get_val[j + 1] % m;
                var dest_y = parseInt(get_val[j + 1] / m);
                console.log("i, get_val[j], m, n, dest_x, dest_y, true, id",i, get_val[j], m, n, dest_x, dest_y, true, id)
                me.callwhile(i, get_val[j], m, n, dest_x, dest_y, true, id,refPoint);
              }
              var node_count = 0;
              for (var j of get_val) {
                if (ii === count - 1) {
                  if (node_count === get_val.length - 1) {
                     //me.color_canvas_spl(j, id, "green", floorLlist[ii]);
                  } else {
                     //me.color_canvas_spl(j, id, "yellow", floorLlist[ii]);
                  }
                } else {
                  if (node_count === 0 && ii === 0) {
                     //me.color_canvas_spl(j, id, "red", floorLlist[ii]);
                  } else {
                     //me.color_canvas_spl(j, id, "yellow", floorLlist[ii]);
                  }
                }
                node_count++;
              }

        }
      }
    }
    console.log("this.srcFloorSp,this.dstFloorSp")
    this.setState({
      srcFloorSp:this.srcFloorSp,
      dstFloorSp:this.dstFloorSp,
      pathgeoJSON:this.srcFloorSp,
      srcFlrInstructions:this.srcFlrInstructions,
      dstFlrInstructions:this.dstFlrInstructions,
      showpath:true
    })
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

  
  render() {
    let srtdFlr = [];

    special.forEach((r1, i) => {
                this.state.floorList &&
              this.state.floorList.forEach(r2=>{
                  if( r1 === r2){
                      srtdFlr.push(r1)
                  } 
                })
              })
    function getPathAverage(paths, current, prev, i) {
      if(i>5) return
      var averageX = (current[0]+prev[0])/2
      var averageY = (current[1]+prev[1])/2

      var arr = [averageX, averageY]
      //console.log("current", current, "average", arr, "previous", prev)
      //if(current[0] == arr[0] && current[1] == arr[1]) return 
      paths.push(arr)

      getPathAverage(paths, current, arr, i+1)
      getPathAverage(paths, arr, prev, i+1)
    }
    return (
      <React.Fragment>
        {/*Instruction Component */}
        <div hidden={!this.state.showInstructions}>
          <Instructions
            dstAddress={this.state.dstAddress}
            globalTime={this.state.globalTime}
            globalDistance={this.state.globalDistance}
            currentLocation={this.state.currentLocation}
            handleBuildingView={this.handleBuildingView}
            instructionSet={this.state.instructions}
            buildingView={this.state.buildingView}
            sourceLocation={this.state.currentLocation}
            dstLocation={this.state.dstAddress}
            dstName={this.state.dstName}
            srcName={this.state.srcName}
            handleInstr={() => {
              this.setState({
                showInstructions: false
              });
            }}
          />
        </div>
        <div className="landing-height" hidden={this.state.showInstructions}>
          {/** Search Bar */}
          <div
            className="src-dst fixed-top"
            id="src-bar"
            style={{
              height: this.state.selectNavigation === true ? "167px" : "57px"
            }}
          >
            <div className="row w-100  mx-auto">
              <div className="col-12 p-0">
                <Typeahead
                  required
                  placeholder={`${this.state.selectedVenue}`}
                  filterBy={["venueName"]}
                  labelKey={option => {
                    return `${option.venueName.split(/(?=[A-Z])/).join(" ")}`;
                  }}
                  onChange={e => {
                    if (e.length > 0) {
                      this.handleVenueChange(e);
                    }
                  }}
                  disabled={false}
                  id="source"
                  value={this.state.selectedVenue}
                  options={this.state.venueList}
                  name="list"
                  className="mb-2 form-control-dashboard mt-1"
                />
              </div>
            </div>
            <div className="mx-auto hr-line" />
            {this.state.selectNavigation === true ? (
              <React.Fragment>
                <div className="row w-100  mx-auto mt-3">
                  <div className="col-12 p-0">
                    <button
                      className="btn-nvgtn text-white"
                      onClick={() => {
                        this.props.navContent("SELECT DESTINATION", () => {});
                      }}
                    >
                      <img
                        className="float-left mt-2 mr-2"
                        src="/inclunav/assets/images/profile.svg"
                        alt="user location"
                      />
                      <Typeahead
                        required
                        placeholder={`Select Source`}
                        filterBy={["name"]}
                        labelKey={option => {
                          let resp = this.sourceLabel(option);
                          return resp;
                        }}
                        renderMenuItemChildren={option => {
                          return this.renderSourceMenu(option);
                        }}
                        onChange={e => {
                          if (e.length > 0) {
                            
                            this.setState({
                              srcName:e[0].name + " " + e[0].floor + " " + e[0].buildingName,
                              srcData: e[0]
                            });
                          }
                        }}
                        disabled={false}
                        id="source"
                        value={this.state.srcName}
                        options={this.state.venueNavigation}
                        name="list"
                        className="mb-2 form-control-dashboard mt-1"
                      />
                    </button>
                  </div>
                </div>
                <div className="mx-auto hr-line" />
                <div className="row w-100 mx-auto">
                  <div className="col-12 p-0">
                    <button
                      className="btn-nvgtn text-white"
                      onClick={() => {
                        this.props.navContent("SELECT DESTINATION", () => {});
                      }}
                    >
                      <img
                        className="float-left mt-2 mr-2 my-auto"
                        src="/inclunav/assets/images/navigation.svg"
                        alt="select destination"
                      />
                      <Typeahead
                        required
                        placeholder={`Select Destination`}
                        filterBy={["name"]}
                        labelKey={option => {
                          let resp = this.sourceLabel(option);
                          return resp;
                        }}
                        renderMenuItemChildren={option => {
                          return this.renderSourceMenu(option);
                        }}
                        onChange={e => {
                          if (e.length > 0) {
                            this.setState(
                              {
                                dstName: e[0].name + " " + e[0].floor + " " + e[0].buildingName,
                                dstData: e[0],
                                navigationStrt:true,
                                samefloor:e[0].floor !== this.state.srcData.floor?false:true
                              },
                              () => {
                                // this.mapReferencePoint()
                                // this.handleLocalGlobal();
                                this.pt=0;
                                this.setNavigation();
                              }
                            );
                          }
                        }}
                        disabled={false}
                        id="source"
                        value={this.state.dstName}
                        options={this.state.venueNavigation}
                        name="list"
                        className="mb-2 form-control-dashboard mt-1"
                      />
                    </button>
                  </div>
                </div>
                <div className="mx-auto hr-line" />
                <div className="row w-100 mx-auto upper-space">
                  <div className="col-2">
                    <button
                      className="btn btn-direction  mx-auto btn-block btn-default btn-lg font-weight-bold  h2 option-path"
                      onClick={() => {
                        this.pt=0;
                        this.setNavigation();
                      }}
                    >
                      Shortest
                    </button>
                  </div>
                  <div className="col-2 option-path">
                    <button
                      className="btn btn-direction  mx-auto btn-block btn-default btn-lg font-weight-bold  h2 option-path"
                      onClick={() => {
                        this.pt=0;
                        this.setNavigation();
                      }}
                    >
                      Simplest
                    </button>
                  </div>

                  <div className="col-2 option-path">
                    <button
                      className="btn btn-direction  mx-auto btn-block btn-default btn-lg font-weight-bold  h2 option-path"
                      onClick={() => {
                        this.pt=1;
                        this.setNavigation();
                      }}
                    >
                      Accesible
                    </button>
                  </div>
      
                  <div className="col-2 option-path">
                    <button
                      className="btn btn-direction  mx-auto btn-block btn-default btn-lg font-weight-bold  h2 option-path"
                      onClick={() => {
                        this.pt=1;
                        this.setNavigation();
                      }}
                    >
                      Safest
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
          </div>

          <div
            class="btn-group-vertical glbl-btn mr-2"
            role="group"
            aria-label="First group"
          >
            {srtdFlr &&
              srtdFlr.map((r, i) => {
                return (
                  <button
                    type="button"
                    // className={"btn btn-secondary"}                    
                    className={this.state.currentFloor ===r?"btn btn-secondary active active1":"btn btn-secondary"}
                    onClick={() => {
                      this.setState({
                        currentFloor:r
                      },()=>{
                        if(this.state.srcData.floor === this.state.currentFloor){
                          this.setState({
                            pathgeoJSON:this.srcFloorSp,
                            geoJSON:this.state.srcFloorLandMark,
                            instructions:this.state.srcFlrInstructions
                          })
                        }else{
                          this.setState({
                            pathgeoJSON:this.dstFloorSp,
                            geoJSON:this.state.dstFloorLandMark,
                            instructions:this.state.dstFlrInstructions
                          })
                          // srcFloorSp:,
                          // dstFloorSp:,
                          // pathgeoJSON:this.srcFloorSp,
                        }
                      })
                    }}
                  >
                    L{i}
                  </button>
                );
              })}
          </div>

          <div
            class="btn-group-vertical glbl-hm-btn mr-2"
            role="group"
            aria-label="First group"
            style={{
              position: 'fixed',
              top: '30%',
              right: '2%',
              width: 'max-content',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <button
              title="Navigate"
              type="button"
              class="btn btn-secondary"
              onClick={() => {
                this.props.history.push("/navigate");
              }}
            >
              <i className="fa fa-home" />
            </button>
            
          </div>
          <MapContainer
            style={{ height: "100vh" }}
            center={center}
            zoom={this.state.zoom}
            ref={m => {
              this.leafletMap = m;
            }}
            onZoomEnd={e => {
              // Zoom in & out control
              if (e.target._zoom < 21.2) {
                //remove all layers from map
                this.setState({
                  showpath: false
                });
              }
              if (e.target._zoom < 20) {
                //remove all layers from map
                this.setState({
                  showMarker: false,
                  showpath: false
                });
              }
              if (e.target._zoom < 20) {
                //remove all layers from map
                this.setState({
                  showServices: false
                });
              } else {
              }
              //adding non-room layers beyond 20 zoom
              if (e.target._zoom > 19 && !this.state.showpath) {
                this.setState({
                  showMarker: true
                });
              }

              if (e.target._zoom > 21.2 && !this.state.showpath) {
                this.setState({
                  showpath: true
                });
              }

              if (e.target._zoom > 20 && !this.state.showpath) {
                this.setState({
                  showServices: true
                });
              } else {
              }
            }}
          >
            <TileLayer
              attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
              url={"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              maxZoom={25}
              maxNativeZoom={19}
            />
            {this.state.floorSelect ? null : (
              <React.Fragment>
                {this.state.buildingList &&
                  this.state.buildingList.map(r => {
                    return (
                      <Marker
                        position={{ lat: r.lat, lng: r.lng }}
                        onClick={this.getData.bind(this, r.buildingName)}
                      >
                        <Popup position={{ lat: r.lat, lng: r.lng }}>
                          Building Name:
                          <pre>{r.buildingName}</pre>
                        </Popup>
                      </Marker>
                    );
                  })}
              </React.Fragment>
            )}
            {this.state.showMarker ? (
              <React.Fragment>
                {this.state.geoJSON.features &&
                  this.state.geoJSON.features.map((position, idx) => {
                    switch (position.properties.floorElement) {
                      case "Rooms":
                        return (
                          <Marker
                            position={[
                              position.geometry.coordinates[1],
                              position.geometry.coordinates[0]
                            ]}
                          >
                            <Popup>
                              <span className="font-weight-bold">
                                {position.properties.name}
                              </span>
                              <div
                                class="btn-group btn-block"
                                role="group"
                                aria-label="Basic example"
                              >
                                <button
                                  class="btn btn-primary"
                                  onClick={e => {
                                    this.handleCall(e, position);
                                  }}
                                >
                                  <i class="fa fa-phone"></i>
                                </button>
                                <button
                                  class="btn btn-primary"
                                  onClick={e => {
                                    this.handleInternet(e, position);
                                  }}
                                >
                                  <i class="fa fa-globe"></i>
                                </button>
                                <button
                                  class="btn btn-primary"
                                  onClick={e => {
                                    this.handleWhatsapp(e, position);
                                  }}
                                >
                                  <i class="fa fa-whatsapp"></i>
                                </button>
                                <button
                                  class="btn btn-primary"
                                  onClick={e => {
                                    this.handleEmail(e, position);
                                  }}
                                >
                                  <i class="fa fa-envelope"></i>
                                </button>
                                <button
                                  class="btn btn-primary"
                                  onClick={e => {
                                    this.handleInfo(e, position);
                                  }}
                                >
                                  <i class="fa fa-info"></i>
                                </button>
                                <button class="btn btn-primary">
                                  <i class="fa fa-plus-square"></i>
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      case "Services":
                        if (this.state.showServices) {
                          switch (position.properties.type) {
                            case "drinkingWater":
                              return (
                                <Marker
                                  position={[
                                    position.geometry.coordinates[1],
                                    position.geometry.coordinates[0]
                                  ]}
                                  icon={watericon}
                                >
                                  <Popup>
                                    <span>{position.properties.name}</span>
                                  </Popup>
                                </Marker>
                              );
                            case "restRoom":
                              switch (position.properties.washroomType) {
                                case "Male":
                                  return (
                                    <Marker
                                      position={[
                                        position.geometry.coordinates[1],
                                        position.geometry.coordinates[0]
                                      ]}
                                      icon={male_toileticon}
                                    >
                                      <Popup>
                                        <span>{position.properties.name}</span>
                                      </Popup>
                                    </Marker>
                                  );
                                case "Female":
                                  return (
                                    <Marker
                                      position={[
                                        position.geometry.coordinates[1],
                                        position.geometry.coordinates[0]
                                      ]}
                                      icon={female_toileticon}
                                    >
                                      <Popup>
                                        <span>{position.properties.name}</span>
                                      </Popup>
                                    </Marker>
                                  );
                                default:
                                  return (
                                    <Marker
                                      position={[
                                        position.geometry.coordinates[1],
                                        position.geometry.coordinates[0]
                                      ]}
                                    >
                                      <Popup>
                                        <span>{position.properties.name}</span>
                                      </Popup>
                                    </Marker>
                                  );
                              }
                            default:
                              return null;
                          }
                        }
                        break;
                      case "FloorConnection":
                        switch (position.properties.type) {
                          case "stairs":
                            return (
                              <Marker
                                position={[
                                  position.geometry.coordinates[1],
                                  position.geometry.coordinates[0]
                                ]}
                                icon={stairicon}
                              >
                                <Popup>
                                  <span>{position.properties.name}</span>
                                </Popup>
                              </Marker>
                            );
                          case "lift":
                            return (
                              <Marker
                                position={[
                                  position.geometry.coordinates[1],
                                  position.geometry.coordinates[0]
                                ]}
                                icon={lifticon}
                              >
                                <Popup>
                                  <span>{position.properties.name}</span>
                                </Popup>
                              </Marker>
                            );
                          default:
                            return null;
                        }
                      default:
                        return null;
                    }
                  })}
              </React.Fragment>
            ) : null}
            
            {/* <GeoJSON
              key={hash(this.state.geoJSONPoly)}
              data={this.state.geoJSONPoly}
            /> */}

            {this.state.samefloor && this.state.polygons && this.state.polygons.map(r=>{
              return <GeoJSON
              key={hash(r.geoJSONPoly)}
              data={r.geoJSONPoly}
            />
            })}
            {!this.state.samefloor?
             <GeoJSON
              key={hash(this.state.currentFloor === this.state.srcData.floor? this.state.srcFloorPoly:this.state.dstFloorPoly)}
              data={this.state.currentFloor === this.state.srcData.floor? this.state.srcFloorPoly:this.state.dstFloorPoly}
            />:
            null
            }
            {/* {this.state.showpath ? (
              <React.Fragment>
                <Marker
                  position={[
                    this.state.srcData.geometry.coordinates[1],
                    this.state.srcData.geometry.coordinates[0]
                  ]}
                  icon={source}
                >
                  <Popup>
                    <span className="font-weight-bold">
                      {this.state.srcData.properties.name}
                    </span>
                    <div
                      class="btn-group btn-block"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        class="btn btn-primary"
                        onClick={e => {
                          this.handleCall(e, [
                            this.state.srcData.geometry.coordinates[1],
                            this.state.srcData.geometry.coordinates[0]
                          ]);
                        }}
                      >
                        <i class="fa fa-phone"></i>
                      </button>
                      <button
                        class="btn btn-primary"
                        onClick={e => {
                          this.handleInternet(e, [
                            this.state.srcData.geometry.coordinates[1],
                            this.state.srcData.geometry.coordinates[0]
                          ]);
                        }}
                      >
                        <i class="fa fa-globe"></i>
                      </button>
                      <button
                        class="btn btn-primary"
                        onClick={e => {
                          this.handleWhatsapp(e, [
                            this.state.srcData.geometry.coordinates[1],
                            this.state.srcData.geometry.coordinates[0]
                          ]);
                        }}
                      >
                        <i class="fa fa-whatsapp"></i>
                      </button>
                      <button class="btn btn-primary">
                        <i class="fa fa-envelope"></i>
                      </button>
                      <button
                        class="btn btn-primary"
                        onClick={e => {
                          this.handleInfo(e, [
                            this.state.srcData.geometry.coordinates[1],
                            this.state.srcData.geometry.coordinates[0]
                          ]);
                        }}
                      >
                        <i class="fa fa-info"></i>
                      </button>
                      <button class="btn btn-primary">
                        <i class="fa fa-plus-square"></i>
                      </button>
                    </div>
                  </Popup>
                </Marker>
                <Marker
                  position={[
                    this.state.dstData.geometry.coordinates[1],
                    this.state.dstData.geometry.coordinates[0]
                  ]}
                  icon={destination}
                >
                  <Popup>
                    <span className="font-weight-bold">
                      {this.state.srcData.properties.name}
                    </span>
                    <div
                      class="btn-group btn-block"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        class="btn btn-primary"
                        onClick={e => {
                          this.handleCall(e, [
                            this.state.dstData.geometry.coordinates[1],
                            this.state.dstData.geometry.coordinates[0]
                          ]);
                        }}
                      >
                        <i class="fa fa-phone"></i>
                      </button>
                      <button
                        class="btn btn-primary"
                        onClick={e => {
                          this.handleInternet(e, [
                            this.state.dstData.geometry.coordinates[1],
                            this.state.dstData.geometry.coordinates[0]
                          ]);
                        }}
                      >
                        <i class="fa fa-globe"></i>
                      </button>
                      <button
                        class="btn btn-primary"
                        onClick={e => {
                          this.handleWhatsapp(e, [
                            this.state.dstData.geometry.coordinates[1],
                            this.state.dstData.geometry.coordinates[0]
                          ]);
                        }}
                      >
                        <i class="fa fa-whatsapp"></i>
                      </button>
                      <button class="btn btn-primary">
                        <i class="fa fa-envelope"></i>
                      </button>
                      <button
                        class="btn btn-primary"
                        onClick={e => {
                          this.handleInfo(e, [
                            this.state.dstData.geometry.coordinates[1],
                            this.state.dstData.geometry.coordinates[0]
                          ]);
                        }}
                      >
                        <i class="fa fa-info"></i>
                      </button>
                      <button class="btn btn-primary">
                        <i class="fa fa-plus-square"></i>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ) : null} */}
              
              
              {this.state.showpath &&
              this.state.pathgeoJSON.features &&
              this.state.pathgeoJSON.features.map((position, idx) => {

                if(idx > 0) {
                  var paths = []
                  getPathAverage(paths, position.geometry.coordinates, this.state.pathgeoJSON.features[idx-1].geometry.coordinates, 0)
                  paths.map(path => {
                    fullPath.push(path)
                  })
                }
              })}
             
              {
                fullPath &&
                fullPath.map(path => {
                  return (
                    <Marker 
                      position={[
                        path[0],
                        path[1]
                      ]}
                      icon={doticon}
                      ></Marker>
                  )
                })
              }
              {this.state.showpath &&
              this.state.pathgeoJSON.features &&
              this.state.pathgeoJSON.features.map((position, idx) => {
               if(idx == 0) { 
                return (
                  <Marker
                    position={[
                      position.geometry.coordinates[0],
                      position.geometry.coordinates[1]
                    ]}
                    icon={sourceIcon}
                  ></Marker>
                )};
                if(idx == this.state.pathgeoJSON.features.length-1) return (
                  <Marker
                    position={[
                      position.geometry.coordinates[0]+0.000001,
                      position.geometry.coordinates[1]+0.000001
                    ]}
                    icon={destinationIcon}
                  ></Marker>
                )
                
              })}

          </MapContainer>
          <BottomBar
            srcName={this.state.srcName}
            dstName={this.state.dstName}
            dstData={this.state.dstData}
            handleInstr={() => {
              this.setState({
                showInstructions: true
              });
            }}
          />
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
})(GlobalView);
