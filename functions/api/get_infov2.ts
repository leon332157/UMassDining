export const onRequestGet = async () => {
  const resp = await fetch("https://umassdining.com/uapp/get_infov2");
  if (!resp.ok) {
    return new Response("Error fetching data from UMass Dining", {
      status: 500,
    });
  }
  return new Response(await resp.text());
};
