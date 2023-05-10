import { FluentURL } from "../../src/utils.js";
import axios from "axios";
export const onRequestGet: PagesFunction = async context => {
  const reqUrl = new URL(context.request.url);
  const locationID: string | null = reqUrl.searchParams.get("location_id");
  if (!locationID) {
    return new Response("No location ID provided", { status: 400 });
  }

  async function fetchWithTimeout(url: string, options?: RequestInfo, timeout: number = 5000) {
    return fetch(url, Object.assign({ signal: AbortSignal.timeout(timeout) }, options));
  }
  
  const date = new Date();
  const today = date.toLocaleDateString();
  const url = new FluentURL("https://umassdining.com/foodpro-menu-ajax");

  url.addParam("tid", locationID).addParam("date", today).addParam("is_app", "1");
  try {
    const res = await fetchWithTimeout(url.toString());

    if (!res.ok) {
      return new Response(`Error fetching data from Umass Dining API ${res.status}:${res.statusText}`, {
        status: res.status,
      });
    }
    return new Response(await res.text());
  } catch (e) {
    return new Response(`Error fetching data from Umass Dining API ${e}`, {
      status: 500,
    });
  }
};
