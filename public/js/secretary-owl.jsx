import OwlSay from "./owlsay.jsx";
import React from "react";
import PropTypes from 'prop-types';

class SecretaryOwl extends React.Component {

  static defaultProps = {
    secondsToWaitForUserInput: 10,
  }

  constructor(props) {
    super(props);
    this.state = { owlAction: "SUGGEST", message: "fdfdfd" };
    // 1. wait for user input for 10 seconds
    //  1.1 if received user input, then proces the input, response and then go back to 1.
    //  1.2 if not received user input after 10 seconds, do a background task in a predefined list
    //    1.2.1 if the result of the background task need user response, notify the user and go to step 1.
    //    1.2.2 if the result of the background task does not need user reponse, continue doing another background task in the list.
    this.eventHandlers = {
      userGoingToSay: null
    };
    this.waitForUserInput(this.props.secondsToWaitForUserInput);
  }

  waitForUserInput = (seconds) => {
    let reference = setTimeout(() => {
      clearTimeout(reference);
      this.doNextBackgroundTask();
    }, seconds);

    this.eventHandlers.userGoingToSay = () => {
      clearTimeout(reference);
      this.listenToUser();
    };
  }

  doNextBackgroundTask = () => {

  }

  listenToUser = () => {
    this.setState({ owlAction: "PLAYFUL", message: "I'm listening." }, () => {
      // let soundInput = getUserMedia;
      // let message = this.resolveSound(soundInput);
      // let action = this.resovleMessage(message);
      // switch (action)
    });

    
  }

  render() {
    return (
      <div>
        <OwlSay
          owlAction={this.state.owlAction}
          message={this.state.message}
          onClick={this.eventHandlers.userGoingToSay} />
      </div>
    );
  }
}

export default SecretaryOwl;