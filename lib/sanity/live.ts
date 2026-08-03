import {defineLive} from "next-sanity/live";
import {sanityClient} from "@/lib/sanity/client";

export const {sanityFetch, SanityLive} = defineLive({
  client: sanityClient,
  serverToken: process.env.SANITY_API_READ_TOKEN,
});
