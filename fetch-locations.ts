import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { DiningLocations } from "./src/locations";

const jsonPath = join(process.cwd(), "src", "assets", "locations.json");
if (existsSync(jsonPath)) {
  console.log(`${jsonPath} exists, skipping fetch`);
  process.exit(0);
}
const resp = await fetch("https://umassdining.com/uapp/get_infov2");
if (!resp.ok) {
  console.error(`Error fetching data from UMass Dining ${resp.status}:${resp.statusText}`);
  process.exit(1);
}
const data: DiningLocations = await resp.json();
const parsed = { lastUpdatedHuman: new Date().toLocaleString(), lastUpdated: new Date().getTime(), data: data };

writeFileSync(jsonPath, JSON.stringify(parsed, null, 2));
//TODO: check up to date
