// import { Typeahead } from "react-bootstrap-typeahead";

// const SourceMenu = (props) => {
//     return (
//       <div className="d-flex justify-content-center">
//         <div className="src-location-menu">
//           <div
//             className="source-button-strt mb-1"
//             onClick={() => {
//               props.showStrtMenu()
//             }}
//           >
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/profile.svg"
//               alt="user location"
//             />
//             <p className="src-menu-txt text-justify mt-0">
//               {props.currentLocation}
//             </p>
//           </div>
//           <div className="source-button mb-1">
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/search.png"
//               alt="search location"
//             />
//             <Typeahead
//               required
//               placeholder={`${props.selectedSrcLocation.buildingName} (${props.selectedSrcLocation.venueName})`}
//               filterBy={["venueName", "buildingName"]}
//               labelKey={option => {
//                 return `${option.buildingName.split(/(?=[A-Z])/).join(" ")}(${option.venueName.split(/(?=[A-Z])/).join(" ")})`;
//               }}
//               renderMenuItemChildren={option => (
//                 <div>
//                   <div>
//                     <small>
//                       {option.buildingName.length > 0
//                         ? option.buildingName.split(/(?=[A-Z])/).join(" ")
//                         : ""}
//                       ({option.venueName.split(/(?=[A-Z])/).join(" ")}{" "}
//                       {parseInt(option.venueDistance)} KiloMeter )
//                     </small>
//                   </div>
//                 </div>
//               )}
//               onChange={e => {
//                 props.handleSourceLocation(e)
//               }}
//               disabled={false}
//               id="source"
//               value={props.selectedSrcLocation.venueName}
//               options={props.locationList}
//               name="list"
//               className="mb-2 form-control-dashboard mt-1"
//               inputProps={{
//                 readOnly: props.srcReadOnly
//               }}
//               onBlur={e => {}}
//             />
//           </div>
//           <div className="source-button mb-1">
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/search_area.png"
//               alt="search area"
//             />
//             <Typeahead
//               required
//               placeholder={`${props.srcName}`}
//               filterBy={["name"]}
//               labelKey={option => {
//                 let resp = "";
//                 if (option.floorElement === "Rooms") {
//                   resp = option.roomName?`${option.roomName}(${option.floor})`:`${option.name} (${option.floor})`;
//                 } else if (option.floorElement === "FloorConnection") {
//                   resp = `${option.name}(${option.floor})`;
//                 } else if (option.floorElement === "Services") {
//                   if(option.type === "Beacons"){
//                     resp = ``;
//                   }else{
//                     resp = `${option.type}(${option.floor})`;
//                   }
//                 } else if (option.floorElement === "RestRooms") {
//                   resp = `${option.type} Washroom (${option.floor})`;
//                 } else {
//                   return "";
//                 }
//                 return resp;
//               }}
//               onChange={e => {
//                 console.log("ee",e)
//                     props.handleSelectSource(e)
//               }}
//               disabled={false}
//               id="source"
//               onClick={() => {}}
//               value={props.srcName}
//               options={props.srcFloorList}
//               name="list"
//               className="mb-2 form-control-dashboard mt-1"
//               inputProps={{
//                 readOnly: props.srcReadOnly
//               }}
//               onBlur={e => {}}
//             />
//           </div>
//           {/* <div className="source-button mb-1">
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/bulls_eye.png"
//               alt="find location"
//             />
//             <p className="menu-txt text-justify ">Find My Location</p>
//           </div>
//           <div className="source-button mb-1">
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/choose_map.png"
//               alt="choose map"
//             />
//             <p className="menu-txt text-justify ">Choose on Map</p>
//           </div>
//           <div className="source-button mb-1">
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/home.png"
//               alt="home"
//             />
//             <div className="d-flex-column">
//               <div className="menu-txt text-justify mb-0">Home</div>
//               <div className="text-white sub-menu-text d-block">
//                 Room/House, Building, Campus, City - 123...
//               </div>
//             </div>
//           </div>
//           <div className="source-button mb-1">
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/suitcase.png"
//               alt="work"
//             />
//             <div className="d-flex-column">
//               <div className="menu-txt text-justify mb-0">Work</div>
//               <div className="text-white sub-menu-text d-block">
//                 Room/House, Building, Campus, City - 123...
//               </div>
//             </div>
//           </div>
//           <div className="source-button mb-1">
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/saved_address.png"
//               alt="saved address"
//             />
//             <div className="d-flex-column">
//               <div className="menu-txt text-justify mb-0">Saved Address</div>
//               <div className="text-white sub-menu-text d-block">
//                 Room/House, Building, Campus, City - 123...
//               </div>
//             </div>
//           </div>
//           <div className="source-button mb-1">
//             <img
//               className="float-left mt-2 mr-2"
//               src="/inclunav/assets/images/clock.png"
//               alt="clock"
//             />
//             <div className="d-flex-column">
//               <div className="menu-txt text-justify mb-0">
//                 Landmark Previously Visited
//               </div>
//               <div className="text-white sub-menu-text d-block">
//                 Room/House, Building, Campus, City - 123...
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     );
//   };

