import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import ScretaryOwl from "./secretary-owl.jsx";

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <div>
      <AppBar
        title="Secretary Owl"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <ScretaryOwl />
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById("App")
);