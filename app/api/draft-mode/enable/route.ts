import {sanityClient} from "@/lib/sanity/client";
import {defineEnableDraftMode} from "next-sanity/draft-mode";

export const {GET} = defineEnableDraftMode({
  client: sanityClient.withConfig({token: process.env.SANITY_API_READ_TOKEN || ""}),
});
