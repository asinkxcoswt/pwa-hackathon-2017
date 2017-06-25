import $ from "jquery";

const asanaPrdClientId = 372481550736161;
const asanaDevClientId = 372481550736163;

function loginAsana() {
  let clientId = asanaPrdClientId;
  let url = `https://app.asana.com/-/oauth_authorize?response_type=token&client_id=372481550736161&redirect_uri=https%3A%2F%2Fpwa-hackathon-2017-481be.firebaseapp.com%2F&state=auth`;
  window.open(url, "_self");
}

function testAsanaAccessToken(token) {
  return $.ajax({
    url: "https://app.asana.com/api/1.0/users/me",
    data: {},
    type: "GET",
    crossDomain: true,
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", "Bearer " + token);
    }
  });
}

function getMyIncompletedAsanaTasks(token, args) {
  if (args && args.workspaceId) {
    return $.ajax({
      url: "https://app.asana.com/api/1.0/tasks",
      data: {
        "assignee": "me",
        "workspace": args.workspaceId,
        "completed": false,
        "opt_fields": "assignee.name,name,completed,completed_at,created_at,due_at,workspace"
      },
      type: 'GET',
      crossDomain: true,
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    });
  } else {
    return getMyWorkspaceList(token).then((response) => {
      return $.when.apply($,
        response.data.map(ws => getMyIncompletedAsanaTasks(token, { workspaceId: ws.id }))
      );
    });
  }
}

function getMyWorkspaceList(token) {
  return $.ajax({
    url: "https://app.asana.com/api/1.0/workspaces",
    data: {},
    type: 'GET',
    crossDomain: true,
    beforeSend: function (request) {
      request.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  });
}

function getProjectList(token) {
  return $.ajax({
    url: "https://app.asana.com/api/1.0/projects",
    data: {},
    type: 'GET',
    crossDomain: true,
    beforeSend: function (request) {
      request.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  });
}

function getEvent(token, args) {
  return $.ajax({
    url: "https://app.asana.com/api/1.0/events",
    data: {
      resource: args.projectId,
      sync: args.sync
    },
    type: 'GET',
    crossDomain: true,
    beforeSend: function (request) {
      request.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  })
}

function notify(message) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(message);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(message);
      }
    });
  }
}

export default {
  loginAsana: loginAsana,
  testAsanaAccessToken: testAsanaAccessToken,
  getMyIncompletedAsanaTasks: getMyIncompletedAsanaTasks,
  getMyWorkspaceList: getMyWorkspaceList,
  getEvent: getEvent,
  notify: notify,
  getProjectList: getProjectList
}