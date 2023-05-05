/**
 * Helper function to call MS Graph API endpoint
 * using the authorization bearer token scheme
 */
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
export function callMSGraph(endpoint: RequestInfo | URL, token: string, callback: { (data: any, endpoint: any): void; (data: any, endpoint: any): void; (data: any, endpoint: any): void; (data: any, endpoint: any): void; (arg0: any, arg1: any): any; }) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  console.log("request made to Graph API at: " + new Date().toString());

  fetch(endpoint, options)
    .then(response => response.json())
    .then(response => callback(response, endpoint))
    .catch(error => console.log(error));
}
