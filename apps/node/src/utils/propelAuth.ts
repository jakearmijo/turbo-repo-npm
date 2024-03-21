import propelAuth from "@propelauth/express";

export default propelAuth.initAuth({
  // TODO: It's useful for debugging, but a good idea to turn off in production.
  debugMode: process.env.NODE_ENV === "production" ? false : true,
  authUrl: process.env.PROPEL_AUTH_URL as string,
  apiKey: process.env.PROPEL_AUTH_API_KEY as string,
});
