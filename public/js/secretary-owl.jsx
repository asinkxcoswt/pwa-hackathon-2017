import OwlSay from "./owlsay.jsx";
import React from "react";
import StringSim from "string-similarity";

// job's action has to return a promise with 2 params (owlAction, resultMessage)
const AVAILABLE_JOBS = [
  {
    desc: "Change language to Thai",
    descTH: "เปลี่ยนเป็นภาษาอังกฤษ",
    type: "ONE_TIME",
    action: () => {

    }
  },
  {
    desc: "Suggest a task you should do next",
    descTH: "แนะนำงานที่ควรทำเป็นลำดับถัดไป",
    type: "ONE_TIME"
  },
  {
    desc: "Postpone and rearrange over-due tasks",
    descTH: "เลื่อนและจัดลำดับงานที่เลยกำหนดเวลา",
    type: "ONE_TIME"
  },
  {
    desc: "Find friends who can help handle overflow task list",
    descTH: "หาเพื่อนมาช่วยงานที่น่าจะทำไม่ทัน",
    type: "ONE_TIME"
  },
  {
    desc: "Notify you when a task assigned to you",
    descTH: "แจ้งเตือนเมื่อมีงานถูกมอบหมาย",
    type: "NOTIFICATION"
  },
  {
    desc: "Notify you when someone comment in a task you follow",
    descTH: "แจ้งเตือนเมื่อมีคนคอมเมนต์ในงานที่คุณติดตามอยู่",
    type: "NOTIFICATION"
  },
  {
    desc: "Notify you when your task is over due",
    descTH: "แจ้งเตือนเมื่อพบงานที่เลยกำหนดเวลา",
    type: "NOTIFICATION"
  }
];


export class SecretaryOwl extends React.Component {

  static defaultProps = {
    secondsToWaitForUserInput: 10,
    context: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      owlAction: "SUGGEST",
      message: <p>Hi!, please <b>click or tab on me</b> when you want to tell me to do something. You can open the <b>top right menu</b> to see what I can do. If you don't tell me to do anything for a while, I will do <b>some notification jobs</b> for you because I am a sleepless owl!</p>,
      messageTH: <p>สวัสดีจ้า!, เราคือนกฮูกเลขา เราจะช่วยเธอจัดการกับรายการงานอันเละเทะใน Asana ของเธอ <b>เมนูด้านบนขวามือ</b>มีรายการสิ่งที่เราทำได้ในตอนนี้ ซึ่งมีทั้งสิ่งที่เราจะทำเมื่อเธอสั่งและสิ่งที่เราจะทำเองและ<b>แจ้งเตือน</b>เธออยู่เรื่อยๆ ถ้าเธอต้องการบอกให้เราทำอะไรก็<b>กดที่ตัวเรา</b>และพูดผ่านไมค์ได้เลย</p>,
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
      if (!userMessage) {
        this.setState({
          owlAction: "ANGRY",
          message: "I cannot get the words, maybe your voice are too low, please try speak louder.",
          messageTH: "เราไม่ค่อยได้ยินที่เธอพูดเลย ลองใหม่อีกครั้งนะ"
        });
        return;
      }

      let jobs = AVAILABLE_JOBS.map(job => {
        job.similarity = StringSim.compareTwoStrings(userMessage, this.props.context.lang === "EN" ? job.desc : job.descTH)
        return job
      }).sort((a, b) => b.similarity - a.similarity);

      console.log(jobs);
      let mostMatched = jobs[0];
      let similarityPercent = Math.round(mostMatched.similarity*100*100)/100;
      if (mostMatched.similarity < 0.5) {
        this.setState({
          owlAction: "ANGRY",
          message: "Your request doesn't seem to be similar to any one in my job lists, Please see the top right menu for what I can do. (confident level : "+similarityPercent+"%)",
          messageTH: "สิ้งที่เธอสั่งเหมือนจะไม่มีในรายการความสามารถของเรานะ ลองเปิดเมนูขวาบนดูก่อนนะ (ระดับความมั่นใจ : "+similarityPercent+"%)"
        });
        return;
      }

      if (mostMatched.type === "NOTIFICATION") {
        this.setState({
          owlAction: "ANGRY",
          message: "Look like your want me to '" + mostMatched.desc + "', but you have no need to tell me to do the notification task, I will do it anytime when you ignore me. (confident level : "+similarityPercent+"%)",
          messageTH: "เธอต้องการให้เรา '" + mostMatched.descTH + "' งั้นหรอ แต่งานนี้มันเป็นงานแจ้งเตือน เธอไม่ต้องบอกหรอกเราทำอยู่เรื่อยๆ อยู่แล้ว (ระดับความมั่นใจ : "+similarityPercent+"%)"
        });
        return;
      }


      this.setState({
        owlAction: "KNOW_WHAT_YOU_MEAN",
        message: "I got it! You want me to '" + mostMatched.desc + "', I will do it right away. (confident level : "+similarityPercent+"%)",
        messageTH: "จะให้เรา '" + mostMatched.descTH + "' หรอ ได้เลยๆ เดี๋ยวทำให้ (ระดับความมั่นใจ : "+similarityPercent+"%)"
      }, () => {
        mostMatched.action.call(this).then((owlAction, resultMessage) => {
          this.setState({ owlAction: owlAction, message: resultMessage });
        });
      });
    }, 5000);
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
            onUserGoingToSay={this.eventHandlers.userGoingToSay}
            onUserFinishedSaying={this.eventHandlers.userFinishedSaying}
            onUserIsSaying={this.eventHandlers.userIsSaying}
            owlAction={this.state.owlAction}
            message={this.props.context.lang === "EN" ? this.state.message : this.state.messageTH}
            context={this.props.context} />
        </div>
      </div>
    );
  }
}

export default {
  SecretaryOwl: SecretaryOwl,
  AVAILABLE_JOBS: AVAILABLE_JOBS
};