import React from "react";
import ReactDOM from "react-dom";
import $update from "immutability-helper";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import owl from "./secretary-owl.jsx";
const { SecretaryOwl, AVAILABLE_JOBS } = owl;

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      context: {
        lang: "TH",
        setLang: (lang) => {
          this.setState({
            context: $update(this.state.context, { $merge: { lang: lang } })
          });
        }
      }
    };
  }

  closeLeftNav = () => {

  }

  render() {
    console.log("# ")
    console.log(this.state.context)
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Secretary Owl"
            iconElementLeft={<img src="../img/owl/owl0.png" style={{
              maxWidth: "100px",
              maxHeight: "100px"
            }} />}
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                {
                  AVAILABLE_JOBS.map((job, idx) => {
                    return <MenuItem key={idx} primaryText={this.state.context.lang === "EN" ? job.desc : job.descTH} />
                  })
                }
              </IconMenu>
            }
          />
          <SecretaryOwl context={this.state.context} />
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("App")
);