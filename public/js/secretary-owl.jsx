import OwlSay from "./owlsay.jsx";
import React from "react";

class SecretaryOwl extends React.Component {

  static defaultProps = {
    secondsToWaitForUserInput: 10,
  }

  constructor(props) {
    super(props);
    this.state = {
      owlAction: "SUGGEST",
      message: "Hi!, please click or tab on me when you want to tell me to do something. You can open the menu list to see and manually choose what I can do. If you don't tell me to do anything for a while, I will do some notification jobs for you because I am a sleepless owl!",
      owlIs: "SAYING"
    };
    this.jobRefs = [];
    // 1. wait for user input for 10 seconds
    //  1.1 if received user input, then proces the input, response and then go back to 1.
    //  1.2 if not received user input after 10 seconds, do a background task in a predefined list
    //    1.2.1 if the result of the background task need user response, notify the user and go to step 1.
    //    1.2.2 if the result of the background task does not need user reponse, continue doing another background task in the list.
    this.eventHandlers = {
      userGoingToSay: () => {
        this.removeAllJobs();
        this.setState({ owlAction: "SLEEPY", message: "I'm listening." });
      },
      userIsSaying: () => {
        this.setState({ owlAction: "WONDER", message: "I here you!!" });
      },
      userFinishedSaying: (userMessage) => {
        this.setState({ owlAction: "SLEEP", message: "I'm processing you message: '" + userMessage + "'" }, () => {
          this.processUserMessage(userMessage);
        });
      }
    };
    this.addJob(this.doNextBackgroundTask, this.props.secondsToWaitForUserInput);
  }

  addJob = (job, doAfterSeconds) => {
    let reference = setTimeout(() => {
      job.call(this);
      this.removeJob(reference);
    }, doAfterSeconds * 1000);
  }

  removeJob = (reference) => {
    clearTimeout(reference);
    this.jobRefs = this.jobRefs.filter(ref => ref !== reference);
  }

  removeAllJobs = () => {
    this.jobRefs.forEach(ref => {
      clearTimeout(ref);
    });

    this.jobRefs = [];
  }

  doNextBackgroundTask = () => {

  }

  processUserMessage = (userMessage) => {
    setTimeout(() => {
      this.setState({ owlAction: "KNOW_WHAT_YOU_MEAN", message: "I got it!" });
    }, 5000);
  }

  render() {
    return (
      <div style={{
        width: window.innerWidth,
        height: window.innerHeight,
        position: "relative",
        textAlign: "center"
      }}>
        <div style={{
          width: window.innerHeight/2,
          height: window.innerHeight/2,
          display: "inline-table",
          marginTop: 15
        }}>
          <OwlSay
            onUserGoingToSay={this.eventHandlers.userGoingToSay}
            onUserFinishedSaying={this.eventHandlers.userFinishedSaying}
            onUserIsSaying={this.eventHandlers.userIsSaying}
            owlAction={this.state.owlAction}
            message={this.state.message} />
        </div>
      </div>
    );
  }
}

export default SecretaryOwl;