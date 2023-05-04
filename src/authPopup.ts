// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
import * as msal from "@azure/msal-browser";
import { msalConfig, loginRequest, tokenRequest } from "./authConfig";
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let username = "";

function selectAccount() {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccounts = myMSALObj.getAllAccounts();
  if (currentAccounts.length === 0) {
    return;
  } else if (currentAccounts.length > 1) {
    // Add choose account code here
    console.warn("Multiple accounts detected.");
  } else if (currentAccounts.length === 1) {
    username = currentAccounts[0].username;
    showWelcomeMessage(username);
  }
}

function handleResponse(response: msal.AuthenticationResult) {
  /**
   * To see the full list of response object properties, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
   */

  if (response !== null && response.account !== null) {
    username = response.account.username;
    showWelcomeMessage(username);
  } else {
    selectAccount();
  }
}

export function signIn() {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  myMSALObj
    .loginPopup(loginRequest)
    .then((resp: msal.AuthenticationResult) => handleResponse(resp))
    .catch(error => {
      console.error(error);
    });
}

export function signOut() {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  const logoutRequest = {
    account: myMSALObj.getAccountByUsername(username),
    postLogoutRedirectUri: msalConfig.auth.redirectUri,
    mainWindowRedirectUri: msalConfig.auth.redirectUri,
  };
  //@ts-ignore
  myMSALObj.logoutPopup(logoutRequest);
}

function getTokenPopup(request: msal.PopupRequest) {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  // @ts-ignore
  request.account = myMSALObj.getAccountByUsername(username);

  return myMSALObj.acquireTokenSilent(request).catch(error => {
    console.warn("silent token acquisition fails. acquiring token using popup");
    if (error instanceof msal.InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return myMSALObj
        .acquireTokenPopup(request)
        .then(tokenResponse => {
          console.log(tokenResponse);
          return tokenResponse;
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.warn(error);
      return null;
    }
  });
}

function seeProfile() {
  getTokenPopup(loginRequest)
    .then(response => {
      if (response) {
        callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
      } else {
        console.error("token acquisition fails");
      }
    })
    .catch(error => {
      console.error(error);
    });
}

selectAccount();
