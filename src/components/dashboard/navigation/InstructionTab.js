import React from 'react'
const InstructionTab = (props)=>{
    return (
        <React.Fragment>
        <div className="top-content">
                <div className="row w-100 h-100">
                  {props.pathCaption.map((r, i) => {
                    if (i === props.currentStep) {
                      return (
                          <React.Fragment>
                        <div
                          className="col-2 font-weight-bolder text-center my-auto"
                        >
                          {(()=>{
                                                if (
                                                    i === props.currentStep &&
                                                    props.pathCaption[i]
                                                  ) {
                                                    if (
                                                      props.pathCaption[i].includes("right") ||
                                                      props.pathCaption[i].includes("Right")
                                                    ) {
                                                      return <img src="assets/images/turn_right.svg" />;
                                                    } else if (
                                                      props.pathCaption[i].includes("left") ||
                                                      props.pathCaption[i].includes("Left")
                                                    ) {
                                                      return <img src="assets/images/turn_left.svg" />;
                                                    } else if (
                                                      props.pathCaption[i].includes("forward") ||
                                                      props.pathCaption[i].includes("Turn 12 O' Clock")
                                                    ) {
                                                      return <img src="assets/images/go_straight.svg" />;
                                                    } else if (
                                                      props.pathCaption[i].includes(
                                                        "Turn 1 O' Clock"
                                                      ) ||
                                                      props.pathCaption[i].includes(
                                                        "Turn 2 O' Clock"
                                                      ) ||
                                                      props.pathCaption[i].includes(
                                                        "Turn 3 O' Clock"
                                                      ) ||
                                                      props.pathCaption[i].includes(
                                                        "Turn 4 O' Clock"
                                                      ) ||
                                                      props.pathCaption[i].includes("Turn 5 O' Clock")
                                                    ) {
                                                      return <img src="assets/images/slight_right.svg" />;
                                                    } else if (
                                                      props.pathCaption[i].includes(
                                                        "Turn 7 O' Clock"
                                                      ) ||
                                                      props.pathCaption[i].includes(
                                                        "Turn 8 O' Clock"
                                                      ) ||
                                                      props.pathCaption[i].includes(
                                                        "Turn 9 O' Clock"
                                                      ) ||
                                                      props.pathCaption[i].includes(
                                                        "Turn 10 O' Clock"
                                                      ) ||
                                                      props.pathCaption[i].includes("Turn 11 O' Clock")
                                                    ) {
                                                      return <img src="assets/images/slight_left.svg" />;
                                                    } else if (
                                                      props.pathCaption[i].includes("Turn 6 O' Clock")
                                                    ) {
                                                      return <img src="assets/images/uturn.svg" />;
                                                    } else if (
                                                      props.pathCaption[i].includes("You are at")
                                                    ) {
                                                      return <img src="assets/images/live_location.svg" />;
                                                    } else if (
                                                      props.pathCaption[i].includes("reached")
                                                    ) {
                                                      return <img src="assets/images/reached.svg" />;
                                                    } else {
                                                      return <img src="assets/images/live_location.svg" />;
                                                    }
                                                  } else {
                                                    return null;
                                                  }
                          })()}
                        </div>
                        <div
                          className="col-10 font-weight-bolder text-white text-center my-auto"
                          id={`show_${props.imgDiv}`}
                        >
                          {r}
                        </div>
                        </React.Fragment>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
              <div
                className="top-content2 text-center text-white"
                onClick={() => {
                  props.nextButton();
                }}
              >
                Then
                {props.pathCaption.map((r, i) => {
                  if (
                    i === props.currentStep &&
                    props.pathCaption[i + 1]
                  ) {
                    if (
                      props.pathCaption[i + 1].includes("right") ||
                      props.pathCaption[i + 1].includes("Right")
                    ) {
                      return <img src="assets/images/turn_right.svg" />;
                    } else if (
                      props.pathCaption[i + 1].includes("left") ||
                      props.pathCaption[i + 1].includes("Left")
                    ) {
                      return <img src="assets/images/turn_left.svg" />;
                    } else if (
                      props.pathCaption[i + 1].includes("forward") ||
                      props.pathCaption[i + 1].includes("Turn 12 O' Clock")
                    ) {
                      return <img src="assets/images/go_straight.svg" />;
                    } else if (
                      props.pathCaption[i + 1].includes(
                        "Turn 1 O' Clock"
                      ) ||
                      props.pathCaption[i + 1].includes(
                        "Turn 2 O' Clock"
                      ) ||
                      props.pathCaption[i + 1].includes(
                        "Turn 3 O' Clock"
                      ) ||
                      props.pathCaption[i + 1].includes(
                        "Turn 4 O' Clock"
                      ) ||
                      props.pathCaption[i + 1].includes("Turn 5 O' Clock")
                    ) {
                      return <img src="assets/images/slight_right.svg" />;
                    } else if (
                      props.pathCaption[i + 1].includes(
                        "Turn 7 O' Clock"
                      ) ||
                      props.pathCaption[i + 1].includes(
                        "Turn 8 O' Clock"
                      ) ||
                      props.pathCaption[i + 1].includes(
                        "Turn 9 O' Clock"
                      ) ||
                      props.pathCaption[i + 1].includes(
                        "Turn 10 O' Clock"
                      ) ||
                      props.pathCaption[i + 1].includes("Turn 11 O' Clock")
                    ) {
                      return <img src="assets/images/slight_left.svg" />;
                    } else if (
                      props.pathCaption[i + 1].includes("Turn 6 O' Clock")
                    ) {
                      return <img src="assets/images/uturn.svg" />;
                    } else if (
                      props.pathCaption[i + 1].includes("You are at")
                    ) {
                      return <img src="assets/images/live_location.svg" />;
                    } else if (
                      props.pathCaption[i + 1].includes("reached")
                    ) {
                      return <img src="assets/images/reached.svg" />;
                    } else {
                      return <img src="assets/images/live_location.svg" />;
                    }
                  } else {
                    return null;
                  }
                })}
              </div>
              </React.Fragment>
    )
}

export default InstructionTab;