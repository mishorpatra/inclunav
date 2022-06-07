import React from 'react';

export default function Instructions (props) {
  var instructions = [];
  var stepsCount = [];
  instructions = props.instructionSet &&  props.instructionSet.map((r, i) => {
                    // if(!props.buildingView){
                    //   if (
                    //     r.text.includes("right") ||
                    //     r.text.includes("Right")
                    //   ) {
                    //     return {src:"assets/images/turn_right.svg",text:r.text} 
                    //   } else if (
                    //     r.text.includes("left") ||
                    //     r.text.includes("Left")
                    //   ) {
                    //     return {src:"assets/images/turn_left.svg" ,text:r.text} 
                    //   } else if (
                    //     r.text.includes("forward") ||
                    //     r.text.includes("Turn 12 O' Clock")
                    //   ) {
                    //     return {src:"assets/images/go_straight.svg" ,text:r.text} 
                    //   } else if (
                    //     r.text.includes("Turn 1 O' Clock") ||
                    //     r.text.includes("Turn 2 O' Clock") ||
                    //     r.text.includes("Turn 3 O' Clock") ||
                    //     r.text.includes("Turn 4 O' Clock") ||
                    //     r.text.includes("Turn 5 O' Clock")
                    //   ) {
                    //     return {src:"assets/images/slight_right.svg",text:r.text} 
                    //   } else if (
                    //     r.text.includes("Turn 7 O' Clock") ||
                    //     r.text.includes("Turn 8 O' Clock") ||
                    //     r.text.includes("Turn 9 O' Clock") ||
                    //     r.text.includes("Turn 10 O' Clock") ||
                    //     r.text.includes("Turn 11 O' Clock")
                    //   ) {
                    //     return {src:"assets/images/left.svg" ,text:r.text}
                    //   } else if (
                    //     r.text.includes("Turn 6 O' Clock")
                    //   ) {
                    //     return {src:"assets/images/uturn.svg" ,text:r.text}
                    //   } else if (r.text.includes("You are at")) {
                    //     return {src:"assets/images/live_location.svg" ,text:r.text}
                    //   } else if (r.text.includes("reached")) {
                    //     return {src:"assets/images/reached.svg" ,text:r.text}
                    //   }else{
                    //     return {src:"assets/images/question_mark.svg" ,text:r.text}
                    //   }
                    // }else{
                      if (
                        r.includes("right") ||
                        r.includes("Right")
                      ) {
                        return {src:"assets/images/turn_right.svg",text:r} 
                      } else if (
                        r.includes("left") ||
                        r.includes("Left")
                      ) {
                        return {src:"assets/images/turn_left.svg" ,text:r} 
                      }else if (
                        r.includes("Lift") 
                      ) {
                        return {src:"assets/images/lift.svg" ,text:r} 
                      }else if (
                        r.includes("Stairs") 
                      ) {
                        return {src:"assets/images/stairs.svg" ,text:r} 
                      } else if (
                        r.includes("forward")
                      ) {
                        let theNum  = r.match(/\d+/)[0]
                        stepsCount.push(parseInt(theNum))
                        return {src:"assets/images/go_straight.svg" ,text:r} 
                      }else if(r.includes("Turn 3 O' Clock")){
                        return {src:"assets/images/right.svg",text:'Turn right'} 
                      }else if(r.includes("Turn 9 O' Clock")){
                        return {src:"assets/images/left.svg",text:'Turn left'} 
                      } else if (
                        r.includes("Turn 1 O' Clock") ||
                        r.includes("Turn 2 O' Clock")
                      ) {
                        return {src:"assets/images/slight_right.svg",text:'Turn slight right'} 
                      }else if(  
                        r.includes("Turn 4 O' Clock") ||
                        r.includes("Turn 5 O' Clock")){
                          return {src:"assets/images/uturn_right.svg",text:'Turn back and then turn slight left'} 
                      } else if (
                        r.includes("Turn 7 O' Clock") ||
                        r.includes("Turn 8 O' Clock")
                      ) {
                        return {src:"assets/images/slight_left.svg" ,text:'turn slight left'}
                      }else if(                        
                        r.includes("Turn 10 O' Clock") ||
                        r.includes("Turn 11 O' Clock")){
                          return {src:"assets/images/turn_left.svg" ,text:'then turn slight left'}
                      } else if (
                        r.includes("Turn 6 O' Clock")
                      ) {
                        return {src:"assets/images/question_mark.svg" ,text:'Turn back'}
                      } else if (r.includes("You are at")) {
                        return {src:"assets/images/source.svg" ,text:r}
                      } else if (r.includes("reach")) {
                        return {src:"assets/images/destination2.svg" ,text:r}
                      } else if (
                        r.includes("Turn 0 O' Clock") ||
                        r.includes("Turn 12 O' Clock")
                      ) {
                        return {src:"assets/images/go_straight.svg" ,text:null} 
                      }else{
                        return {src:"assets/images/question_mark.svg" ,text:r}
                      }
                    // }        
  })
  var distance

  if(instructions){
    const add = arr => arr.reduce((a, b) => a + b, 0);
    distance = add(stepsCount);
    instructions = instructions.filter( (el)=> {
      return el.text != null;
    });
  }


  return(
    <React.Fragment>
            <div className="bg-landing  container-fluid" style={{marginTop:"50px",height:"100vh",position:"fixed"}} >
              <div
                className="row w-100"
                onClick={() => {
                  props.handleBuildingView();
                }}
              >
                <div className="col-2">
                  <img
                    className="ml-2"
                    src="/inclunav/assets/images/cross.svg"
                    alt="share location"
                  />
                </div>
                <div className="col-8">
                  <p className="direction-text text-white text-center">
                  {parseInt(distance*0.6)} Meter
                  {/* {parseFloat(props.globalDistance/1000).toFixed(3)} Km */}
                  </p>
                  <p className="strt-text text-white text-center">
                  {props.buildingView?'via Walking':null}
                  </p>
                </div>
                <div className="col-2">
                  <img
                    className="ml-2"
                    src="/inclunav/assets/images/switch.svg"
                    alt="share location"
                  />
                </div>
              </div>
              <div className="row w-100  mx-auto bottom-div mb-2 p-2">
                <div className="col-4">
                  <p className="strt-txt text-justify ">{props.sourceLocation.split(/(?=[A-Z])/).join(" ")}</p>
                </div>
                <div className="col-4">
                  <img
                    className="ml-2"
                    src="/inclunav/assets/images/way.svg"
                    alt="share location"
                  />
                </div>
                <div className="col-4">
                  <p className="strt-txt text-justify ">
                    {props.dstAddress.split(/(?=[A-Z])/).join(" ")}
                  </p>
                </div>
               
              </div>
              <hr className="instructions-hr" />
              <div
                className="row w-100"
                onClick={() => {
                  props.handleBuildingView();
                }}
              >
                <div className="col-12">
                  <p className="steps">Steps</p>
                </div>
              </div>
              <div style={{
                height:"65%",
                overflow:"scroll"
              }}>
              { instructions&&instructions.map((r, i) => {
                return  <React.Fragment>
                    <hr className="instructions-hr" />
                    <div
                      className="row w-100"
                      onClick={() => {
                        props.handleBuildingView();
                      }}
                    >
                      <div className="col-2">
                        <img src={r.src} alt="direction icon"/>
                      </div>
                      <div className="col-10">
                        <p className="strt-text text-white">{r.text}</p>
                      </div>
                    </div>          
                  </React.Fragment>
                })}
                </div>
                {/* {props.buildingView && instructions&&instructions.map((r, i) => {
                console.log("dd",r)
                return  <React.Fragment>
                    <hr className="instructions-hr" />
                    <div
                      className="row w-100"
                      onClick={() => {
                        props.handleBuildingView();
                      }}
                    >
                      <div className="col-2">
                        <img src={r.src} alt="direction icon"/>
                      </div>
                      <div className="col-10">
                        <p className="strt-text text-white">{r}</p>
                      </div>
                    </div>          
                  </React.Fragment>
                })} */}
            </div>
      </React.Fragment>
  )
}

