import React from "react";
import PropTypes from 'prop-types';

const OwlSourceForAction = {
  SUGGEST: "../img/owl/owl1.png",
  SMILE: "../img/owl/owl2.png",
  PLAYFUL: "../img/owl/owl3.png",
  KNOW_WHAT_YOU_MEAN: "../img/owl/owl4.png",
  SLEEP: "../img/owl/owl5.png",
  SLEEPY: "../img/owl/owl6.png",
  ANGRY: "../img/owl/owl7.png",
  WONDER: "../img/owl/owl8.png",
  CHEER: "../img/owl/owl9.png"
}

class Owl extends React.Component {

  static propTypes = {
    action: PropTypes.string.isRequired
  }

  render() {
    return (
      <div>
        <img
          src={OwlSourceForAction[this.props.action]}
          style={{
            maxWidth: "100%",
            maxHeight: "95%",
            display: "block",
            zIndex: 1
          }} />
        <a href="http://www.freepik.com" style={{ textDecoration: "None", color: "#444444" }}>Image Credit : Designed by Freepik</a>
      </div>
    );
  }
}

class Bubble extends React.Component {

  static propTypes = {
    children: PropTypes.any.isRequired
  }

  render() {
    return (
      <div style={{
        width: "100%",
        top: 0,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        position: "absolute",
        zIndex: 99,
        MozBorderRadius: 20,
        WebkitBorderRadius: 20,
        borderRadius: 20,
        KhtmlBorderRadius: 20,
        border: "1px dashed #444444",
        padding: 10
      }}>{this.props.children}</div>
    );
  }
}

class OwlSay extends React.Component {

  static propTypes = {
    owlAction: PropTypes.oneOf(["SUGGEST", "SMILE", "PLAYFUL", "KNOW_WHAT_YOU_MEAN", "SLEEP", "SLEEPY", "ANGRY", "WONDER", "CHEER"]),
    message: PropTypes.any.isRequired
  }

  render() {
    let owlSize = window.innerHeight / 2;

    return (
      <div
        onClick={this.props.onClick}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          height: owlSize,
          width: owlSize,
          marginTop: -owlSize / 2,
          marginLeft: -owlSize / 2,
          textAlign: "center"
        }}>
        <Bubble>{this.props.message}</Bubble>
        <Owl action={this.props.owlAction} />
      </div>
    );
  }
}

export default OwlSay;