// export default SourceMenu;

import React from 'react';
import { Typeahead } from "react-bootstrap-typeahead";
import './menu.css';

const SourceMenu = (props) => {
    return (
        <React.Fragment>
            <div
                className="source-destination fixed-top source"
                id="src-bar"
                style={{ marginTop: "50px" }}
              >
                <div className="row w-100  mx-auto">
                  <div className="col-2">
                  <img
                        className="float-left mt-2 mr-2"
                        src="/inclunav/assets/images/profile.svg"
                        alt="user location"
                        alt="current location"
                      />
                  </div>
                  <div className="col-10 p-0">
                    {/* <button
                      className="btn-nvgtn text-white"
                      onClick={() => {
                        this.setState({
                          showStrtMenu: true,
                          srcReadOnly: false
                        });
                      }}
                    >
                      <p className="strt-txt text-justify ">
                        {this.state.currentLocation}
                      </p>
                    </button> */}
                    <Typeahead
                      required
                      placeholder={`${props.selectedVenue}`}
                    //   placeholder={`${props.selectedSrcLocation.buildingName} (${props.selectedSrcLocation.venueName})`}
                      filterBy={["venueName"]}
                      labelKey={option => {
                        return `${option.venueName.split(/(?=[A-Z])/).join(" ")}`;
                      }}
                      renderMenuItemChildren={option => (
                        <div className="mapped-data m-0 ">
                            <div
                                className="row w-100"
                            >
                                <div className="col-2">
                                    <div>
                                        <img src="/inclunav/assets/images/destination2.svg" alt="destination" />
                                    </div>
                                    <div className='text-center'>
                                        {parseInt(option.distance)}
                                    </div>
                                </div>
                                <div className="col-10">
                                    <div className="row" >
                                        <div className="col-12">
                                            {option.venueName.split(/(?=[A-Z])/).join(" ")}
                                        </div>
                                    </div>
                                    <div className="row" >
                                        <div className="col-12">
                                            <small> {option.address} </small>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                          <div>
                          </div>
                        </div>
                      )}
                      onChange={e => {
                        // props.handleSourceLocation(e)
                        if(e.length>0){
                            props.venueChange(e[0].venueName)
                        }
                      }}
                      disabled={false}
                      id="source"
                      value={props.selectedVenue}
                      options={props.venueList}
                      name="list"
                      className="mb-2 form-control-dashboard mt-1"
                      inputProps={{
                        readOnly: props.srcReadOnly
                      }}
                      onBlur={e => {}}
                    />

                  </div>
                </div>
                <div className="mx-auto hr-line" />
                {/* <div className="mx-auto hr-line" />
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
                        {props.dstAddress}
                      </p>
                    </button>
                  </div>
                  <div className="col-2"></div>
                </div> */}
              </div>
                      {(props.buildingList.length>0) && !props.destinationActive && props.showMenu?
                                <div className="source-button mb-1 w-100 building">
                                <img
                                    className="float-left mt-2 mr-2"
                                    src="/inclunav/assets/images/search.png"
                                    alt="search area"
                                  />
                                  <Typeahead
                                    required
                                    placeholder = {`${props.selectedVenue}`}
                                    filterBy = {["name"]}
                                    labelKey={option => {
                                      return option.buildingName
                                    }}
                                    onChange = {e => {
                                        if(e.length>0){
                                            props.buildingChange(e[0].buildingName)
                                        }
                                    }}
                                    disabled={false}
                                    id="source"
                                    value={props.selectedBulding}
                                    options={props.buildingList}
                                    name="list"
                                    className="mb-2 form-control-dashboard mt-1 buiding"
                                    inputProps={{
                                      readOnly: props.srcReadOnly
                                    }}
                                    renderMenuItemChildren={option => (
                                      <div className="mapped-data m-0 ">
                                          <div
                                              className="row w-100"
                                          >
                                              <div className="col-2">
                                                  <div>
                                                      <img src="/inclunav/assets/images/destination2.svg" alt="destination" />
                                                  </div>
                                                  {/* <div className='text-center'>
                                                      {parseInt(option.distance)}
                                                  </div> */}
                                              </div>
                                              <div className="col-10">
                                                  <div className="row" >
                                                      <div className="col-12">
                                                          {option.buildingName.split(/(?=[A-Z])/).join(" ")}
                                                      </div>
                                                  </div>
                                                  <div className="row" >
                                                      <div className="col-12">
                                                          <small> {props.selectedVenue} </small>  
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                        <div>
                                        </div>
                                      </div>
                                    )}
                                  />
                                </div>:null}

                                {(props.srcFloorList.length>0) && !props.destinationActive  && props.showMenu?
                                <div className="source-button mb-1 w-100 src-location">
                                <img
                                    className="float-left mt-2 mr-2"
                                    src="/inclunav/assets/images/search.png"
                                    alt="search area"
                                  />
                                <Typeahead
                                              required
                                              placeholder={`${props.srcName}`}
                                              filterBy={["name"]}
                                              labelKey={option => {
                                                let resp = "";
                                                if (option.floorElement === "Rooms") {
                                                  resp = option.roomName?`${option.roomName}(${option.floor})`:`${option.name} (${option.floor})`;
                                                } else if (option.floorElement === "FloorConnection") {
                                                  resp = `${option.name}(${option.floor})`;
                                                } else if (option.floorElement === "Services") {
                                                  if(option.type === "Beacons"){
                                                    resp = ``;
                                                  }else{
                                                    resp = `${option.type}(${option.floor})`;
                                                  }
                                                } else if (option.floorElement === "RestRooms") {
                                                  resp = `${option.type} Washroom (${option.floor})`;
                                                } else {
                                                  return "";
                                                }
                                                return resp;
                                              }}
                                              onChange={e => {
                                                console.log("ee",e)
                                                    props.handleSelectSource(e)
                                              }}
                                              disabled={false}
                                              id="source"
                                              onClick={() => {}}
                                              value={props.srcName}
                                              options={props.srcFloorList}
                                              name="list"
                                              className="mb-2 form-control-dashboard mt-1"
                                              inputProps={{
                                                readOnly: props.srcReadOnly
                                              }}
                                              renderMenuItemChildren={option => {
                                                let resp = "";
                                                let floor = option.floor
                                                if (option.floorElement === "Rooms") {
                                                  resp = option.roomName?`${option.roomName}`:`${option.name}`;
                                                } else if (option.floorElement === "FloorConnection") {
                                                  resp = `${option.name}`;
                                                } else if (option.floorElement === "Services") {
                                                  if(option.type === "Beacons"){
                                                    resp = ``;
                                                  }else{
                                                    resp = `${option.type}`;
                                                  }
                                                } else if (option.floorElement === "RestRooms") {
                                                  resp = `${option.type} Washroom`;
                                                } else {
                                                  resp =  "";
                                                }

                                               return <div className="mapped-data m-0 " style={{padding:"0"}}>
                                                    <div
                                                        className="row w-100"
                                                    >
                                                        <div className="col-2">
                                                            <div>
                                                                <img src="/inclunav/assets/images/destination2.svg" alt="destination" />
                                                            </div>
                                                            {/* <div className='text-center'>
                                                                {parseInt(option.distance)}
                                                            </div> */}
                                                        </div>
                                                        <div className="col-10">
                                                            <div className="row" >
                                                                <div className="col-12">
                                                                  {resp}
                                                                </div>
                                                            </div>
                                                            <div className="row" >
                                                                <div className="col-12 text-capitalize">
                                                          <small> {floor} Floor,{option.buildingName.split(/(?=[A-Z])/).join(" ")},{option.venueName.split(/(?=[A-Z])/).join(" ")} </small>  
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                  <div>
                                                  </div>
                                                </div>
                                              }}
                                              onBlur={e => {
                                                props.handleBlurr()
                                                props.handleDstAct()
                                              }}
                                            />

                                              {/* onBlur={e => {}}
                                            /> */}
                                </div>:null}
      </React.Fragment>
    );
  };

export default SourceMenu;