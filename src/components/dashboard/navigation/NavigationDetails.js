import React from 'react';

class NavigationDetails extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      instructionSet :[],
      pause:true
    }
  }

  componentDidMount(){
    var instructions = [];
    var stepsCount = [];
    
    console.log("instruction set",this.props.instructionSet)

    instructions = this.props.instructionSet &&  this.props.instructionSet.map((r, i) => {
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
      this.setState({
        instructionSet:instructions
      })
    }
  }

  playRoute = ()=>{
    console.log("called")
    var synth = window.speechSynthesis;
    console.log("r",this.state.instructionSet)

    this.state.instructionSet.forEach(r=>{
      var utterance1 = new SpeechSynthesisUtterance(r);
      synth.speak(utterance1);
    })
    // synth.speak(utterance1);
    // synth.speak(utterance2);
    // synth.pause(); // pauses utterances being spoken
  }

  render(){
    return <div
    className={
      this.props.toggle
        ? "bottom-navigation-bar active"
        : "bottom-navigation-bar"
    }
  >
    <div
      className="bottom-navigation-barbtn"
      onClick={() => {
          this.props.stateToggle()
        // this.setState({ toggle: !this.state.toggle });
      }}
    >
      <img
        className="vector40"
        src="assets/images/viewDetails.svg"
        alt="doubel tap to open instruction options"
      />
    </div>

    <div className="navigation-details">
      <div className="row w-100 navigation-header mx-auto mb-1">
        <div
          className="col-2"
          onClick={() => {
              this.props.closeBuilding()
          }}
        >
          <img
            className="float-left mt-4 mr-2"
            src="/inclunav/assets/images/close_navigation.svg"
            alt="go back to navigation page"
          />
        </div>
        <div className="col-8 my-auto" onClick={()=>{
          this.props.stateToggle()

        }}>
          <div className="direction-text">
            <div className="text-white">{this.props.dstName} </div>
            <div className="text-white strt-txt text-justify">
            <span className="sr-only">You have to reach</span>  {this.props.dstAddress}
            </div>
          </div>
        </div>
        <div className="col-2">
          <img
            className="float-left mt-4 mr-2"
            src="/inclunav/assets/images/switch.svg"
            alt="switch floor connection"
          />
        </div>
      </div>
      <div className="row w-100  mx-auto bottom-navigation-div mb-1">
      <div className="col-2 text-white my-auto"   onClick={()=>{
            this.setState({
              pause:!this.state.pause
            },()=>{
              this.props.playInstruction(this.state.pause)
            })
          }}>
        {/* <img
            className="ml-2 mt-2"
            src={this.state.pause === false?"/inclunav/assets/images/route_voice.svg":"/inclunav/assets/images/voice_navigation_off.svg"}
            alt="share location"
          /> */}
          {this.state.pause === false?<React.Fragment> <i className="fa fa-pause" title="double tap to pause" /> <span className="sr-only">double tap to pause  </span> </React.Fragment>:<React.Fragment> <i className="fa fa-play" title="double tap to play" /> <span className="sr-only"> double tap to play  </span> </React.Fragment>}
        </div>
          <div className="col-2 text-white my-auto" onClick = {()=>{
            this.props.previousButton()
          }} >
          <i className="fa fa-step-backward" title="previous step" /><span className="sr-only">Previous Step  </span>
        </div>
        <div className="col-2 my-auto" onClick={()=>{
          this.props.nextButton()
        }} >
          <i className="fa fa-step-forward" title="next step" /><span className="sr-only">Next Step  </span>
        </div>
        <div
          className="col-6 my-auto"
          onClick={()=>{
            this.setState({
              pause:!this.state.pause
            },()=>{
              this.props.playInstruction(this.state.pause)
            })
          }}
        >
            Play Route
        </div>
      </div>
      <div className="row w-100  mx-auto bottom-navigation-div mb-1">
      <div
          className="col-2"
          onClick={() => {
              this.props.handleShowInstructions()
          }}
        >
          <img
            className="ml-2 mt-2"
            src="/inclunav/assets/images/toggle_menu.svg"
            alt="share location"
          />
        </div>
        <div
          className="col-10 my-auto"
          onClick={() => {
          }}
        >
            View Directions
        </div>
      </div>
      {/* <div className="row w-100  mx-auto bottom-navigation-div">
      <div
          className="col-2"
          onClick={() => {
              this.props.handleShowInstructions()
          }}
        >
          <img
            className="ml-2 mt-2"
            src="/inclunav/assets/images/telephone.svg"
            alt="share location"
          />
        </div>
        <div
          className="col-10 my-auto"
          onClick={() => {
          }}
        >
            Contact Building Staff
        </div>
      </div> */}
    </div>
  </div>
  }
}


  export default NavigationDetails;