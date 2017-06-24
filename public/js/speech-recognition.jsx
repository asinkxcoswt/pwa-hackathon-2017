
export class NoAPIException {
  constructor(message) {
    this.message = message;
    this.name = "NoAPIException";
  }
}

export class SpeechRecognition {

  static defaultProps = {
    onStart: () => { },
    onEnd: (message) => { },
    onSpeechStart: () => { },
    onSpeechEnd: () => { },
    onAudioStart: () => { },
    onAudioEnd: () => { },
    onNoMatch: () => { },
    onError: () => { }
  }

  constructor(props) {
    if (!('webkitSpeechRecognition' in window)) {
      throw new NoAPIException("Not found webkitSpeechRecognition, this function is currently supported only for Google Chrome.");
    }

    this.props = Object.assign(SpeechRecognition.defaultProps, props);



    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = false; //Suitable for dictation. 
    this.recognition.interimResults = false;  //If we want to start receiving results even if they are not final.
    this.recognition.lang = "en-US";
    this.recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...

    this.recognition.onstart = () => {
      //Listening (capturing voice from audio input) started.
      //This is a good place to give the user visual feedback about that (i.e. flash a red light, etc.)
      this.props.onStart();
      this.text = "";
    };

    this.recognition.onend = () => {
      //Again – give the user feedback that you are not listening anymore. If you wish to achieve continuous recognition – you can write a script to start the recognizer again here.
      this.props.onEnd(this.text);
    };

    this.recognition.onaudiostart = () => {
      this.props.onAudioStart();
    };
    this.recognition.onaudioend = () => {
      this.props.onAudioEnd();
    };

    this.recognition.onresult = (event) => {
      if (typeof (event.results) === 'undefined') {
        this.recognition.stop();
        return;
      }

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.text += event.results[i][0].transcript;
        }
      }
    };


    this.recognition.onspeechstart = () => {
      this.props.onSpeechStart();
    };

    this.recognition.onspeechend = () => {
      this.props.onSpeechEnd();
    };

    this.recognition.onnomatch = (event) => {
      this.props.onNoMatch();
      console.log("onnomatch!!");
      console.log(event);
    };

    this.recognition.onerror = (event) => {
      this.props.onError();
      console.log("onerror!!");
      console.log(event);
    };
  }

  start = () => {
    this.recognition.start();
  }
}

export default {
  NoAPIException: NoAPIException,
  SpeechRecognition: SpeechRecognition
}