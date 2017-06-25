import OwlSay from "./owlsay.jsx";
import React from "react";
import StringSim from "string-similarity";
import API from "./api.jsx";
import QueryString from "query-string";

export class SecretaryOwl extends React.Component {

  static defaultProps = {
    secondsToWaitForUserInput: 10,
    onInitAvailableJobList: (availableJobList) => { },
    context: {}
  }

  getAvailableJobList = () => {
    if (this._availableJobList) {
      return this._availableJobList;
    }

    return this._availableJobList = [
      {
        desc: "Change language to Thai",
        descTH: "เปลี่ยนเป็นภาษาอังกฤษ",
        type: "ONETIME",
        action: () => {
          let currentLang = this.props.context.lang;
          let newLang = currentLang === "EN" ? "TH" : "EN";
          this.props.context.setLang(newLang);
          this.setState({
            owlAction: "CHEER",
            message: "The language has been changed to English",
            messageTH: "เปลี่ยนเป็นภาษาไทยแล้ว"
          });
        }
      },
      {
        desc: "Login to Asana",
        descTH: "ลงชื่อเข้าใช้ Asana",
        action: () => {
          API.loginAsana();
        }
      },
      {
        desc: "Suggest a task you should do next",
        descTH: "แนะนำงานที่ควรทำเป็นลำดับถัดไป",
        type: "ONETIME",
        action: () => {
          this.setState({
            owlAction: "CHEER",
            message: "...",
            messageTH: "..."
          });
        }
      },
      {
        desc: "Postpone and rearrange over-due tasks",
        descTH: "เลื่อนและจัดลำดับงานที่เลยกำหนดเวลา",
        type: "ONETIME",
        action: () => {
          this.setState({
            owlAction: "CHEER",
            message: "...",
            messageTH: "..."
          });
        }
      },
      {
        desc: "Find friends who can help handle overflow task list",
        descTH: "หาเพื่อนมาช่วยงานที่น่าจะทำไม่ทัน",
        type: "ONETIME",
        action: () => {
          this.setState({
            owlAction: "CHEER",
            message: "...",
            messageTH: "..."
          });
        }
      },
      {
        desc: "Notify you when a task assigned to you",
        descTH: "แจ้งเตือนเมื่อมีงานถูกมอบหมาย",
        type: "NOTIFICATION",
        action: () => {
          this.setState({
            owlAction: "CHEER",
            message: "...",
            messageTH: "..."
          });
        }
      },
      {
        desc: "Notify you when someone comment in a task you follow",
        descTH: "แจ้งเตือนเมื่อมีคนคอมเมนต์ในงานที่คุณติดตามอยู่",
        type: "NOTIFICATION",
        action: () => {
          this.setState({
            owlAction: "CHEER",
            message: "...",
            messageTH: "..."
          });
        }
      },
      {
        desc: "Notify you when your task is over due",
        descTH: "แจ้งเตือนเมื่อพบงานที่เลยกำหนดเวลา",
        type: "NOTIFICATION",
        action: () => {
          this.setState({
            owlAction: "CHEER",
            message: "...",
            messageTH: "..."
          });
        }
      }
    ];
  }

  getEventHandlers = () => {
    if (this._eventHandlers) {
      return this._eventHandlers;
    }

    return this._eventHandlers = {
      userGoingToSay: () => {
        this.removeAllJobs();
        this.setState({ owlAction: "SLEEPY", message: "I'm listening.", messageTH: "ต้องการให้เราทำอะไรบอกมาเลยจ้า" });
      },
      userIsSaying: () => {
        this.setState({ owlAction: "WONDER", message: "I here you!!", messageTH: "อืมๆ ... อืมๆ ..." });
      },
      userFinishedSaying: (userMessage) => {
        this.setState({
          owlAction: "SLEEP",
          message: "I'm processing you message: '" + userMessage + "'",
          messageTH: "เธอบอกว่า '" + userMessage + "' งั้นหรอ ขอคิดแป๊บนะ ..."
        }, () => {
          this.addJob(() => this.processUserMessage(userMessage), 5);
        });

      }
    };
  }

  setUserAsanaAccessToken = (token) => {
    this._userAsanaAccessToken = token;
  }

  getUserAsanaAccessToken = () => {
    return this._userAsanaAccessToken;
  }

  ensureAsanaAccess = (callback) => {
    let accessToken = this.getUserAsanaAccessToken();
    if (!accessToken) {
      this.setState({
        owlAction: "ANGRY",
        message: <p>I don't have access to your Asana account, please tell me to 'Login to Asana'</p>,
        messageTH: <p>เรายังไม่มีสิทธิเข้าใช้งาน Asana ของเธอ ลองบอกให้เรา 'ลงชื่อเข้าใช้ Asana' ก่อนสิ</p>,
      });
      return;
    }

    API.testAsanaAccessToken(accessToken).done((response) => {
      console.log(response);
      callback.call(this);
    }).fail((error) => {
      console.log(error);
      this.setState({
        owlAction: "ANGRY",
        message: <p>Your Asana access token is not valid anymore, maybe it has expired, please tell me to 'Login to Asana' again.</p>,
        messageTH: <p>สิทธิ์การเข้าใช้งาน Asana ของเธอใช้ไม่ได้แล้ว มันคงจะหมดอายุ ลองบอกให้เรา 'ลงชื่อเข้าใช้ Asana' อีกทีนะ</p>,
      });
    });
  }

