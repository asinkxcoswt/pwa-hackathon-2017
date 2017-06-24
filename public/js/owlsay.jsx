import React from "react";
import $ from "jquery";
import { SpeechRecognition, NoAPIException } from "./speech-recognition.jsx"

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

  static defaultProps = {
    action: "SUGGEST"
  }

  render() {
    return (
      <div>
        <img
          src={OwlSourceForAction[this.props.action]}
          style={{
            maxWidth: "100%",
            maxHeight: "100%"
          }} />
      </div>
    );
  }
}

class Bubble extends React.Component {

  static defaultProps = {
    children: ""
  }

  render() {
    return (
      <div style={{
        maxWidth: "100%",
        maxHeight: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
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

class BubbleTail extends React.Component {

  static defaultProps = {
    maxSize: 20,
    minSize: 10,
    numCircles: 4,
    color: "#3BB0D1"
  }

  renderCircle = (size, marginRight, id) => {
    return (
      <div key={id} style={{ textAlign: "right", marginRight: marginRight }}>
        <svg width={size} height={size} >
          <circle cx={size / 2} cy={size / 2} r={(size / 2) - 1} stroke={this.props.color} strokeWidth="1px" fill={this.props.color} />
        </svg>
      </div>
    );
  }

  render() {
    let max = this.props.maxSize;
    let min = this.props.minSize;
    let num = this.props.numCircles;
    return (
      <div>
        {
          Array.apply(null, Array(this.props.numCircles)).map((_, i) => {
            let size = max - i * (max - min) / (num - 1);
            let margin = 30 + i * Math.log(i + 1) * max / (num - 1);
            return this.renderCircle(size, margin, i);
          })
        }
      </div>
    );
  }
}

export class OwlSay extends React.Component {

  static defaultProps = {
    owlAction: "SUGGEST", // "SUGGEST", "SMILE", "PLAYFUL", "KNOW_WHAT_YOU_MEAN", "SLEEP", "SLEEPY", "ANGRY", "WONDER", "CHEER"
    message: "",
    width: 500,
    height: 500,
    onUserGoingToSay: () => { },
    onUserFinishedSaying: (userMessage) => { },
    context: {}
  }

  constructor(props) {
    super(props);
    this.state = { isListening: false };

  }

  userGoingToSay = () => {
    if (this.state.isListening) {
      return;
    }

    this.setState({ isListening: true }, () => {

      try {
        let speechRecognition = new SpeechRecognition({
          lang: this.props.context.lang === "EN" ? "en-EN" : "th-TH",
          onStart: () => { },
          onEnd: (message) => {
            this.props.onUserFinishedSaying(message);
            this.setState({ isListening: false });
          },
          onSpeechStart: () => {
            this.props.onUserIsSaying();
          },
          onSpeechEnd: () => { },
          onAudioStart: () => {
            this.props.onUserGoingToSay();
          },
          onAudioEnd: () => { },
          onNoMatch: () => { },
          onError: () => { }
        });
        speechRecognition.start();
      } catch (err) {
        alert("Sorry, speech recognition function only supported by Google Chrome currently.");
      }

    });

  }

  render() {
    return (
      <div
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          textAlign: "center"
        }}>
        <div>
          <Bubble>{this.props.message}</Bubble>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            right: 0
          }}>
            <BubbleTail />
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={this.userGoingToSay} >
            <Owl action={this.props.owlAction} />
          </div>
        </div>
        <a href="http://www.freepik.com" style={{ textDecoration: "None", color: "#444444" }}>Image Credit : Designed by Freepik</a>
      </div>
    );
  }
}

export default OwlSay;