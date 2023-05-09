//import { seeProfile, signIn, signOut } from "./authRedirect";
import { graphConfig } from "./graph";
// Select DOM elements to work with

import * as msal from "@azure/msal-browser";
import { msalConfig, loginRequest, tokenRequest } from "./authConfig";
const msalObj = new msal.PublicClientApplication(msalConfig);
// @ts-ignore
window.msalObj = msalObj;
msalObj.initialize().then(() => {
  console.log("Msal initialized");
  selectAccount();
});

const profileDiv = document.getElementById("profile-div");
const mainText = document.getElementById("main-text");

const signInPopupButton = document.getElementById("signInPopup");
signInPopupButton!.onclick = () => {
  signInPopup();
  //profileButton!.onclick = authPopup.seeProfile;
};

const signInRedirectButton = document.getElementById("signInRedirect");
signInRedirectButton!.onclick = () => {
  signInRedirect();
  //profileButton!.onclick = authRedirect.seeProfile;
  //signOut = authRedirect.signOutRedirect;
};

export function showWelcomeMessage(user: msal.AccountInfo) {
  // Reconfiguring DOM elements
  mainText!.innerText = `Welcome to the app ${user.name}!`;
  const accCount = document.getElementById("acc-count");
  accCount!.innerText = `Number of accounts in cache: ${msalObj.getAllAccounts().length}`;
  /*   const cardDiv = document.getElementById("card-div");
  const welcomeDiv = document.getElementById("WelcomeMessage");
  cardDiv!.style.display = "initial";
  welcomeDiv!.innerHTML = `Welcome ${username}`; */
  signInPopupButton!.setAttribute("class", "btn btn-secondary");
  //signInRedirectButton!.setAttribute("class", "btn btn-secondary");
  signInPopupButton!.onclick = signOutPopup;
  //signInRedirectButton!.onclick = signOutRedirect;
  signInPopupButton!.innerHTML = "Sign Out Popup";
  //signInRedirectButton!.innerHTML = "Sign Out Redirect";
}

export function updateUI(data: any, endpoint: any) {
  console.log("Graph API responded at: " + new Date().toString());
  console.log(data);
  if (endpoint === graphConfig.graphMeEndpoint) {
    profileDiv!.innerHTML = "";
    const name = document.createElement("p");
    name.innerHTML = "<strong>Name: </strong>" + data.displayName;
    const email = document.createElement("p");
    email.innerHTML = "<strong>Mail: </strong>" + data.mail;
    profileDiv!.appendChild(name);
    profileDiv!.appendChild(email);
  }
}

function selectAccount() {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccounts = msalObj.getAllAccounts();
  if (currentAccounts.length === 0) {
    return;
  } else if (currentAccounts.length > 1) {
    // Add choose account code here
    console.warn("Multiple accounts detected.");
  } else if (currentAccounts.length === 1) {
    const user = currentAccounts[0];
    showWelcomeMessage(user);
  }
}

function handleResponse(resp: msal.AuthenticationResult) {
  if (resp !== null && resp.account !== null) {
    window.location.reload();
  } else {
    selectAccount();
  }
}

function signInPopup() {
  msalObj.loginPopup(loginRequest).then((resp: msal.AuthenticationResult) => {
    handleResponse(resp);
  }, console.error);
}

function signInRedirect() {
  msalObj.loginRedirect(loginRequest);
}

function signOutPopup() {
  msalObj.logoutPopup({}).then(() => {
    console.log("logged out");
  });
}

function signOutRedirect() {
  msalObj.logoutRedirect({
    onRedirectNavigate: url => {
      // Return false if you would like to stop navigation after local logout
      return false;
    },
  });
}

if (window.location.href.endsWith("/reload")) {
  console.log("reloading");
  window.location.reload();
}
