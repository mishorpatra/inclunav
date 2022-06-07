import React from 'react';
import Modal from 'react-modal';
import {saveAddress} from '../../../store/actions/index';
import { connect } from "react-redux";
import {Link} from 'react-router-dom';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            :  "#27282D",
    width                 : "75%"
  },
  overlay: {zIndex: 9999}
};

class GlobalDetails extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        open:false,
        type:'',
        showOption:true,
        toggle:false
      }
    }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render(){
    let dstName=  ''
    if(typeof this.props.dstName === 'object'){
      dstName = this.props.dstName.name
    }else{
      dstName = this.props.dstName
    }
    
    
    return <div 
    // className={this.props.toggle ? "bottom-bar  active" : "bottom-bar"}
    >
       <Modal 
          isOpen = {this.state.open}
          // onAfterOpen = {afterOpenModal}
          onRequestClose = {this.onCloseModal}
          style = {customStyles}
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
            {this.props.destinationVenue}
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-white text-center font-weight-bold">
            <p className="h4">  Save Location as? </p>
            </div>
          </div>

          {this.state.showOption?
                    <div className="d-flex-column justify-content-center bg-white rounded" style={{padding:"1px"}}>
                    <div className="save-address-box row text-white mt-1 mb-2 ml-1 row" onClick = {()=>{
                      this.setState({
                        type:'Home'
                      })
                    }} >
                      <div className="col-2 my-auto">
                      <img
                    width="25"
                    height="25"
                    src="assets/images/home.svg"
                    alt="vew details"
                  />
                      </div>
                      <div className="col-10 my-auto">
                      Home Address
                      </div>
                    </div>
                    <div className="save-address-box row text-white mb-2 ml-1" onClick = {()=>{
                      this.setState({
                        type:'Home'
                      })
                    }} >
              <div className="col-2 my-auto">
              <img
                    width="25"
                    height="25"
                    src="assets/images/work.svg"
                    alt="vew details"
                  />
              </div>
              <div className="col-10 my-auto">
                    Work Address
              </div>
                    </div>      
                    <div className="save-address-box row text-white mb-2 ml-1" onClick = {()=>{
                      this.setState({
                        showOption:false
                      })
                    }} >
                      <div className="col-2 my-auto">
                      <img
                    width="25"
                    height="25"
                    src="assets/images/saved_address.svg"
                    alt="vew details"
                  />    
                      </div>
                      <div className="col-10 my-auto">
                        Custom Address
                      </div>
                    </div>
                </div>
          :
            <input
            type="text"
            className="form-control w-100"
            placeholder="Enter Custom Name"
            value={this.state.type}
            onChange={(e)=>{
              this.setState({
                type:e.target.value
              })
            }}
            />
          }

            
            <div className="row w-100 m-0 pb-5 mt-2">
               <div className="col-6">
                 <button
                   className={"btn btn-language-setting btn-confirm-text mx-auto btn-block btn-default font-weight-bold h2"}

                  //  className="btn btn-language-setting btn-confirm-text mx-auto btn-block btn-default font-weight-bold h2"
                   onClick={() => {
                     let array = this.props.destinationVenue.split(',')
                     let name = array[0];
                     let floor = array[1].split(' ');
                     let buildingName = array[2];
                     let venueName = array[3];

                     console.log("venue",name,floor,buildingName,venueName)
                    }}
                   style={{
                    width: "75px",
                    height: "48px",
                    float:"left",
                   }}
                 >
                   SAVE
                 </button>
               </div>
               <div className="col-6">
                 <button
                   className={"btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"}
                  //  className="btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"
                   onClick={() => {
                     this.onCloseModal()
                   }}
                   style={{
                    width: "84px",
                    height: "48px",
                    float:"right",
                }}
                 >
                    CANCEL
                 </button>
               </div>
             </div>
        
        </Modal>
        <div className= {`d-flex-column ${this.state.toggle?"bottom-barbtn":"bottom-barbtn-toggle"}`}>
                <div style={{textAlign:"center"}} onClick={() => {
        // this.props.stateToggle()
        this.setState({ toggle: !this.state.toggle });
      }} >
                <img
        
        src="assets/images/viewDetails.svg"
        alt="vew details"
      />
                </div>

{this.state.toggle?
  <div className='bg-dark'> 
                <div className="row w-100  mx-auto mb-2">
        <div className="col-2">
          <img
            className="float-left mt-2 mr-2"
            src="/inclunav/assets/images/dst_navigate.png"
            alt="select destination"
          />
        </div>
        <div className="col-8">
          <div className="direction-text">
            <div className="text-white">
              {dstName} 
            </div>
            <div className="text-white strt-txt text-justify">
              {this.props.dstAddress}
            </div>
          </div>
        </div>
        <div className="col-2">
          <div className="direction-text">
            <div className="text-white">
              {this.props.globalDistance / 1000}
            </div>
            <div className="text-white strt-txt text-justify"></div>
          </div>
        </div>
      </div>

      <div className="row w-100  mx-auto">
        <div className="col-6">
          <button
            className="btn btn-direction  mx-auto btn-block btn-default btn-lg font-weight-bold  h2"
            onClick={() => {
              this.props.handleShowInstructions();
            }}
          >
            Directions
          </button>
        </div>
        <div className="col-2">
          <button className="ellipse" onClick={()=>{
            this.onOpenModal()
          }} >
            <img
              className="mx-auto my-auto"
              src="/inclunav/assets/images/save_marker.svg"
              alt="save marker"
            />
          </button>
        </div>
        <div className="col-2">
          <Link to="/global-view">
          <button className="ellipse" 
          // onClick={()=>{
            // console.log("this.props.history",this.props.history)
            // this.props.history.push('/global-view')
          // }} 
          >
            {/* <img
              className="mx-auto my-auto"
              src="/inclunav/assets/images/share.png"
              alt="save marker"
            /> */}
            <i class="mx-auto my-auto text-white fa fa-globe"></i>
          </button>
          </Link>
        </div>
        <div className="col-2">
          <button className="ellipse">
            <img
              className="mx-auto my-auto"
              src="/inclunav/assets/images/telephone.svg"
              alt="save marker"
            />
          </button>
        </div>
      </div>
      <div className="row w-100  mx-auto bottom-div mb-2 p-2">
        <div className="col-4">
          <p className="strt-txt text-justify ">Building Entrance</p>
        </div>
        <div
          className="col-2"
          onClick={() => {
            // let e = [this.props.tmpDstLocation];
            // this.handleDstChange(e);
            // this.setState({
            // buildingView: true
            // });
            // this.nvgtDstBld();
          }}
        >
          <img
            className="ml-2"
            src="/inclunav/assets/images/way.svg"
            alt="share location"
          />
        </div>
        <div className="col-4">
          <p className="strt-txt text-justify ">
            {/* {this.props.dstAddress.split(/(?=[A-Z])/).join(" ")} */}
          </p>
        </div>
        <div
          className="col-2"
          onClick={() => {
            // this.props.handleShowInstructions();
            // this.setState({ showInstructions: true });
          }}
        >
          <img
            className="ml-2"
            src="/inclunav/assets/images/toggle_menu.svg"
            alt="share location"
          />
        </div>
      </div>
                </div>:
null}
                
        </div>

    {/* <div
      className="bottom-barbtn"
      onClick={() => {
        this.props.stateToggle()
        // this.setState({ toggle: !this.state.toggle });
      }}
    >
      <img
        
        src="assets/images/viewDetails.svg"
        alt="vew details"
      />
    </div> */}
  </div>
  }
}


const mapStateToProps = state => {
  return {
    saveAddr:state.saveAddress
  };
};

export default connect(mapStateToProps, {
  saveAddress
})(GlobalDetails);
