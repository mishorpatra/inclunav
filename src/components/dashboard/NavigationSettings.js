import React from 'react';
import { getUserPortfolio,updateLanguage,updateHeight,updateAgegroup,updateVision,updateWalking } from "../../store/actions/index";
import { connect } from "react-redux";

 class NavigationSettings extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      language:"en",
      visionType:"sighted",
      height:"5FT-6FT",
      ageGroup:"",
      walkingType:"walking"
    };
  }

    componentDidMount(){
      let id = localStorage.getItem('id');
      let token = localStorage.getItem('token');
      this.props.getUserPortfolio({id,token},()=>{
        let data = this.props.userProfile.properties
        this.setState({
          language:data.language,
          visionType:data.visionType,
          height:data.height,
          ageGroup:data.ageGroup,
          walkingType:data.navigationMode
        })
      })
    }

    visionUpdate = (type)=>{
      let id = localStorage.getItem('id');
      let token = localStorage.getItem('token');
      this.setState({
        visionType:type  
      },()=>{
        this.props.updateVision({id,token,visionType:this.state.visionType},()=>{
        })
      })
    }

    heightUpdate = (type)=>{
      let id = localStorage.getItem('id');
      let token = localStorage.getItem('token');
      this.setState({
        height:type  
      },()=>{
        this.props.updateHeight({id,token,height:this.state.height},()=>{
        })
      })
    }

    ageGroupUpdate = (type)=>{
      let id = localStorage.getItem('id');
      let token = localStorage.getItem('token');
      this.setState({
        ageGroup:type  
      },()=>{
        this.props.updateAgegroup({id,token,ageGroup:this.state.ageGroup},()=>{
        })
      })
    }

    walkingUpdate = (type)=>{
      let id = localStorage.getItem('id');
      let token = localStorage.getItem('token');
      this.setState({
        walkingType:type  
      },()=>{
        this.props.updateWalking({id,token,navigationMode:this.state.walkingType},()=>{
        })
      })
    }

     render(){
         return (
           <div className="bg-settings container-fluid " style={{height: '100vh', overflow: 'hidden'}}>
             <div className="text-white row mt-5">
               <div className="col-lg-12 text-center" style={{marginTop: 12}}>
                 <img
                   className="mt-1"
                   src="/inclunav/assets/images/navigation_settings_invert.svg"
                   alt="user profile"
                 />
               </div>
             </div>
             <div className="row w-100 m-0" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
             <div className="text-white row ml-1 mb-1 mt-5">
               <p style={{fontSize: 'medium', textAlign: 'center', alignSelf: 'flex-start'}}>Please select your language</p>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%'}}>
                 <button
                   className={this.state.language === "en"?"btn btn-language-setting btn-confirm-text mx-auto btn-block btn-default font-weight-bold h2":"btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"}
                   onClick={() => {
                     let id = localStorage.getItem('id');
                     let token = localStorage.getItem('token');
                      this.props.updateLanguage({id,token,language:"en"},()=>{
                        let data = this.props.updatedLanguage.data;
                        this.setState({
                          language:data.language
                        })
                      })
                   }}
                   
                 >
                   ENGLISH
                 </button>
               
                 <button
                   className={this.state.language === "hi"?"btn btn-language-setting btn-confirm-text mx-auto btn-block btn-default font-weight-bold h2":"btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"}
                  //  className="btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"
                   onClick={() => {
                    let id = localStorage.getItem('id');
                    let token = localStorage.getItem('token');
                     this.props.updateLanguage({id,token,language:"hi"},()=>{
                       let data = this.props.updatedLanguage.data;
                       this.setState({
                         language:data.language
                       })
                     })
                   }}
                   style={{
                    textDecoration: 'none',
                    position: 'relative',
                    top: -4
                   }}
                 >
                   Hindi
                 </button>
                 </div>
               
             </div>
             <div className="row w-100 m-0">
             <div className="text-white row ml-1 mb-1 mt-5">
               <div className="col-12 ">Please select your vision type</div>
             </div>
               <div className="col-12">
                 <div
                   className="btn-group w-100"
                   style={{ height: "48px" }}
                   role="group"
                   aria-label="Basic example"
                 >
                   <button
                     type="button"
                     className={this.state.visionType ==="sighted"?"btn btn-secondary active-button":"btn btn-secondary inactive-button"}
                     onClick = {()=>{
                      this.visionUpdate('sighted')
                     }}
                     style={{
                        width: "78px",
                        border: "0",
                        color:"black",
                        borderBottomLeftRadius: "8px",
                        borderTopLeftRadius: "8px",
                        fontWeight: "normal",
                        fontSize: "12px",
                        lineHeight: "16px",
                        textAlign: "center"
                     }}
                   >
                     SIGHTED
                   </button>
                   <button
                     type="button"
                     className={this.state.visionType ==="low-vision"?"btn btn-secondary ml-1 mr-1 active-button":"btn btn-secondary ml-1 mr-1 inactive-button"}
                    //  className=""
                     onClick = {()=>{
                      this.visionUpdate('low-vision')
                     }}
                     style={{                         
                      width: "78px", border: "0",fontWeight: "normal",
                      fontSize: "12px",
                      lineHeight: "16px",
                      textAlign: "center" }}
                   >
                     LOW VISION
                   </button>
                   <button
                     type="button"
                    //  className="btn btn-secondary"
                    className={this.state.visionType ==="blind"?"btn btn-secondary active-button":"btn btn-secondary inactive-button"}
                    onClick = {()=>{
                      this.visionUpdate('blind')
                     }}
                     style={{ 
                     border: "0",
                     borderBottomRightRadius: "8px",
                     borderTopRightRadius: "8px",
                     width: "78px",fontWeight: "normal",
                     fontSize: "12px",
                     lineHeight: "16px",
                     textAlign: "center" }}
                   >
                     BLIND
                   </button>
                 </div>
               </div>
             </div>

             <div className="row w-100 m-0">
             <div className="text-white row ml-1 mb-1 mt-5">
               <div className="col-12 ">Please select your height group</div>
             </div>
               <div className="col-12">
                 <div
                   className="btn-group w-100"
                   style={{ height: "48px" }}
                   role="group"
                   aria-label="Basic example"
                 >
                   <button
                     type="button"
                    className={this.state.height === "<5"?"btn btn-secondary active-button":"btn btn-secondary inactive-button"}
                    onClick={()=>{
                      this.heightUpdate("<5")
                    }} 
                    style={{
                        border: "0",
                        width: "78px",
                        color:"black",
                        borderBottomLeftRadius: "8px",
                        borderTopLeftRadius: "8px",
                        fontWeight: "normal",
                        fontSize: "12px",
                        lineHeight: "16px",
                        textAlign: "center"
                     }}
                
                   >
                     LESS THAN 5 FEET
                   </button>
                   <button
                     type="button"
                     className={this.state.height === "5FT-6FT"?"btn btn-secondary ml-1 mr-1 active-button":"btn btn-secondary ml-1 mr-1 inactive-button"}
                    //  className=""
                     style={{ 
                      //  background: "#16171C", 
                       border: "0",
                     width: "78px",
                     fontWeight: "normal",
                     fontSize: "12px",
                     lineHeight: "16px",
                     textAlign: "center" }}
                     onClick={()=>{
                      this.heightUpdate("5FT-6FT")
                    }}
                   >
                     5FT - 6FT
                   </button>
                   <button
                     type="button"
                    //  className="btn btn-secondary"
                     className={this.state.height === ">6"?"btn btn-secondary active-button":"btn btn-secondary inactive-button"}
                     style={{ 
                        // background: "#16171C",
                        border: "0",
                        width: "78px",
                        borderBottomRightRadius: "8px",
                        borderTopRightRadius: "8px",
                        fontWeight: "normal",
                        fontSize: "12px",
                        lineHeight: "16px",
                        textAlign: "center" }}
                        onClick={()=>{
                          this.heightUpdate(">6")
                        }}
                   >
                    MORE THAN 6 FEET
                   </button>
                 </div>
               </div>
             </div>

             <div className="row w-100 m-0">
             <div className="text-white row ml-1 mb-1 mt-5">
               <div className="col-12 ">Please select your age group</div>
             </div>
               <div className="col-12">
                 <div
                   className="btn-group w-100"
                   style={{ height: "48px" }}
                   role="group"
                   aria-label="Basic example"
                 >
                   <button
                     type="button"
                     className={this.state.ageGroup === "adolescent"?"btn btn-secondary active-button":"btn btn-secondary inactive-button"}
                     onClick={()=>{
                       this.ageGroupUpdate("adolescent")
                     }}
                     style={{
                        background: "#2FC8AD",
                        border: "0",
                        width: "78px",
                        color:"black",
                        borderBottomLeftRadius: "8px",
                        borderTopLeftRadius: "8px",
                        fontWeight: "normal",
                        fontSize: "12px",
                        lineHeight: "16px",
                        textAlign: "center"
                     }}
                   >
                    ADOLESCENT
                   </button>
                   <button
                     type="button"
                    //  className="btn btn-secondary ml-1 mr-1"
                    className={this.state.ageGroup === "adult"?"btn btn-secondary ml-1 mr-1 active-button":"btn btn-secondary ml-1 mr-1 inactive-button"}
                    onClick={()=>{
                      this.ageGroupUpdate("adult")
                    }}
                     style={{ background: "#16171C", border: "0",
                     width: "78px",
                     fontWeight: "normal",
                     fontSize: "12px",
                     lineHeight: "16px",
                     textAlign: "center" }}
                   >
                    ADULT
                   </button>
                   <button
                     type="button"
                    //  className="btn btn-secondary"
                    className={this.state.ageGroup === "senior-citizen"?"btn btn-secondary active-button":"btn btn-secondary inactive-button"}
                    onClick={()=>{
                      this.ageGroupUpdate("senior-citizen")
                    }}
                     style={{ 
                        background: "#16171C",
                        border: "0",
                        width: "78px",
                        borderBottomRightRadius: "8px",
                        borderTopRightRadius: "8px",
                        fontWeight: "normal",
                        fontSize: "12px",
                        lineHeight: "16px",
                        textAlign: "center" }}
                   >
                    SENIOR CITIZEN
                   </button>
                 </div>
               </div>
             </div>


             <div className="row w-100 m-0 pb-5" style={{marginTop: 10}}>
             <div className="text-white row ml-1 mb-1 mt-5">
               <div className="col-12 ">Walking or wheelchair use</div>
             </div>
               <div className="col-6">
                 <button
                   className={this.state.walkingType === "walking"?"btn btn-language-setting btn-confirm-text mx-auto btn-block btn-default font-weight-bold h2":"btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"}

                  //  className="btn btn-language-setting btn-confirm-text mx-auto btn-block btn-default font-weight-bold h2"
                   onClick={() => {
                     this.walkingUpdate('walking')
                   }}
                   style={{
                    width: "112px",
                    height: "48px",
                    float:"left",
                   }}
                 >
                   <img
                   className="mt-1"
                   src="/inclunav/assets/images/walking.svg"
                   alt="user profile"
                 />
                 </button>
               </div>
                 <button
                   className={this.state.walkingType === "wheelchair"?"btn btn-language-setting btn-confirm-text mx-auto btn-block btn-default font-weight-bold h2":"btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"}
                  //  className="btn btn-language-dark btn-cancel-text mx-auto btn-block btn-default font-weight-bold h2"
                   onClick={() => {
                    this.walkingUpdate('wheelchair')
                   }}
                   style={{
                    width: "112px",
                    height: "48px",
                    float:"right",
                }}
                 >
                   <img
                   className="mt-1"
                   src="/inclunav/assets/images/wheelchair.svg"
                   alt="user profile"
                 />
                 </button>
               </div>
             </div>
         );
     }
}

const mapStateToProps = state => {
  return {
    userProfile:state.userPortfolio,
      updatedLanguage: state.updateLanguage,
      updatedHeight: state.updateHeight,
      updatedAgegroup: state.updateAgegroup,
      updatedVision: state.updateVision,
      updatedWalking: state.updateWalking
  };
};

export default connect(mapStateToProps, {
  getUserPortfolio,
  updateLanguage,
  updateHeight,
  updateAgegroup,
  updateVision,
  updateWalking
})(NavigationSettings);
