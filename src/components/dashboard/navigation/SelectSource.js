import React from "react";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";

class SelectSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indoorMapSelect: false,
      viewAll: true,
      sortedVal: null,
      categorySelect: false
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="select-source bg-white container">
          {/*Current Location */}
          <div className="row bg-dark row-rounded row-rounded">
            <div className="col-12">
              <img
                className="float-left mt-2 mr-2"
                src="/inclunav/assets/images/profile.svg"
                alt="current location"
              />
              <button
                className="btn  text-justify mt-0 text-white text-center"
                onClick={() => {
                  this.props.showStrtMenu();
                }}
                style={{width:"240px",height:"32px",overflow:'scroll'}}
              >
                {this.props.currentLocation}
              </button>
            </div>
          </div>
          {/* Starting Point Label */}
          {/* <div className="row bg-dark row-rounded">
            <div
              className="col-12 text-white my-auto"
              style={{ fontSize: "16px", lineHeight: "24px" }}
            >
              <img
                className="float-left mr-4"
                src="/inclunav/assets/images/search.svg"
                alt="search location"
              />
              Select Starting Point
            </div>
          </div> */}
          {/* Select Venue and Building */}
          <div className="row bg-dark row-rounded">
            <div className="col-12">
              <img
                className="float-left mt-2 mr-2"
                src="/inclunav/assets/images/search_area.png"
                alt="Search building and venue"
              />
              <Typeahead
                required
                placeholder={`${this.props.selectedSrcLocation.buildingName} (${this.props.selectedSrcLocation.venueName})`}
                filterBy={["venueName", "buildingName"]}
                inputProps={{'aria-label': 'Select source building.Venue name is encapsulated inside brackets.Dropdown menu will pop up as you will type along',
                            readOnly: this.props.srcReadOnly
                }}
                labelKey={option => {
                  return `${option.buildingName
                    .split(/(?=[A-Z])/)
                    .join(" ")}(${option.venueName
                    .split(/(?=[A-Z])/)
                    .join(" " )})`;
                }}
                renderMenuItemChildren={option => (
                  <div
                    className="mapped-data m-0 "
                    style={{
                      left: "-35px",
                      width: "100%"
                    }}
                  >
                    <div className="row w-100">
                      <div className="col-2">
                        <div>
                          <img
                            src="/inclunav/assets/images/destination2.svg"
                            alt="Select Building"
                          />
                        </div>
                        <div className="text-center">
                          {parseInt(option.venueDistance)} km
                        </div>
                      </div>
                      <div className="col-10">
                        <div className="row">
                          <div className="col-12">
                            {/* {option.venueName.split(/(?=[A-Z])/).join(" ")} */}
                            {option.buildingName.length > 0
                              ? option.buildingName.split(/(?=[A-Z])/).join(" ")
                              : ""}
                            ({option.venueName.split(/(?=[A-Z])/).join(" ")})
                            {/* {parseInt(option.venueDistance)} KiloMeter ) */}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <small> {option.address} </small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                )}
                onChange={e => {
                  this.setState(
                    {
                      indoorMapSelect: false
                    },
                    () => {
                      this.props.handleSourceLocation(e);
                    }
                  );
                }}
                disabled={false}
                id="source"
                value={this.props.selectedSrcLocation.venueName}
                options={this.props.locationList}
                name="list"
                className="mb-2 form-control-dashboard mt-1"
                onFocus={e => {
                  this.setState({
                    indoorMapSelect: true
                  });
                }}
                minLength={1}
                onBlur={e => {}}
              />
            </div>
          </div>

          {!this.state.indoorMapSelect ? (
            <React.Fragment>
              {/* Select Landmark */}
              <div className="row bg-dark row-rounded">
                <div className="col-12">
                  <img
                    className="float-left mt-2 mr-2"
                    src="/inclunav/assets/images/search_area.png"
                    alt="search area"
                  />
                  <Typeahead
                    required
                    placeholder={`Search within Building`}
                    filterBy={["name"]}
                    labelKey={option => {
                      let resp = "";
                      if (option.floorElement === "Rooms") {
                        resp = option.roomName
                          ? `${option.roomName}(${option.floor})`
                          : `${option.name} (${option.floor})`;
                      } else if (option.floorElement === "FloorConnection") {
                        resp = `${option.name}(${option.floor})`;
                      } else if (option.floorElement === "Services") {
                        if (option.type === "Beacons") {
                          resp = ``;
                        } else {
                          resp = `${option.type}(${option.floor})`;
                        }
                      } else if (option.floorElement === "RestRooms") {
                        resp = `${option.type} Washroom (${option.floor})`;
                      } else {
                        return "";
                      }
                      return resp;
                    }}
                    renderMenu={(results, menuProps) => {
                      return (
                        <React.Fragment>
                          {/* Landmark without category*/}
                          <div className="landmark">
                            <Menu>
                              {!this.state.categorySelect ? (
                                <React.Fragment>
                                  <div className="row bg-dark row-rounded w-100 m-0 mb-1">
                                    <div className="col">
                                      <button
                                        className="btn text-white"
                                        onClick={() => {
                                          this.setState({
                                            categorySelect: !this.state
                                              .categorySelect
                                          });
                                        }}
                                      >
                                        Select by Category
                                      </button>
                                    </div>
                                  </div>
                                  <div className="row bg-dark row-rounded w-100 m-0 mb-1">
                                    <div className={this.state.viewAll?"col-4 font-weight-bold":"col-4"} aria-hidden="false">View All</div>
                                    <div className="col-4">
                                      <button
                                        className="btn"
                                        onClick={() => {
                                          this.setState(
                                            {
                                              viewAll: !this.state.viewAll,
                                              sortedVal:
                                                this.state.sortedVal === null
                                                  ? "Rooms"
                                                  : null
                                            },
                                            () => {
                                            }
                                          );
                                        }}
                                      >
                                        {this.state.viewAll ? (
                                          <img src="/inclunav/assets/images/option_select.svg"  alt="click to show sorted options"/>
                                        ) : (
                                          <img src="/inclunav/assets/images/option_deselect.svg"  alt="click to show all options"/>
                                        )}
                                      </button>
                                    </div>
                                    <div className= {!this.state.viewAll?"col-4 font-weight-bold":"col-4"}>
                                      Sort
                                    </div>
                                  </div>
                                  {!this.state.viewAll ? (
                                    <div className="row bg-dark row-rounded w-100 m-0 mb-1">
                                      <div className= {this.state.sortedVal ==="Rooms"?"col-4 font-weight-bold":"col-4"} aria-hidden="false" >Rooms</div>
                                      <div className="col-4">
                                        <button
                                          className="btn"
                                          onClick={() => {
                                            this.setState(
                                              {
                                                sortedVal:
                                                  this.state.sortedVal ===
                                                    null ||
                                                  this.state.sortedVal ===
                                                    "Rooms"
                                                    ? "Amenities"
                                                    : "Rooms"
                                              },
                                              () => {
                                                console.log(
                                                  "this.state.sortedVal",
                                                  this.state.sortedVal
                                                );
                                              }
                                            );
                                          }}
                                        >
                                          {this.state.sortedVal === null ||
                                          this.state.sortedVal === "Rooms" ? (
                                            <img src="/inclunav/assets/images/option_select.svg" alt="double tap to show only amenities" />
                                          ) : (
                                            <img src="/inclunav/assets/images/option_deselect.svg" alt="double tap to show only rooms" />
                                          )}
                                        </button>
                                      </div>
                                      <div className= {this.state.sortedVal ==="Amenities"?"col-4 font-weight-bold":"col-4"} aria-hidden="false">
                                        Amenities
                                      </div>
                                    </div>
                                  ) : null}
                                  {results.map((option, index) => {
                                    let resp = "";
                                    let floor = option.floor;
                                    if (option.floorElement === "Rooms") {
                                      resp = option.roomName
                                        ? `${option.roomName}`
                                        : `${option.name}`;
                                    } else if (
                                      option.floorElement === "FloorConnection"
                                    ) {
                                      resp = `${option.name}`;
                                    } else if (
                                      option.floorElement === "Services"
                                    ) {
                                      if (option.type === "Beacons") {
                                        resp = ``;
                                      } else {
                                        resp = `${option.type}`;
                                      }
                                    } else if (
                                      option.floorElement === "RestRooms"
                                    ) {
                                      resp = `${option.type} Washroom`;
                                    } else {
                                      resp = "";
                                    }
                                    if (
                                      this.state.sortedVal === "Rooms" &&
                                      (option.floorElement ===
                                        "FloorConnection" ||
                                        option.floorElement === "Services")
                                    ) {
                                      resp = "";
                                      return null;
                                    } else if (
                                      this.state.sortedVal === "Amenities" &&
                                      option.floorElement === "Rooms"
                                    ) {
                                      resp = "";
                                      return null;
                                    }
                                    return (
                                      <MenuItem
                                        option={option}
                                        position={index}
                                      >
                                        <div className="row w-100 mb-2">
                                          <div className="col-2">
                                            <div>
                                              <img
                                                src="/inclunav/assets/images/destination2.svg"
                                                alt="landmark"
                                              />
                                            </div>
                                          </div>
                                          <div className="col-10">
                                            <div className="row">
                                              <div className="col-12">
                                                {resp}
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-12 text-capitalize">
                                                <small>
                                                  {" "}
                                                  {floor} Floor,
                                                  {this.props.selectedSrcLocation.buildingName
                                                    .split(/(?=[A-Z])/)
                                                    .join(" ")}
                                                  ,
                                                  {this.props.selectedSrcLocation.venueName
                                                    .split(/(?=[A-Z])/)
                                                    .join(" ")}{" "}
                                                </small>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </MenuItem>
                                    );
                                  })}
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  {/* Landmark with category*/}
                                  <div className="row">
                                    <div
                                      className="bg-dark row-rounded text-white text-center w-100"
                                      style={{ height: "fit-content" }}
                                    >
                                      <p className="h6 font-weight-bold mt-3 mb-3">
                                        <u>Select a Category</u>
                                      </p>
                                      <div className="row mb-4">
                                        <div className="col-3 mx-auto">
                                          <button
                                            className="btn  text-justify mt-0 text-white text-center"
                                            onClick={() => {
                                              this.setState({
                                                categorySelect: false
                                              });
                                            }}
                                          >
                                            <p>Faculty Cabins</p>
                                          </button>
                                        </div>
                                        <div className="col-3 mx-auto">
                                          <button
                                            className="btn  text-justify mt-0 text-white text-center"
                                            onClick={() => {
                                              this.setState({
                                                categorySelect: false
                                              });
                                            }}
                                          >
                                            <img
                                              src="/inclunav/assets/images/security.svg"
                                              alt="education"
                                            />
                                            <p>Security & Safety</p>
                                          </button>
                                        </div>
                                        <div className="col-3 mx-auto">
                                          <button
                                            className="btn  text-justify mt-0 text-white text-center"
                                            onClick={() => {
                                              this.setState({
                                                categorySelect: false
                                              });
                                            }}
                                          >
                                            <img
                                              src="/inclunav/assets/images/food.svg"
                                              alt="health"
                                            />
                                            <p>Food & Drink</p>
                                          </button>
                                        </div>
                                      </div>
                                      <div className="row mb-1">
                                        <div className="col-3 mx-auto">
                                          <button
                                            className="btn  text-justify mt-0 text-white text-center"
                                            onClick={() => {
                                              this.setState({
                                                categorySelect: false
                                              });
                                            }}
                                          >
                                            <img
                                              src="/inclunav/assets/images/education.svg"
                                              alt="hospitality"
                                            />
                                            <p>Learning Spaces</p>
                                          </button>
                                        </div>
                                        <div className="col-3 mx-auto">
                                          <button
                                            className="btn  text-justify mt-0 text-white text-center"
                                            onClick={() => {
                                              this.setState({
                                                categorySelect: false
                                              });
                                            }}
                                          >
                                            <img
                                              src="/inclunav/assets/images/aid.svg"
                                              alt="public"
                                            />
                                            <p>Health</p>
                                          </button>
                                        </div>
                                        <div className="col-3"></div>
                                      </div>
                                      <div className="row pb-5">
                                        <div className="col-3"></div>
                                        <div className="col-3"></div>
                                        <div className="col-3"></div>
                                      </div>
                                    </div>
                                  </div>
                                </React.Fragment>
                              )}
                            </Menu>
                          </div>
                        </React.Fragment>
                      );
                    }}
                    onChange={e => {
                      this.props.handleSelectSource(e);
                    }}
                    disabled={false}
                    id="source"
                    onClick={() => {}}
                    value={this.props.srcName}
                    options={this.props.srcFloorList}
                    name="list"
                    className="mb-2 form-control-dashboard mt-1"
                    inputProps={{
                      readOnly: this.props.srcReadOnly
                    }}
                    onBlur={e => {}}
                  />
                </div>
              </div>
              {/* Extra options */}
              <div className="row bg-dark row-rounded">
                <div className="col">
                  <img
                    className="float-left mt-2 mr-2"
                    src="/inclunav/assets/images/choose_map.png"
                    alt="choose map"
                  />
                  <p className="sv-addr-txt text-justify ">Choose on Map</p>
                </div>
              </div>

              <div className="row bg-dark row-rounded saved-address">
                <div className="col">
                  <img
                    className="float-left mt-2 mr-2"
                    src="/inclunav/assets/images/home.png"
                    alt="home"
                  />
                  <div className="d-flex-column">
                    <div className="sv-addr-txt text-justify mb-0">Home</div>
                    <div className="text-white sub-sv-add-txt d-block">
                      Room/House, Building, Campus, City - 123...
                    </div>
                  </div>
                </div>
              </div>

              <div className="row bg-dark row-rounded saved-address">
                <div className="col">
                  <img
                    className="float-left mt-2 mr-2"
                    src="/inclunav/assets/images/suitcase.png"
                    alt="work"
                  />
                  <div className="d-flex-column">
                    <div className="sv-addr-txt text-justify mb-0">Work</div>
                    <div className="text-white sub-sv-add-txt d-block">
                      Room/House, Building, Campus, City - 123...
                    </div>
                  </div>
                </div>
              </div>

              <div className="row bg-dark row-rounded saved-address">
                <div className="col">
                  <img
                    className="float-left mt-2 mr-2"
                    src="/inclunav/assets/images/saved_address.png"
                    alt="saved address"
                  />
                  <div className="d-flex-column">
                    <div className="sv-addr-txt text-justify mb-0">
                      Saved Address
                    </div>
                    <div className="text-white sub-sv-add-txt d-block">
                      Room/House, Building, Campus, City - 123...
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* Venue Category */}
              <div className="row">
                <div
                  className="bg-dark row-rounded text-white text-center w-100"
                  style={{ height: "fit-content" }}
                >
                  <p className="h6 font-weight-bold mt-4 mb-4">
                    <u>Select a Category</u>
                  </p>
                  <div className="row mb-5">
                    <div className="col-3 mx-auto">
                      <button
                        className="btn  text-justify mt-0 text-white text-center"
                        onClick={() => {
                          this.setState({});
                        }}
                      >
                        <img
                          src="/inclunav/assets/images/banking.svg"
                          alt="banking"
                        />
                        <p>Banking</p>
                      </button>
                    </div>
                    <div className="col-3 mx-auto">
                      <button
                        className="btn  text-justify mt-0 text-white text-center"
                        onClick={() => {
                          this.setState({
                            indoorMapSelect: false
                          });
                        }}
                      >
                        <img
                          src="/inclunav/assets/images/education.svg"
                          alt="education"
                        />
                        <p>Education</p>
                      </button>
                    </div>
                    <div className="col-3 mx-auto">
                      <button
                        className="btn  text-justify mt-0 text-white text-center"
                        onClick={() => {
                          this.setState({
                            indoorMapSelect: false
                          });
                        }}
                      >
                        <img
                          src="/inclunav/assets/images/aid.svg"
                          alt="health"
                        />
                        <p>Health</p>
                      </button>
                    </div>
                  </div>
                  <div className="row mb-5">
                    <div className="col-3">
                      <button
                        className="btn  text-justify mt-0 text-white text-center"
                        onClick={() => {
                          this.setState({
                            indoorMapSelect: false
                          });
                        }}
                      >
                        <img
                          src="/inclunav/assets/images/hospitality.svg"
                          alt="hospitality"
                        />
                        <p>Hospitality</p>
                      </button>
                    </div>
                    <div className="col-3 mx-auto">
                      <button
                        className="btn  text-justify mt-0 text-white text-center ml-4"
                        onClick={() => {
                          this.setState({
                            indoorMapSelect: false
                          });
                        }}
                      >
                        <img
                          src="/inclunav/assets/images/public.svg"
                          alt="public"
                        />
                        <p>Public Building</p>
                      </button>
                    </div>
                    <div className="col-3 mx-auto">
                      <button
                        className="btn  text-justify mt-0 text-white text-center"
                        onClick={() => {
                          this.setState({
                            indoorMapSelect: false
                          });
                        }}
                      >
                        <img
                          src="/inclunav/assets/images/shopping.svg"
                          alt="shopping"
                        />
                        <p>Shopping</p>
                      </button>
                    </div>
                  </div>
                  <div className="row pb-5">
                    <div className="col-3">
                      <button
                        className="btn  text-justify mt-0 text-white text-center"
                        onClick={() => {
                          this.setState({
                            indoorMapSelect: false
                          });
                        }}
                      >
                        <img
                          src="/inclunav/assets/images/transport.svg"
                          alt="banking"
                        />
                        <p>Transport</p>
                      </button>
                    </div>
                    <div className="col-3"></div>
                    <div className="col-3"></div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default SelectSource;
