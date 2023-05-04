// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
import * as msal from "@azure/msal-browser";
import { msalConfig, loginRequest, tokenRequest } from "./authConfig";
import { showWelcomeMessage,updateUI } from "./ui";
const myMSALObj = new msal.PublicClientApplication(msalConfig);
let username = "";

/**
 * A promise handler needs to be registered for handling the
 * response returned from redirect flow. For more information, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/acquire-token.md
 */
myMSALObj
  .handleRedirectPromise()
  .then(handleResponse)
  .catch(error => {
    console.error(error);
  });

function selectAccount() {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccounts = myMSALObj.getAllAccounts();

  if (currentAccounts.length === 0) {
    return;
  } else if (currentAccounts.length > 1) {
    // Add your account choosing logic here
    console.warn("Multiple accounts detected.");
  } else if (currentAccounts.length === 1) {
    username = currentAccounts[0].username;
    showWelcomeMessage(username);
  }
}

function handleResponse(response: msal.AuthenticationResult | null) {
  if (response !== null) {
    username = response.account!.username;
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

  myMSALObj.loginRedirect(loginRequest);
}

export function signOut() {
  /**
   * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
   */

  const logoutRequest = {
    account: myMSALObj.getAccountByUsername(username),
    postLogoutRedirectUri: msalConfig.auth.redirectUri,
  };
  // @ts-ignore
  myMSALObj.logoutRedirect(logoutRequest);
}

function getTokenRedirect(request: msal.RedirectRequest) {
  /**
   * See here for more info on account retrieval:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */
  // @ts-ignore
  request.account = myMSALObj.getAccountByUsername(username);

  return myMSALObj.acquireTokenSilent(request).catch(error => {
    console.warn("silent token acquisition fails. acquiring token using redirect");
    if (error instanceof msal.InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return myMSALObj.acquireTokenRedirect(request);
    } else {
      console.warn(error);
      return null;
    }
  });
}

export function seeProfile() {
  getTokenRedirect(loginRequest)
    .then(response => {
      //@ts-ignore
      callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
    })
    .catch(error => {
      console.error(error);
    });
}
