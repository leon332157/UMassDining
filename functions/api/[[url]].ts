export const onRequest: PagesFunction = async context => {
  return new Response("Not found", { status: 404 });
};
