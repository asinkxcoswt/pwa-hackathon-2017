import $ from "jquery";

const asanaPrdClientId = 372481550736161;
const asanaDevClientId = 372481550736163;

function loginAsana() {
  let clientId = process.env.NODE_ENV === "production" ? asanaPrdClientId : asanaDevClientId;
  let url = `https://app.asana.com/-/oauth_authorize?response_type=token&client_id=${clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2F&state=auth`;
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

export default {
  loginAsana: loginAsana,
  testAsanaAccessToken: testAsanaAccessToken
}