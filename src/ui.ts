//import { seeProfile, signIn, signOut } from "./authRedirect";
import { graphConfig } from "./graph";
import { seeProfile, signIn, signOut } from "./authPopup";
// Select DOM elements to work with
const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("SignIn");
const cardDiv = document.getElementById("card-div");
const profileButton = document.getElementById("seeProfile");
const profileDiv = document.getElementById("profile-div");

signInButton!.onclick = signIn;
profileButton!.onclick = seeProfile;

export function showWelcomeMessage(username: string) {
  // Reconfiguring DOM elements
  cardDiv!.style.display = "initial";
  welcomeDiv!.innerHTML = `Welcome ${username}`;
  signInButton!.onclick = signOut;
  signInButton!.setAttribute("class", "btn btn-success");
  signInButton!.innerHTML = "Sign Out";
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
