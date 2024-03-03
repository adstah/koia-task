export const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://data.ssb.no/api/v0"
    : "https://data.ssb.no/api/v0";
// IMPORTANT: Im aware these are the same, but most of the time there's a local version of backend when it comes to developing, so as a good common practice I just made it like that.
