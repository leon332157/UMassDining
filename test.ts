
fetch("https://umassdining.com/uapp/get_infov2")
  .then(res => res.json())
  .then(console.log);
const date = new Date();
const today = date.toLocaleDateString();
const url = new URL("https://umassdining.com/foodpro-menu-ajax");
url.searchParams.append("tid", "4");
url.searchParams.append("date", today);
url.searchParams.append("is_app", "1");

fetch(url.toString())
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)));