  constructor(props) {
    super(props);
    this.jobRefs = [];
    this.state = {
      owlAction: "SUGGEST",
      message: <p>Hi!, please <b>click or tab on me</b> when you want to tell me to do something. You can open the <b>top right menu</b> to see what I can do. If you don't tell me to do anything for a while, I will do <b>some notification jobs</b> for you because I am a sleepless owl!</p>,
      messageTH: <p>สวัสดีจ้า! เราคือนกฮูกเลขา เราจะช่วยเธอจัดการกับรายการงานอันเละเทะใน Asana ของเธอ <b>เมนูด้านบนขวามือ</b>มีรายการสิ่งที่เราทำได้ในตอนนี้ ซึ่งมีทั้งสิ่งที่เราจะทำเมื่อเธอสั่งและสิ่งที่เราจะทำเองและ<b>แจ้งเตือน</b>เธออยู่เรื่อยๆ ถ้าเธอต้องการบอกให้เราทำอะไรก็<b>กดที่ตัวเรา</b>และพูดผ่านไมค์ได้เลย</p>,
    };

    let requestHashParams = QueryString.parse(location.hash);
    if (requestHashParams.access_token) {
      this.setUserAsanaAccessToken(requestHashParams.access_token);
      this.ensureAsanaAccess(() => {
        this.setState({
          owlAction: "CHEER",
          message: <p>Welcome back! I have logged into your Asana account.</p>,
          messageTH: <p>ยินดีด้วย! เราลงชื่อเข้าใช้ Asana ของเธอเรียบร้อยแล้ว</p>,
        });
      });
    }
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
    if (!userMessage) {
      this.setState({
        owlAction: "ANGRY",
        message: "I cannot get the words, maybe your voice are too low, please try speak louder.",
        messageTH: "เราไม่ค่อยได้ยินที่เธอพูดเลย ลองใหม่อีกครั้งนะ"
      });
      return;
    }

    let jobs = this.getAvailableJobList().map(job => {
      job.similarity = StringSim.compareTwoStrings(userMessage, this.props.context.lang === "EN" ? job.desc : job.descTH)
      return job
    }).sort((a, b) => b.similarity - a.similarity);

    console.log(jobs);
    let mostMatched = jobs[0];
    let similarityPercent = Math.round(mostMatched.similarity * 100 * 100) / 100;
    if (mostMatched.similarity < 0.5) {
      this.setState({
        owlAction: "ANGRY",
        message: "Your request doesn't seem to be similar to any one in my job lists, Please see the top right menu for what I can do. (confident level : " + similarityPercent + "%)",
        messageTH: "สิ้งที่เธอสั่งเหมือนจะไม่มีในรายการความสามารถของเรานะ ลองเปิดเมนูขวาบนดูก่อนนะ (ระดับความมั่นใจ : " + similarityPercent + "%)"
      });
      return;
    }

    if (mostMatched.type === "NOTIFICATION") {
      this.setState({
        owlAction: "ANGRY",
        message: "Look like your want me to '" + mostMatched.desc + "', but you have no need to tell me to do the notification task, I will do it anytime when you ignore me. (confident level : " + similarityPercent + "%)",
        messageTH: "เธอต้องการให้เรา '" + mostMatched.descTH + "' งั้นหรอ แต่งานนี้มันเป็นงานแจ้งเตือน เธอไม่ต้องบอกหรอกเราทำอยู่เรื่อยๆ อยู่แล้ว (ระดับความมั่นใจ : " + similarityPercent + "%)"
      });
      return;
    }


    this.setState({
      owlAction: "KNOW_WHAT_YOU_MEAN",
      message: "I got it! You want me to '" + mostMatched.desc + "', I will do it right away. (confident level : " + similarityPercent + "%)",
      messageTH: "จะให้เรา '" + mostMatched.descTH + "' หรอ ได้เลยๆ เดี๋ยวทำให้ (ระดับความมั่นใจ : " + similarityPercent + "%)"
    }, () => {
      this.addJob(mostMatched.action, 5);
    });
  }

  render() {
    console.log("## ")
    console.log(this.props.context)
    return (
      <div style={{
        width: window.innerWidth,
        height: window.innerHeight,
        position: "relative",
        textAlign: "center"
      }}>
        <div style={{
          width: window.innerHeight / 2,
          height: window.innerHeight / 2,
          display: "inline-table",
          marginTop: 15
        }}>
          <OwlSay
            onUserGoingToSay={this.getEventHandlers().userGoingToSay}
            onUserFinishedSaying={this.getEventHandlers().userFinishedSaying}
            onUserIsSaying={this.getEventHandlers().userIsSaying}
            owlAction={this.state.owlAction}
            message={this.props.context.lang === "EN" ? this.state.message : this.state.messageTH}
            context={this.props.context} />
        </div>
      </div>
    );
  }
}

export default SecretaryOwl;