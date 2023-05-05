fetch("https://umassdining.com/uapp/get_infov2")
  .then(res => res.json())
  .then(console.log);
fetch("https://umassdining.com/foodpro-menu-ajax?tid=4&date=05%2F04%2F2023&is_app=1")
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)));
